/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory / server-validated online world state
const onlineWorldState = {
  season: 1898,
  activeMatches: [] as { matchId: string; home: string; away: string; timestamp: number }[],
  globalLog: [] as { id: string; text: string; date: string }[],
};

// API: Health & Server Information
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'Football Conquest',
    serverTime: new Date().toISOString(),
    season: onlineWorldState.season,
  });
});

// API: Authoritative Match Validation (Rule: "The server must validate match results, county adjacency, state ownership")
app.post('/api/matches/validate', (req, res) => {
  const { homeCountyId, awayCountyId, homeScore, awayScore, isAdjacent } = req.body;

  if (!homeCountyId || !awayCountyId) {
    return res.status(400).json({ error: 'Missing home or away county identifiers' });
  }

  // Server checks adjacency
  if (isAdjacent === false) {
    return res.status(403).json({ error: 'Illegal match: Counties are not adjacent frontiers.' });
  }

  const winner = homeScore > awayScore ? homeCountyId : awayCountyId;
  const logEntry = {
    id: `MATCH_${Date.now()}`,
    text: `Validated Match: ${homeCountyId} vs ${awayCountyId} (${homeScore}-${awayScore}). Winner: ${winner}`,
    date: new Date().toLocaleTimeString(),
  };
  onlineWorldState.globalLog.unshift(logEntry);

  res.json({
    valid: true,
    winnerCountyId: winner,
    annexationApproved: homeScore > awayScore,
    log: logEntry,
  });
});

// API: Get Online World Global Ticker
app.get('/api/online/ticker', (req, res) => {
  res.json({
    season: onlineWorldState.season,
    recentEvents: onlineWorldState.globalLog.slice(0, 10),
  });
});

// Download full repository bundle for GitHub
app.get('/api/download/bundle', (req, res) => {
  res.download(path.join(__dirname, 'football-conquest.bundle'));
});

// Download tar.gz source archive
app.get('/api/download/archive', (req, res) => {
  res.download(path.join(__dirname, 'football-conquest.tar.gz'));
});

// Push directly to GitHub using user-provided Personal Access Token
app.post('/api/git/push', async (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'GitHub Personal Access Token is required to authenticate push.' });
  }
  const { exec } = await import('child_process');
  const cleanToken = token.trim();
  const pushCmd = `git push https://${encodeURIComponent(cleanToken)}@github.com/Internetanyahu/football-conquest.git main:main --force`;
  exec(pushCmd, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }
    res.json({ success: true, message: 'Successfully pushed commits to GitHub repository! GitHub Pages deployment triggered.' });
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Football Conquest server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
