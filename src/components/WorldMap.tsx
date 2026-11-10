/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { County, GameState } from '../types/game';
import { getEligibleNeighborTargets } from '../systems/conquestSystem';
import { Shield, Users, Trophy, MapPin, Swords, Search } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface WorldMapProps {
  gameState: GameState;
  onInitiateMatch: (targetCountyId: string) => void;
  selectedCountyId?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  gameState,
  onInitiateMatch,
  selectedCountyId: initialSelectedId,
}) => {
  const [selectedCountyId, setSelectedCountyId] = useState<string>(
    initialSelectedId || gameState.activeContestedCountyId || 'C_BER'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [countyShapes, setCountyShapes] = useState<any[]>([]);
  const [countyShapeCount, setCountyShapeCount] = useState(0);
  const countyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const countyHitAreas = useRef<Array<{ path: Path2D; countyId: string }>>([]);

  const selectedCounty = gameState.counties[selectedCountyId];
  const playerCoach = gameState.coaches[gameState.playerCoachId];
  const playerCurrentCounty = gameState.counties[playerCoach?.currentCountyId || 'C_BER'];

  useEffect(() => {
    let active = true;
    fetch('https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json')
      .then((response) => {
        if (!response.ok) throw new Error(`County map request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (active && Array.isArray(data.features)) setCountyShapes(data.features);
      })
      .catch((error) => console.warn('County detail map unavailable; using campaign map only.', error));
    return () => { active = false; };
  }, []);

  // Calculate eligible target counties from player's current coach location
  const eligibleTargets = useMemo(() => {
    if (!playerCurrentCounty) return [];
    return getEligibleNeighborTargets(playerCurrentCounty.id, gameState);
  }, [playerCurrentCounty, gameState]);

  const eligibleTargetIds = useMemo(() => {
    return new Set(eligibleTargets.map((c) => c.id));
  }, [eligibleTargets]);
  
  // Render thousands of real county boundaries into a low-resolution canvas.
  // The nearest campaign territory supplies ownership color and click behavior.
  useEffect(() => {
    const canvas = countyCanvasRef.current;
    if (!canvas || countyShapes.length === 0) return;
    const width = 500;
    const height = 330;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#0c0a09';
    context.fillRect(0, 0, width, height);
    const campaignCounties = Object.values(gameState.counties);
    const hitAreas: Array<{ path: Path2D; countyId: string }> = [];
    const project = (point: number[]) => ({
      x: ((point[0] + 126) / 60) * width,
      y: ((50 - point[1]) / 27) * height,
    });
    for (const feature of countyShapes) {
      const geometry = feature?.geometry;
      if (!geometry) continue;
      const polygons = geometry.type === 'Polygon'
        ? [geometry.coordinates]
        : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
      if (!polygons.length) continue;
      const path = new Path2D();
      let sumX = 0;
      let sumY = 0;
      let pointCount = 0;
      for (const polygon of polygons) {
        for (const ring of polygon) {
          if (!Array.isArray(ring) || ring.length < 3) continue;
          ring.forEach((point: number[], index: number) => {
            const projected = project(point);
            if (index === 0) path.moveTo(projected.x, projected.y);
            else path.lineTo(projected.x, projected.y);
            sumX += projected.x;
            sumY += projected.y;
            pointCount++;
          });
          path.closePath();
        }
      }
      if (!pointCount) continue;
      const centerX = sumX / pointCount;
      const centerY = sumY / pointCount;
      if (centerX < 0 || centerX > width || centerY < 0 || centerY > height) continue;
      let nearest = campaignCounties[0];
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (const county of campaignCounties) {
        const dx = county.x / 2 - centerX;
        const dy = county.y / 2 - centerY;
        const distance = dx * dx + dy * dy;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = county;
        }
      }
      const state = gameState.states[nearest.stateId];
      context.fillStyle = nearest.id === selectedCountyId
        ? '#b7791f'
        : eligibleTargetIds.has(nearest.id)
          ? '#28765c'
          : (state?.color || nearest.homeColor);
      context.fill(path, 'evenodd');
      context.strokeStyle = '#0c0a09';
      context.lineWidth = 0.65;
      context.stroke(path);
      hitAreas.push({ path, countyId: nearest.id });
    }
    countyHitAreas.current = hitAreas;
    setCountyShapeCount(hitAreas.length);
  }, [countyShapes, gameState.counties, gameState.states, selectedCountyId, eligibleTargetIds]);

  // Filtered counties for search
  const filteredCounties = useMemo(() => {
    return Object.values(gameState.counties).filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.stateName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = stateFilter === 'ALL' || c.stateId === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [gameState.counties, searchQuery, stateFilter]);

  const handleCountyClick = (county: County) => {
    soundEngine.playClick();
    setSelectedCountyId(county.id);
  };

  const handleChallenge = () => {
    if (selectedCounty && eligibleTargetIds.has(selectedCounty.id)) {
      soundEngine.playWhistle();
      onInitiateMatch(selectedCounty.id);
    }
  };

  const isSelectedCountyChallengeable = selectedCounty && eligibleTargetIds.has(selectedCounty.id);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
      {/* 1. Main Interactive Map Canvas / SVG Area */}
      <div className="flex-1 bg-stone-900 border border-stone-800 rounded-lg p-4 flex flex-col gap-4 shadow-xl">
        {/* Map Header & Search / Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-stone-100">
              North American Territorial Theatre
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search County or State..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 rounded focus:outline-none focus:border-amber-600 w-44"
              />
            </div>

            {/* State Filter Selector */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-stone-950 border border-stone-800 text-xs text-stone-300 py-1 px-2.5 rounded focus:outline-none focus:border-amber-600"
            >
              <option value="ALL">All Sovereign States</option>
              {Object.values(gameState.states).map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.totalCountiesOwned})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status prompt */}
        <div className="flex items-center justify-between text-xs px-2 text-stone-400">
          <div>
            Coach Stationed at:{' '}
            <span className="font-bold text-amber-400">{playerCurrentCounty?.name}</span> (
            {playerCurrentCounty?.stateName})
          </div>
          <div>
            Adjacent Enemy Targets:{' '}
            <span className="font-bold text-emerald-400">{eligibleTargets.length}</span>
          </div>
        </div>

        {/* SVG Interactive Map */}
        <div className="relative w-full aspect-[16/10] bg-stone-950 rounded border border-stone-800/80 overflow-hidden flex items-center justify-center">
          <canvas
            ref={countyCanvasRef}
            aria-label="Pixelated United States county map"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width) * 500;
              const y = ((event.clientY - rect.top) / rect.height) * 330;
              const context = event.currentTarget.getContext('2d');
              if (!context) return;
              for (let i = countyHitAreas.current.length - 1; i >= 0; i--) {
                const area = countyHitAreas.current[i];
                if (context.isPointInPath(area.path, x, y)) {
                  const county = gameState.counties[area.countyId];
                  if (county) handleCountyClick(county);
                  break;
                }
              }
            }}
            className="absolute inset-0 w-full h-full"
            style={{ imageRendering: 'pixelated', cursor: 'crosshair' }}
          />
          <svg
            viewBox="0 0 1000 660"
            className="relative z-10 w-full h-full select-none pointer-events-none"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
          >
            {/* Background Map Water & Continental Outline Tint */}
            <rect width="1000" height="660" fill="transparent" />
            <path
              d="M 100 80 Q 250 60 500 70 Q 750 40 920 80 Q 940 300 880 500 Q 750 640 500 580 Q 280 550 120 450 Q 80 250 100 80 Z"
              fill="transparent"
              stroke="#292524"
              strokeWidth="1.5"
            />

            {/* Inter-County Adjacency Link Lines */}
            {Object.values(gameState.counties).map((county) =>
              county.neighbors.map((nId) => {
                const neighbor = gameState.counties[nId];
                if (!neighbor || county.id > neighbor.id) return null; // Draw each line once
                const isBorderFrontier = county.stateId !== neighbor.stateId;
                return (
                  <line
                    key={`${county.id}-${neighbor.id}`}
                    x1={county.x}
                    y1={county.y}
                    x2={neighbor.x}
                    y2={neighbor.y}
                    stroke={isBorderFrontier ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.12)'}
                    strokeWidth={isBorderFrontier ? 1.5 : 1}
                    strokeDasharray={isBorderFrontier ? '3,3' : undefined}
                  />
                );
              })
            )}

            {/* County Territorial Nodes */}
            {filteredCounties.map((county) => {
              const isSelected = county.id === selectedCountyId;
              const isCoachHere = county.id === playerCurrentCounty?.id;
              const isEligibleTarget = eligibleTargetIds.has(county.id);
              const state = gameState.states[county.stateId];
              const nodeColor = state ? state.color : county.homeColor;

              return (
                <g
                  key={county.id}
                  onClick={() => handleCountyClick(county)}
                  className="cursor-pointer transition-transform duration-150 hover:scale-125 pointer-events-auto"
                  transform={`translate(${county.x}, ${county.y})`}
                >
                  {/* Eligible Target Highlight Pulse Ring */}
                  {isEligibleTarget && (
                    <circle
                      r="19"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="4,3"
                      className="animate-spin"
                    />
                  )}

                  {/* Selected Highlight Ring */}
                  {isSelected && (
                    <circle r="15" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                  )}

                  {/* Coach Station Pin Indicator */}
                  {isCoachHere && (
                    <circle r="16" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="2,2" />
                  )}

                  {/* Main County Circular Domain Node */}
                  <circle
                    r={isSelected ? '10' : '8'}
                    fill={nodeColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '2' : '1'}
                    opacity={isSelected ? 1 : 0.88}
                  />

                  {/* County Name Label */}
                  <text
                    y={16}
                    textAnchor="middle"
                    fill={isSelected ? '#f59e0b' : '#d6d3d1'}
                    fontSize="9.5"
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                    fontWeight={isSelected ? '700' : '500'}
                    className="pointer-events-none drop-shadow"
                  >
                    {county.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="absolute top-3 right-3 z-20 bg-stone-950/85 border border-stone-800 px-2 py-1 rounded text-[10px] text-stone-300">
            {countyShapeCount > 0 ? `${countyShapeCount.toLocaleString()} county outlines · pixelated detail` : 'Loading county boundaries…'}
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-stone-950/85 backdrop-blur-sm border border-stone-800 p-2.5 rounded text-[11px] text-stone-300 flex flex-col gap-1.5 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Player Station</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 bg-emerald-950" />
              <span>Eligible Attack Border</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-red-500/80" />
              <span>Contested Border Frontier</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. County Inspector & Challenge Launch Drawer */}
      <div className="w-full lg:w-96 bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col justify-between gap-5 shadow-xl">
        {selectedCounty ? (
          <div className="flex flex-col gap-4">
            {/* Header Lockup */}
            <div className="border-b border-stone-800 pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  County Territorial Dossier
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-sm border border-white/20"
                  style={{ backgroundColor: selectedCounty.homeColor }}
                />
              </div>
              <h3 className="text-xl font-bold font-display text-stone-100 tracking-wide mt-1">
                {selectedCounty.name}
              </h3>
              <p className="text-xs text-stone-400">
                Part of <strong className="text-stone-200">{selectedCounty.stateName}</strong>
              </p>
            </div>

            {/* Demographic & Football Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-950 p-2.5 rounded border border-stone-800/80">
                <div className="flex items-center gap-1.5 text-stone-400 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Population</span>
                </div>
                <span className="font-mono font-bold text-sm text-stone-200">
                  {selectedCounty.population.toLocaleString()}
                </span>
              </div>

              <div className="bg-stone-950 p-2.5 rounded border border-stone-800/80">
                <div className="flex items-center gap-1.5 text-stone-400 mb-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Football Talent</span>
                </div>
                <span className="font-mono font-bold text-sm text-amber-400">
                  {selectedCounty.footballTalent} / 100
                </span>
              </div>
            </div>

            {/* Culture & Stadium Details */}
            <div className="flex flex-col gap-2 text-xs bg-stone-950 p-3 rounded border border-stone-800/80">
              <div className="flex justify-between">
                <span className="text-stone-500">Regional Culture:</span>
                <span className="font-medium text-stone-300">{selectedCounty.dominantCulture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Home Stadium:</span>
                <span className="font-medium text-stone-300">{selectedCounty.stadiumName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Arena Capacity:</span>
                <span className="font-mono text-stone-300">
                  {selectedCounty.capacity.toLocaleString()} seats
                </span>
              </div>
            </div>

            {/* Adjacent Neighbors List */}
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-stone-400 font-semibold">Adjacent Border Counties:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCounty.neighbors.map((nId) => {
                  const n = gameState.counties[nId];
                  if (!n) return null;
                  const isEnemy = n.stateId !== selectedCounty.stateId;
                  return (
                    <button
                      key={nId}
                      onClick={() => handleCountyClick(n)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
                        isEnemy
                          ? 'bg-red-950/40 text-red-300 border-red-900/50 hover:bg-red-900/50'
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {n.name.split(' ')[0]} {isEnemy && '⚔️'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-stone-500 text-center py-12">
            Select a county on the map to inspect territorial records.
          </div>
        )}

        {/* Challenge Action Button */}
        <div className="border-t border-stone-800 pt-4 flex flex-col gap-2">
          {isSelectedCountyChallengeable ? (
            <button
              onClick={handleChallenge}
              className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs uppercase tracking-wider"
            >
              <Swords className="w-4 h-4" />
              <span>Challenge {selectedCounty.name}</span>
            </button>
          ) : selectedCounty?.id === playerCurrentCounty?.id ? (
            <div className="p-2.5 bg-amber-950/30 border border-amber-900/40 rounded text-center text-xs text-amber-300">
              Your coach is presently stationed here. Select an adjacent enemy territory highlighted in green to wage conquest.
            </div>
          ) : (
            <div className="p-2.5 bg-stone-950 border border-stone-800 rounded text-center text-xs text-stone-500">
              Not directly adjacent to your coach&apos;s current frontier county.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
