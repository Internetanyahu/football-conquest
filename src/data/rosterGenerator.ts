/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Athlete, County, Position } from '../types/game';

const FIRST_NAMES_ANGLO = ['Arthur', 'Edward', 'Thomas', 'Vance', 'William', 'Cyrus', 'George', 'Silas', 'Thaddeus', 'Amos', 'Elias', 'Gideon'];
const LAST_NAMES_ANGLO = ['Sterling', 'Winthrop', 'Bradford', 'Hawthorne', 'Prescott', 'Pendleton', 'Alden', 'Standish', 'Carver', 'Holloway', 'Winslow'];

const FIRST_NAMES_FRENCH = ['Jean-Luc', 'Henri', 'Gaston', 'Émile', 'Pierre', 'Antoine', 'François', 'Marcel', 'Luc', 'Sébastien', 'Étienne'];
const LAST_NAMES_FRENCH = ['Tremblay', 'Frontenac', 'Gagnon', 'Roy', 'Bouchard', 'Gauthier', 'Morin', 'Lavoie', 'Pelletier', 'Belanger', 'Lévesque'];

const FIRST_NAMES_INDIGENOUS = ['Attakullakulla', 'Sequoyah', 'Tatanka', 'Kitchi', 'Takoda', 'Mato', 'Cheveyo', 'Ahanu', 'Enoli', 'Nita', 'Chayton', 'Dyami'];
const LAST_NAMES_INDIGENOUS = ['Tallchief', 'Red Elk', 'Cloud', 'Ironclad', 'Running Bear', 'Blackwood', 'Hawk', 'Littlefeather', 'Bowman', 'Whitehorse', 'Riverstone'];

const FIRST_NAMES_SPANISH = ['Mateo', 'Diego', 'Alejandro', 'Rafael', 'Javier', 'Carlos', 'Santiago', 'Esteban', 'Manuel', 'Joaquín', 'Ignacio'];
const LAST_NAMES_SPANISH = ['Vallejo', 'Castro', 'Del Valle', 'Navarro', 'Serrano', 'Alvarado', 'Carrillo', 'Morales', 'Paredes', 'Figueroa', 'Montoya'];

const FIRST_NAMES_CARIBBEAN = ['Jacques', 'Marcus', 'Toussaint', 'Jean-Baptiste', 'Dumas', 'André', 'Lucian', 'Gabriel', 'Dante', 'Kofi', 'Kwame'];
const LAST_NAMES_CARIBBEAN = ['Louverture', 'Dessalines', 'Baptiste', 'Saint-Just', 'Bellegarde', 'Hyppolite', 'Célestin', 'Auguste', 'Moïse', 'Dorival'];

const FIRST_NAMES_DUTCH = ['Cornelis', 'Dirk', 'Hendrik', 'Pieter', 'Willem', 'Barent', 'Roelof', 'Gerrit', 'Adriaen', 'Johannes'];
const LAST_NAMES_DUTCH = ['Van Rensselaer', 'Stuyvesant', 'Van Cortlandt', 'Schuyler', 'Ten Eyck', 'Van Buren', 'De Peyster', 'Bogaert', 'Onderdonk'];

const SKIN_TONES = [
  '#f5d0b5', '#e8b999', '#d49870', '#c68642',
  '#8d5524', '#703c15', '#49260c', '#331908'
];

