import type { Athlete, CareerOrigin, Nationality, PlayerAttributes, Position, PreferredFoot, ArchetypeId } from "@craque/shared";
import { calculateOverall } from "./attributes";
import { getArchetype, getArchetypesForPosition } from "./archetypes";

const baseAttributes: PlayerAttributes = {
  finishing: 55, passing: 55, dribbling: 55, ballControl: 55, crossing: 50, marking: 45,
  speed: 60, acceleration: 60, strength: 50, stamina: 58, agility: 58, vision: 52,
  composure: 48, positioning: 52, decisionMaking: 50, leadership: 42,
  reflexes: 52, elasticity: 52, rushingOut: 50, distribution: 50
};

const positionBoosts: Record<Position, Partial<PlayerAttributes>> = {
  GK: { reflexes: 12, elasticity: 10, rushingOut: 8, distribution: 7, positioning: 8, composure: 8, agility: 5, finishing: -30, marking: -20 },
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
  archetype?: ArchetypeId;
}): Athlete {
  if (!input.name.trim()) throw new Error("O nome do atleta é obrigatório.");
  if (!Number.isInteger(input.age) || input.age < 16 || input.age > 18) throw new Error("A idade inicial deve estar entre 16 e 18 anos.");
  if (input.heightCm !== undefined && (input.heightCm < 140 || input.heightCm > 220)) throw new Error("Altura deve estar entre 140 e 220 cm.");
  if (input.weightKg !== undefined && (input.weightKg < 40 || input.weightKg > 130)) throw new Error("Peso deve estar entre 40 e 130 kg.");

  const availableArchetypes = getArchetypesForPosition(input.position);
  const archetypeId = input.archetype && availableArchetypes.some((item) => item.id === input.archetype)
    ? input.archetype
    : availableArchetypes[0].id;
  const archetype = getArchetype(archetypeId);
  const attributes = { ...baseAttributes };
  const boosts = positionBoosts[input.position];
  for (const key of Object.keys(boosts) as (keyof PlayerAttributes)[]) {
    attributes[key] = clamp(attributes[key] + (boosts[key] ?? 0));
  }
  for (const key of Object.keys(archetype.boosts) as (keyof PlayerAttributes)[]) {
    attributes[key] = clamp(attributes[key] + (archetype.boosts[key] ?? 0));
  }

  // Pequena variação inicial para que atletas da mesma configuração não sejam idênticos.
  for (const key of Object.keys(attributes) as (keyof PlayerAttributes)[]) {
    attributes[key] = clamp(attributes[key] + Math.floor(Math.random() * 5) - 2);
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
    archetype: archetypeId,
    origin: input.origin,
    potential: clamp(originPotential[input.origin] + Math.floor(Math.random() * 9) - 4),
    overall: 1,
    attributes
  };
}

export function finalizeAthlete(athlete: Athlete): Athlete {
  return { ...athlete, overall: calculateOverall(athlete.position, athlete.attributes) };
}
