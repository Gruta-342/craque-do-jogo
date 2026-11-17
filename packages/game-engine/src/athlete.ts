import type { Athlete, CareerOrigin, Nationality, PlayerAttributes, Position, PreferredFoot } from "@craque/shared";
import { calculateOverall } from "./attributes";

const baseAttributes: PlayerAttributes = {
  finishing: 55, passing: 55, dribbling: 55, ballControl: 55, crossing: 50, marking: 45,
  speed: 60, acceleration: 60, strength: 50, stamina: 58, agility: 58, vision: 52,
  composure: 48, positioning: 52, decisionMaking: 50, leadership: 42
};

const positionBoosts: Record<Position, Partial<PlayerAttributes>> = {
  GK: { positioning: 12, agility: 10, composure: 8, leadership: 5, finishing: -18, marking: 8 },
  CB: { marking: 15, strength: 12, positioning: 10, finishing: -10, speed: -3 },
  LB: { speed: 8, stamina: 10, crossing: 10, marking: 5 },
  RB: { speed: 8, stamina: 10, crossing: 10, marking: 5 },
  CDM: { marking: 10, passing: 8, stamina: 8, positioning: 8 },
  CM: { passing: 10, vision: 10, stamina: 8, ballControl: 6 },
  CAM: { vision: 14, passing: 10, dribbling: 8, finishing: 5, marking: -8 },
  LW: { dribbling: 12, speed: 12, acceleration: 10, finishing: 6, marking: -12 },
  RW: { dribbling: 12, speed: 12, acceleration: 10, finishing: 6, marking: -12 },
  ST: { finishing: 16, positioning: 12, composure: 8, strength: 5, marking: -18 }
};

const originPotential: Record<CareerOrigin, number> = {
  academy_prospect: 82,
  regional_promise: 78,
  unknown_bet: 75,
  international_gem: 86
};

function clamp(value: number, min = 1, max = 99): number {
  return Math.max(min, Math.min(max, value));
}

export function createAthlete(input: {
  name: string;
  nationality: Nationality;
  age: number;
  position: Position;
  origin: CareerOrigin;
  heightCm?: number;
  weightKg?: number;
  preferredFoot?: PreferredFoot;
  archetype?: string;
}): Athlete {
  const attributes = { ...baseAttributes };
  const boosts = positionBoosts[input.position];
  for (const key of Object.keys(boosts) as (keyof PlayerAttributes)[]) {
    attributes[key] = clamp(attributes[key] + (boosts[key] ?? 0));
  }

  // Pequena variação inicial para que atletas da mesma posição não sejam idênticos.
  for (const key of Object.keys(attributes) as (keyof PlayerAttributes)[]) {
    attributes[key] = clamp(attributes[key] + Math.floor(Math.random() * 7) - 3);
  }

  return {
    id: `athlete-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: input.name.trim(),
    nationality: input.nationality,
    age: input.age,
    heightCm: input.heightCm ?? 178,
    weightKg: input.weightKg ?? 72,
    preferredFoot: input.preferredFoot ?? "right",
    position: input.position,
    archetype: input.archetype ?? "Versátil",
    origin: input.origin,
    potential: clamp(originPotential[input.origin] + Math.floor(Math.random() * 9) - 4),
    overall: 1,
    attributes
  };
}

export function finalizeAthlete(athlete: Athlete): Athlete {
  return { ...athlete, overall: calculateOverall(athlete.position, athlete.attributes) };
}
