/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FootballEngine, FieldPlayer } from '../game/footballEngine';
import { Athlete, County, PlayCall } from '../types/game';
import { soundEngine } from '../audio/soundEngine';
import { Shield, Trophy, ArrowRight, Play, FastForward } from 'lucide-react';

interface FootballMatchCanvasProps {
  homeCounty: County;
  awayCounty: County;
  homeRoster: Athlete[];
  awayRoster: Athlete[];
  onMatchComplete: (result: {
    homeScore: number;
    awayScore: number;
    winnerCountyId: string;
    loserCountyId: string;
    statsText: string;
  }) => void;
  onExitMatch?: () => void;
}

const PLAYBOOK: PlayCall[] = [
  {
    id: 'PLAY_WEDGE',
    name: 'The Flying Wedge',
    type: 'RUN',
    description: 'Historic mass-momentum wedge formation. Three lead blockers pave the interior path.',
    isHistoricFlyingWedge: true,
    iconName: 'Shield',
  },
  {
    id: 'PLAY_SWEEP',
    name: 'Off-Tackle Sweep',
    type: 'RUN',
    description: 'Handoff to speedy halfback racing for the outside edge.',
    iconName: 'Play',
  },
  {
    id: 'PLAY_SLANT',
    name: 'Quick Slant',
    type: 'PASS',
    description: 'Inside receiver breaks across the shallow middle at 5 yards.',
    iconName: 'Play',
  },
  {
    id: 'PLAY_POST',
    name: 'Deep Post Route',
    type: 'PASS',
    description: 'Flanker sprints deep toward the goalpost for explosive yardage.',
    iconName: 'FastForward',
  },
  {
    id: 'PLAY_SCREEN',
    name: 'Linemen Screen',
    type: 'PASS',
    description: 'Short dump pass to running back trailing behind pulling linemen.',
    iconName: 'Shield',
  },
];