const HAIR_COLORS = [
  '#1c1917', '#292524', '#44403c', '#78350f',
  '#b45309', '#eab308', '#d6d3d1'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(val: number, min: number = 30, max: number = 99): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

export function generateAthlete(
  county: County,
  position: Position,
  preferredNumber?: number
): Athlete {
  const culture = county.dominantCulture.toLowerCase();
  let firstNames = FIRST_NAMES_ANGLO;
  let lastNames = LAST_NAMES_ANGLO;

  if (culture.includes('french') || culture.includes('canadien') || culture.includes('acadien')) {
    firstNames = FIRST_NAMES_FRENCH;
    lastNames = LAST_NAMES_FRENCH;
  } else if (culture.includes('cherokee') || culture.includes('lakota') || culture.includes('indigenous') || culture.includes('creek') || culture.includes('ojibwe')) {
    firstNames = FIRST_NAMES_INDIGENOUS;
    lastNames = LAST_NAMES_INDIGENOUS;
  } else if (culture.includes('spanish') || culture.includes('californio') || culture.includes('vaquero') || culture.includes('tejano')) {
    firstNames = FIRST_NAMES_SPANISH;
    lastNames = LAST_NAMES_SPANISH;
  } else if (culture.includes('caribbean') || culture.includes('haitian') || culture.includes('afro')) {
    firstNames = FIRST_NAMES_CARIBBEAN;
    lastNames = LAST_NAMES_CARIBBEAN;
  } else if (culture.includes('dutch') || culture.includes('patroon')) {
    firstNames = FIRST_NAMES_DUTCH;
    lastNames = LAST_NAMES_DUTCH;
  }

  const name = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
  const baseRating = county.footballTalent * 0.7 + (Math.random() * 25 - 5);

  let speed = clamp(baseRating + (Math.random() * 16 - 8));
  let passAcc = clamp(baseRating * 0.4 + (Math.random() * 20));
  let passPow = clamp(baseRating * 0.4 + (Math.random() * 20));
  let catching = clamp(baseRating * 0.6 + (Math.random() * 20));
  let tackling = clamp(baseRating * 0.6 + (Math.random() * 20));
  let strength = clamp(baseRating * 0.7 + (Math.random() * 16 - 8));
  const stamina = clamp(60 + Math.random() * 35);
  const morale = clamp(70 + Math.random() * 25);

  // Positional specialization
  switch (position) {
    case 'QB':
      speed = clamp(speed * 0.85);
      passAcc = clamp(baseRating + 10 + Math.random() * 10);
      passPow = clamp(baseRating + 8 + Math.random() * 12);
      catching = clamp(40 + Math.random() * 20);
      tackling = clamp(35 + Math.random() * 20);
      strength = clamp(baseRating * 0.85);
      break;
    case 'RB':
      speed = clamp(baseRating + 12 + Math.random() * 10);
      strength = clamp(baseRating + 8 + Math.random() * 10);
      catching = clamp(baseRating * 0.75 + Math.random() * 15);
      tackling = clamp(45 + Math.random() * 20);
      break;
    case 'WR1':
    case 'WR2':
      speed = clamp(baseRating + 14 + Math.random() * 10);
      catching = clamp(baseRating + 12 + Math.random() * 12);
      strength = clamp(baseRating * 0.7);
      tackling = clamp(40 + Math.random() * 15);
      break;
    case 'TE':
      speed = clamp(baseRating * 0.9);
      strength = clamp(baseRating + 10);
      catching = clamp(baseRating + 8);
      tackling = clamp(baseRating * 0.75);
      break;
    case 'OL':
      speed = clamp(45 + Math.random() * 20);
      strength = clamp(baseRating + 15 + Math.random() * 10);
      tackling = clamp(baseRating * 0.8);
      catching = clamp(30 + Math.random() * 15);
      break;
    case 'DL':
      speed = clamp(55 + Math.random() * 20);
      strength = clamp(baseRating + 14 + Math.random() * 10);
      tackling = clamp(baseRating + 12 + Math.random() * 10);
      break;
    case 'LB':
      speed = clamp(baseRating + 5 + Math.random() * 10);
      strength = clamp(baseRating + 8 + Math.random() * 10);
      tackling = clamp(baseRating + 14 + Math.random() * 10);
      break;
    case 'CB':
    case 'S':
      speed = clamp(baseRating + 12 + Math.random() * 10);
      catching = clamp(baseRating * 0.85 + Math.random() * 10);
      tackling = clamp(baseRating + 8 + Math.random() * 10);
      break;
    case 'K':
      speed = clamp(50 + Math.random() * 20);
      strength = clamp(baseRating + 10);
      passPow = clamp(baseRating + 14); // Used for kicking range
      passAcc = clamp(baseRating + 14); // Used for kicking accuracy
      break;
  }

  const number = preferredNumber || Math.floor(Math.random() * 89) + 10;
  const skinTone = getRandomItem(SKIN_TONES);
  const hairColor = getRandomItem(HAIR_COLORS);
  const age = Math.floor(Math.random() * 9) + 20; // 20 - 28 years old

  return {
    id: `ATH_${county.id}_${position}_${Math.random().toString(36).substr(2, 6)}`,
    name,
    position,
    number,
    age,
    countyOriginId: county.id,
    countyOriginName: county.name,
    speed,
    passAcc,
    passPow,
    catching,
    tackling,
    strength,
    stamina,
    morale,
    condition: 'HEALTHY',
    injuryWeeksLeft: 0,
    skinTone,
    hairColor,
    isCaptain: position === 'QB',
    stats: {
      games: 0,
      passingYards: 0,
      passingTds: 0,
      interceptionsThrown: 0,
      completions: 0,
      passAttempts: 0,
      rushingYards: 0,
      rushingTds: 0,
      carries: 0,
      receptions: 0,
      receivingYards: 0,
      receivingTds: 0,
      tackles: 0,
      sacks: 0,
      interceptions: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
    },
  };
}

export function generateRosterForCounty(county: County): Athlete[] {
  const positions: { pos: Position; num: number }[] = [
    { pos: 'QB', num: 12 },
    { pos: 'RB', num: 28 },
    { pos: 'WR1', num: 81 },
    { pos: 'WR2', num: 88 },
    { pos: 'TE', num: 84 },
    { pos: 'OL', num: 65 },
    { pos: 'DL', num: 92 },
    { pos: 'LB', num: 54 },
    { pos: 'CB', num: 24 },
    { pos: 'S', num: 33 },
    { pos: 'K', num: 3 },
  ];

  return positions.map((p) => generateAthlete(county, p.pos, p.num));
}

// Generates initial rosters for all initial counties
export function generateAllCountyRosters(
  counties: Record<string, County>
): Record<string, Athlete[]> {
  const rosters: Record<string, Athlete[]> = {};
  for (const [id, county] of Object.entries(counties)) {
    rosters[id] = generateRosterForCounty(county);
  }
  return rosters;
}