export const FootballMatchCanvas: React.FC<FootballMatchCanvasProps> = ({
  homeCounty,
  awayCounty,
  homeRoster,
  awayRoster,
  onMatchComplete,
  onExitMatch,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<FootballEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Input states
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const [aimingPos, setAimingPos] = useState<{ x: number; y: number } | null>(null);
  const [hudState, setHudState] = useState<{
    quarter: number;
    gameClock: number;
    down: number;
    distance: number;
    lineOfScrimmage: number;
    homeScore: number;
    awayScore: number;
    phase: string;
    possession: string;
    commentary: string;
    kickMeter: number;
  }>({
    quarter: 1,
    gameClock: 120,
    down: 1,
    distance: 10,
    lineOfScrimmage: 25,
    homeScore: 0,
    awayScore: 0,
    phase: 'PLAY_SELECT',
    possession: 'HOME',
    commentary: 'Select an offensive play to begin drive.',
    kickMeter: 50,
  });

  const [matchEnded, setMatchEnded] = useState(false);
  const weatherParticlesRef = useRef<{ x: number; y: number; speed: number; size: number }[]>([]);

  const callAudible = useCallback(() => {
    const eng = engineRef.current;
    if (!eng || eng.drive.phase !== 'PRE_SNAP') return;
    const currentId = eng.drive.currentPlay?.id;
    const currentIndex = PLAYBOOK.findIndex((p) => p.id === currentId);
    const nextPlay = PLAYBOOK[(currentIndex + 1) % PLAYBOOK.length];
    eng.selectPlay(nextPlay);
    soundEngine.playWhistle();
    eng.drive.playResultText = `AUDIBLE CALLED: Switched to ${nextPlay.name}!`;
  }, []);

  // Initialize Engine
  useEffect(() => {
    const weatherType = ['STATE_LAU', 'STATE_GL'].includes(homeCounty.stateId)
      ? 'SNOW'
      : ['STATE_PAC', 'STATE_HUD'].includes(homeCounty.stateId)
      ? 'RAIN'
      : 'CLEAR';

    const particles: { x: number; y: number; speed: number; size: number }[] = [];
    if (weatherType !== 'CLEAR') {
      for (let i = 0; i < 90; i++) {
        particles.push({
          x: Math.random() * 960,
          y: Math.random() * 540,
          speed: weatherType === 'SNOW' ? 25 + Math.random() * 25 : 220 + Math.random() * 120,
          size: weatherType === 'SNOW' ? 1.5 + Math.random() * 2 : 1 + Math.random() * 1.5,
        });
      }
    }
    weatherParticlesRef.current = particles;

    const engine = new FootballEngine(
      homeCounty.id,
      awayCounty.id,
      homeRoster,
      awayRoster,
      { primary: homeCounty.homeColor, secondary: homeCounty.secondaryColor },
      { primary: awayCounty.homeColor, secondary: awayCounty.secondaryColor },
      weatherType
    );
    engineRef.current = engine;

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [homeCounty, awayCounty, homeRoster, awayRoster]);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.code]: true }));

      const eng = engineRef.current;
      if (!eng) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (eng.drive.phase === 'PRE_SNAP') {
          eng.snapBall();
        } else if (eng.drive.phase === 'ACTIVE_PLAY') {
          eng.performJuke();
        } else if (eng.drive.phase === 'FIELD_GOAL_AIM') {
          eng.resolveKick();
        }
      } else if ((e.code === 'KeyU' || e.code === 'KeyA') && eng.drive.phase === 'PRE_SNAP') {
        e.preventDefault();
        callAudible();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Render & Simulation Loop
  const render = useCallback((time: number) => {
    const dt = Math.min(0.1, (time - lastTimeRef.current) / 1000);
    lastTimeRef.current = time;

    const eng = engineRef.current;
    const canvas = canvasRef.current;

    if (eng && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 1. Process User Steering Input
        let steerX = 0;
        let steerY = 0;
        if (keys['KeyW'] || keys['ArrowUp']) steerY -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) steerY += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) steerX -= 0.6;
        if (keys['KeyD'] || keys['ArrowRight']) steerX += 1;

        if (steerX !== 0 || steerY !== 0) {
          eng.steerCarrier(steerX, steerY);
        }

        // 2. Engine Update
        eng.update(dt);

        // 3. Sync React HUD state
        setHudState({
          quarter: eng.drive.quarter,
          gameClock: Math.max(0, Math.round(eng.drive.gameClock)),
          down: eng.drive.down,
          distance: eng.drive.distance,
          lineOfScrimmage: eng.drive.lineOfScrimmage,
          homeScore: eng.drive.homeScore,
          awayScore: eng.drive.awayScore,
          phase: eng.drive.phase,
          possession: eng.drive.possession,
          commentary: eng.drive.playResultText,
          kickMeter: Math.round(eng.drive.kickMeterValue),
        });

        if (eng.drive.phase === 'GAME_OVER' && !matchEnded) {
          setMatchEnded(true);
        }

        // 4. Draw Canvas Scene
        drawField(ctx, canvas, eng);
      }
    }

    animFrameRef.current = requestAnimationFrame(render);
  }, [keys, matchEnded]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [render]);

  // Screen coordinate conversion:
  // Field is 120 yards long (-10 to 110) and 53.3 yards wide (0 to 53.3).
  // We center camera on the football or line of scrimmage!
  const getScreenCoords = (
    fieldX: number,
    fieldY: number,
    canvasW: number,
    canvasH: number,
    cameraX: number
  ) => {
    const scale = canvasH / 55; // Fit field width vertically with margin
    const screenX = canvasW / 2 + (fieldX - cameraX) * scale;
    const screenY = fieldY * scale + 10;
    return { screenX, screenY, scale };
  };

  const drawField = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, eng: FootballEngine) => {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Camera tracks ball or line of scrimmage
    const cameraTargetX = eng.ball.carrier ? eng.ball.carrier.x : eng.drive.lineOfScrimmage;
    const scale = h / 58;

    // Grass turf (alternating 5-yard stripes of rich gridiron green)
    const startYard = -10;
    const endYard = 110;
    for (let yd = startYard; yd < endYard; yd += 5) {
      const { screenX } = getScreenCoords(yd, 0, w, h, cameraTargetX);
      const isAlt = Math.floor((yd + 10) / 5) % 2 === 0;
      ctx.fillStyle = isAlt ? '#1b4d2e' : '#163f25';
      ctx.fillRect(screenX, 10, 5 * scale, 53.3 * scale);
    }

    // Endzones
    // Left Endzone (Away, -10 to 0)
    const leftEZ = getScreenCoords(-10, 0, w, h, cameraTargetX);
    ctx.fillStyle = awayCounty.homeColor;
    ctx.fillRect(leftEZ.screenX, 10, 10 * scale, 53.3 * scale);
    ctx.save();
    ctx.translate(leftEZ.screenX + 5 * scale, 10 + 26.6 * scale);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(18 * (scale / 12))}px 'Barlow Condensed', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(awayCounty.name.toUpperCase().slice(0, 16), 0, 0);
    ctx.restore();

    // Right Endzone (Home, 100 to 110)
    const rightEZ = getScreenCoords(100, 0, w, h, cameraTargetX);
    ctx.fillStyle = homeCounty.homeColor;
    ctx.fillRect(rightEZ.screenX, 10, 10 * scale, 53.3 * scale);
    ctx.save();
    ctx.translate(rightEZ.screenX + 5 * scale, 10 + 26.6 * scale);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(18 * (scale / 12))}px 'Barlow Condensed', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(homeCounty.name.toUpperCase().slice(0, 16), 0, 0);
    ctx.restore();

    // Yard Lines, Hash Marks & Numbers (0 to 100)
    for (let yd = 0; yd <= 100; yd++) {
      const { screenX } = getScreenCoords(yd, 0, w, h, cameraTargetX);
      if (yd % 5 === 0) {
        ctx.strokeStyle = yd % 10 === 0 ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = yd % 10 === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(screenX, 10);
        ctx.lineTo(screenX, 10 + 53.3 * scale);
        ctx.stroke();

        // Draw yard number every 10 yards
        if (yd > 0 && yd < 100 && yd % 10 === 0) {
          const num = yd <= 50 ? yd : 100 - yd;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.font = `bold ${Math.round(12 * (scale / 10))}px 'Space Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(`${num}`, screenX, 10 + 8 * scale);
          ctx.fillText(`${num}`, screenX, 10 + 47 * scale);
        }
      }
    }

    // Dynamic Markers:
    // Line of Scrimmage (Electric Blue)
    const los = getScreenCoords(eng.drive.lineOfScrimmage, 0, w, h, cameraTargetX);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(los.screenX, 10);
    ctx.lineTo(los.screenX, 10 + 53.3 * scale);
    ctx.stroke();

    // First Down Line (Bright Gold)
    const fdl = getScreenCoords(eng.drive.firstDownLine, 0, w, h, cameraTargetX);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fdl.screenX, 10);
    ctx.lineTo(fdl.screenX, 10 + 53.3 * scale);
    ctx.stroke();

    // Pass trajectory aiming line
    if (aimingPos && eng.ball.carrier && eng.ball.carrier.position === 'QB') {
      const qbCoords = getScreenCoords(eng.ball.carrier.x, eng.ball.carrier.y, w, h, cameraTargetX);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(qbCoords.screenX, qbCoords.screenY);
      ctx.lineTo(aimingPos.x, aimingPos.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Target reticle
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(aimingPos.x, aimingPos.y, 14, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw Players (Sorted by Y for depth layering)
    const sortedPlayers = [...eng.players].sort((a, b) => a.y - b.y);
    for (const p of sortedPlayers) {
      drawPixelPlayer(ctx, p, w, h, cameraTargetX, scale);
    }

    // Draw Ball & Projected Shadow
    drawBall(ctx, eng, w, h, cameraTargetX, scale);

    // Weather Atmosphere Layer (Rain streaks or Snow flurry particles)
    if (eng.weather === 'RAIN') {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (const p of weatherParticlesRef.current) {
        p.y += p.speed * 0.016;
        p.x -= p.speed * 0.005;
        if (p.y > h) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        if (p.x < 0) {
          p.x = w;
        }
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 4, p.y + 11);
      }
      ctx.stroke();
    } else if (eng.weather === 'SNOW') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      for (const p of weatherParticlesRef.current) {
        p.y += p.speed * 0.016;
        p.x += Math.sin(p.y * 0.04) * 0.6;
        if (p.y > h) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        if (p.x > w) {
          p.x = 0;
        }
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  };

  const drawPixelPlayer = (
    ctx: CanvasRenderingContext2D,
    p: FieldPlayer,
    w: number,
    h: number,
    cameraX: number,
    scale: number
  ) => {
    const { screenX, screenY } = getScreenCoords(p.x, p.y, w, h, cameraX);
    const size = Math.round(18 * (scale / 12));

    // Player Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + size * 0.45, size * 0.4, size * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs / Pants (Secondary Color)
    ctx.fillStyle = p.secondaryColor;
    const legOffset = Math.sin(p.x * 2.5) * (Math.abs(p.vx) > 0.1 ? 3 : 0);
    ctx.fillRect(screenX - size * 0.25, screenY + size * 0.15, size * 0.2, size * 0.35 + legOffset);
    ctx.fillRect(screenX + size * 0.05, screenY + size * 0.15, size * 0.2, size * 0.35 - legOffset);

    // Torso / Jersey (Primary Color)
    ctx.fillStyle = p.primaryColor;
    ctx.fillRect(screenX - size * 0.35, screenY - size * 0.25, size * 0.7, size * 0.45);

    // Number on Jersey
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(8, Math.round(size * 0.32))}px 'Barlow Condensed', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${p.number}`, screenX, screenY - size * 0.02);

    // Bare Head (No Helmet as per alternate-history lore!)
    // Skin
    ctx.fillStyle = p.skinTone;
    ctx.beginPath();
    ctx.arc(screenX, screenY - size * 0.42, size * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = p.hairColor;
    ctx.beginPath();
    ctx.arc(screenX, screenY - size * 0.5, size * 0.18, Math.PI, Math.PI * 2);
    ctx.fill();

    // Ball Carrier Highlight Ring
    if (engRef.current?.ball.carrier === p) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screenX, screenY - size * 0.05, size * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Small "YOU" or position badge
      ctx.fillStyle = '#f59e0b';
      ctx.font = `bold 10px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillText('CARRIER', screenX, screenY - size * 0.75);
    }
  };

  const drawBall = (
    ctx: CanvasRenderingContext2D,
    eng: FootballEngine,
    w: number,
    h: number,
    cameraX: number,
    scale: number
  ) => {
    const ball = eng.ball;
    const { screenX, screenY } = getScreenCoords(ball.x, ball.y, w, h, cameraX);

    // Ground Shadow (shrinks and fades as ball flies higher)
    const shadowSize = Math.max(2, 6 - ball.z * 1.5);
    const shadowAlpha = Math.max(0.1, 0.4 - ball.z * 0.05);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 4, shadowSize * 1.5, shadowSize * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Elevated Ball
    const ballY = screenY - ball.z * scale * 1.8;
    ctx.save();
    ctx.translate(screenX, ballY);
    ctx.rotate(ball.vx * 0.05);

    // Leather body
    ctx.fillStyle = '#78350f'; // Dark Brown Leather
    ctx.beginPath();
    ctx.ellipse(0, 0, 6.5, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Laces
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.stroke();

    ctx.restore();
  };

  const engRef = engineRef;

  // Mouse / Touch Aiming Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const eng = engineRef.current;
    if (!canvas || !eng) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (eng.drive.phase === 'PRE_SNAP') {
      eng.snapBall();
      return;
    }

    if (eng.drive.phase === 'ACTIVE_PLAY' && eng.ball.carrier?.position === 'QB') {
      setAimingPos({ x: clientX, y: clientY });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!aimingPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setAimingPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePointerUp = () => {
    if (!aimingPos) return;
    const canvas = canvasRef.current;
    const eng = engineRef.current;
    if (canvas && eng && eng.drive.phase === 'ACTIVE_PLAY') {
      const h = canvas.height;
      const w = canvas.width;
      const scale = h / 58;
      const cameraX = eng.ball.carrier ? eng.ball.carrier.x : eng.drive.lineOfScrimmage;

      // Convert screen pixel coordinates back to field yard coordinates
      const targetYardX = cameraX + (aimingPos.x - w / 2) / scale;
      const targetYardY = (aimingPos.y - 10) / scale;

      eng.throwPass(targetYardX, targetYardY);
    }
    setAimingPos(null);
  };

  const handleSelectPlay = (play: PlayCall) => {
    engineRef.current?.selectPlay(play);
  };

  const handleFieldGoal = () => {
    engineRef.current?.attemptFieldGoal();
  };

  const handlePunt = () => {
    engineRef.current?.puntBall();
  };

  const handleExtraPoint = () => {
    engineRef.current?.kickExtraPoint();
  };

  const handleCompleteMatch = () => {
    const eng = engineRef.current;
    if (!eng) return;

    const winnerId = eng.drive.homeScore >= eng.drive.awayScore ? homeCounty.id : awayCounty.id;
    const loserId = winnerId === homeCounty.id ? awayCounty.id : homeCounty.id;
    const scoreStr = `${eng.drive.homeScore} - ${eng.drive.awayScore}`;

    onMatchComplete({
      homeScore: eng.drive.homeScore,
      awayScore: eng.drive.awayScore,
      winnerCountyId: winnerId,
      loserCountyId: loserId,
      statsText: `Final: ${scoreStr}. Total Pass Yards: ${eng.stats.home.passYards + eng.stats.away.passYards}, Rush Yards: ${eng.stats.home.rushYards + eng.stats.away.rushYards}`,
    });
  };

  return (
    <div className="relative w-full flex flex-col items-center bg-stone-950 select-none">
      {/* 1. Scoreboard HUD */}
      <div className="w-full max-w-5xl bg-stone-900 border-b border-stone-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Teams & Score */}
        <div className="flex items-center gap-6">
          {/* Home Team */}
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-sm shrink-0 border border-white/20"
              style={{ backgroundColor: homeCounty.homeColor }}
            />
            <div className="flex flex-col">
              <span className="font-bold font-display text-sm tracking-wide text-stone-100">
                {homeCounty.name}
              </span>
              <span className="text-[10px] text-stone-400">HOME · {homeCounty.stateName}</span>
            </div>
            <span className="ml-2 font-mono text-2xl font-bold text-amber-400 tabular-nums">
              {hudState.homeScore}
            </span>
          </div>

          <span className="text-stone-600 font-bold">vs</span>

          {/* Away Team */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold text-stone-300 tabular-nums">
              {hudState.awayScore}
            </span>
            <div className="flex flex-col">
              <span className="font-bold font-display text-sm tracking-wide text-stone-100">
                {awayCounty.name}
              </span>
              <span className="text-[10px] text-stone-400">AWAY · {awayCounty.stateName}</span>
            </div>
            <span
              className="w-3.5 h-3.5 rounded-sm shrink-0 border border-white/20"
              style={{ backgroundColor: awayCounty.homeColor }}
            />
          </div>
        </div>

        {/* Game Clock, Quarter & Down */}
        <div className="flex items-center gap-4 font-mono">
          <div className="flex flex-col items-center bg-stone-950 px-2.5 py-1 rounded border border-stone-800">
            <span className="text-[10px] text-stone-500 font-sans uppercase">Quarter</span>
            <span className="text-sm font-bold text-stone-200">
              {hudState.quarter <= 4 ? `Q${hudState.quarter}` : 'OT'}
            </span>
          </div>

          <div className="flex flex-col items-center bg-stone-950 px-3 py-1 rounded border border-stone-800">
            <span className="text-[10px] text-stone-500 font-sans uppercase">Clock</span>
            <span className="text-sm font-bold text-amber-400">
              {Math.floor(hudState.gameClock / 60)}:
              {(hudState.gameClock % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex flex-col items-center bg-stone-950 px-3 py-1 rounded border border-stone-800">
            <span className="text-[10px] text-stone-500 font-sans uppercase">Down</span>
            <span className="text-sm font-bold text-cyan-400">
              {hudState.down} & {hudState.distance}
            </span>
          </div>

          <div className="hidden sm:flex flex-col items-center bg-stone-950 px-2.5 py-1 rounded border border-stone-800">
            <span className="text-[10px] text-stone-500 font-sans uppercase">Field</span>
            <span className="text-xs font-bold text-stone-300">
              {engineRef.current?.weather || 'CLEAR'}
            </span>
          </div>
        </div>

        {/* Exit match early if needed */}
        {onExitMatch && (
          <button
            onClick={onExitMatch}
            className="text-stone-400 hover:text-stone-200 text-xs transition-colors underline"
          >
            Leave Match
          </button>
        )}
      </div>

      {/* 2. Interactive Game Canvas */}
      <div className="relative w-full max-w-5xl aspect-[16/9] bg-stone-900 border border-stone-800 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full cursor-crosshair pixelated touch-none"
        />

        {/* Live Play Commentary Ticker */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-stone-950/85 backdrop-blur-sm border border-stone-700/60 px-4 py-1.5 rounded-md text-xs font-medium text-stone-200 shadow-md whitespace-nowrap pointer-events-none">
          {hudState.commentary}
        </div>

        {/* Touchdown Celebration Overlay */}
        {hudState.phase === 'TOUCHDOWN' && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 z-20">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="w-8 h-8" />
              <h2 className="text-4xl font-extrabold font-display tracking-tight text-white uppercase">
                Touchdown!
              </h2>
            </div>
            <p className="text-sm text-stone-300 max-w-md text-center">
              Sensational scoring drive! Attempt the Point After Touchdown kick to secure the lead.
            </p>
            <button
              onClick={handleExtraPoint}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-md shadow-lg transition-colors cursor-pointer text-sm"
            >
              Kick Extra Point (PAT)
            </button>
          </div>
        )}

        {/* Field Goal Interactive Accuracy Meter Overlay */}
        {hudState.phase === 'FIELD_GOAL_AIM' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-stone-950/90 border border-amber-600/50 p-4 rounded-lg flex flex-col items-center gap-3 z-20 shadow-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Field Goal Accuracy Meter
            </span>
            <div className="relative w-64 h-5 bg-stone-800 rounded-full overflow-hidden border border-stone-700">
              {/* Sweet spot center */}
              <div className="absolute left-[38%] width-[24%] h-full bg-emerald-600/60" />
              <div
                className="absolute top-0 bottom-0 w-3 bg-amber-400 rounded-full shadow"
                style={{ left: `calc(${hudState.kickMeter}% - 6px)` }}
              />
            </div>
            <button
              onClick={() => engineRef.current?.resolveKick()}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-xs uppercase cursor-pointer"
            >
              Kick Ball (Space / Tap)
            </button>
          </div>
        )}

        {/* Final Game Over Modal */}
        {hudState.phase === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 p-6 z-30">
            <div className="flex items-center gap-3 text-amber-400">
              <Trophy className="w-10 h-10" />
              <h2 className="text-3xl font-extrabold font-display text-white uppercase">
                Final Whistle!
              </h2>
            </div>
            <div className="text-xl font-mono text-stone-200">
              {homeCounty.name} {hudState.homeScore} — {hudState.awayScore} {awayCounty.name}
            </div>
            <p className="text-sm text-stone-300 max-w-md text-center">
              {hudState.homeScore > hudState.awayScore
                ? `VICTORY! ${awayCounty.name} has been formally conquered and annexed into ${homeCounty.stateName}!`
                : `DEFEAT. The defense held firm. Regroup and challenge another contested border.`}
            </p>
            <button
              onClick={handleCompleteMatch}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Conclude Match & Update Territory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Offensive Play Selection & Tactical Dashboard */}
      {hudState.phase === 'PLAY_SELECT' && (
        <div className="w-full max-w-5xl bg-stone-900 border border-t-0 border-stone-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-stone-200 uppercase tracking-wide">
                Offensive Play Selection · {homeCounty.name}
              </span>
            </div>
            <span className="text-xs text-stone-400">
              {hudState.down} & {hudState.distance} at yard {hudState.lineOfScrimmage}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {PLAYBOOK.map((play) => (
              <button
                key={play.id}
                onClick={() => handleSelectPlay(play)}
                className={`p-3 text-left rounded border transition-colors cursor-pointer flex flex-col gap-1 ${
                  play.isHistoricFlyingWedge
                    ? 'bg-amber-950/40 border-amber-600/70 hover:bg-amber-900/50'
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700 hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-100 flex items-center gap-1.5">
                    {play.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      play.type === 'RUN' ? 'bg-amber-950 text-amber-300' : 'bg-blue-950 text-blue-300'
                    }`}
                  >
                    {play.type}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-tight line-clamp-2">
                  {play.description}
                </p>
              </button>
            ))}

            {/* 4th Down Special Teams (Field Goal / Punt) */}
            <div className="flex gap-2">
              <button
                onClick={handleFieldGoal}
                className="flex-1 p-3 bg-stone-950 border border-stone-800 hover:border-stone-700 hover:bg-stone-800/60 rounded text-left flex flex-col justify-center cursor-pointer"
              >
                <span className="text-xs font-bold text-stone-200">Field Goal</span>
                <span className="text-[10px] text-stone-400">Attempt 3-Point Kick</span>
              </button>
              <button
                onClick={handlePunt}
                className="flex-1 p-3 bg-stone-950 border border-stone-800 hover:border-stone-700 hover:bg-stone-800/60 rounded text-left flex flex-col justify-center cursor-pointer"
              >
                <span className="text-xs font-bold text-stone-200">Punt Ball</span>
                <span className="text-[10px] text-stone-400">Flip Field Position</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Controls Guide & Mobile On-Screen Action Bar */}
      <div className="w-full max-w-5xl bg-stone-950 border border-t-0 border-stone-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-stone-300 font-semibold">Controls:</span>
          <span><kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-200 rounded font-mono">W A S D</kbd> / <kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-200 rounded font-mono">Arrows</kbd> Steer Runner</span>
          <span><kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-200 rounded font-mono">Drag Mouse/Touch</kbd> Aim Pass</span>
          <span><kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-200 rounded font-mono">Space</kbd> Hike / Juke</span>
          <span><kbd className="px-1.5 py-0.5 bg-stone-800 text-stone-200 rounded font-mono">A / U</kbd> Audible</span>
        </div>

        {/* Mobile touch action triggers */}
        <div className="flex items-center gap-2">
          {hudState.phase === 'PRE_SNAP' && (
            <>
              <button
                onClick={callAudible}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold rounded text-xs uppercase cursor-pointer border border-stone-700"
                title="Change play call at the line of scrimmage"
              >
                Audible (A)
              </button>
              <button
                onClick={() => engineRef.current?.snapBall()}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs uppercase cursor-pointer shadow"
              >
                Hike Ball (Space)
              </button>
            </>
          )}
          {hudState.phase === 'ACTIVE_PLAY' && (
            <button
              onClick={() => engineRef.current?.performJuke()}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded text-xs uppercase cursor-pointer shadow"
            >
              Juke / Burst (Space)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
