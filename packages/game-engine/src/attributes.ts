import type { PlayerAttributes, Position } from "@craque/shared";

const weights: Record<Position, Partial<Record<keyof PlayerAttributes, number>>> = {
  GK: { positioning: 0.22, composure: 0.16, decisionMaking: 0.14, agility: 0.16, passing: 0.08, strength: 0.08, stamina: 0.08, leadership: 0.08 },
  CB: { marking: 0.22, strength: 0.14, positioning: 0.16, decisionMaking: 0.12, passing: 0.10, speed: 0.08, composure: 0.08, leadership: 0.10 },
  LB: { speed: 0.14, stamina: 0.14, marking: 0.14, crossing: 0.14, agility: 0.10, passing: 0.10, positioning: 0.10, dribbling: 0.08, decisionMaking: 0.06 },
  RB: { speed: 0.14, stamina: 0.14, marking: 0.14, crossing: 0.14, agility: 0.10, passing: 0.10, positioning: 0.10, dribbling: 0.08, decisionMaking: 0.06 },
  CDM: { marking: 0.17, passing: 0.15, positioning: 0.14, stamina: 0.12, decisionMaking: 0.12, strength: 0.10, vision: 0.10, ballControl: 0.10 },
  CM: { passing: 0.17, vision: 0.16, stamina: 0.12, ballControl: 0.12, decisionMaking: 0.12, dribbling: 0.10, positioning: 0.10, marking: 0.06, finishing: 0.05 },
  CAM: { vision: 0.18, passing: 0.16, ballControl: 0.14, dribbling: 0.14, decisionMaking: 0.12, finishing: 0.10, composure: 0.08, agility: 0.08 },
  LW: { dribbling: 0.18, speed: 0.16, acceleration: 0.14, finishing: 0.14, ballControl: 0.12, agility: 0.10, crossing: 0.08, composure: 0.08 },
  RW: { dribbling: 0.18, speed: 0.16, acceleration: 0.14, finishing: 0.14, ballControl: 0.12, agility: 0.10, crossing: 0.08, composure: 0.08 },
  ST: { finishing: 0.22, positioning: 0.16, composure: 0.14, strength: 0.12, acceleration: 0.10, ballControl: 0.10, speed: 0.08 }
} as never;

export function calculateOverall(position: Position, attributes: PlayerAttributes): number {
  const positionWeights = weights[position] as Partial<Record<keyof PlayerAttributes, number>>;
  let total = 0;
  let totalWeight = 0;
  for (const [key, weight] of Object.entries(positionWeights)) {
    const value = attributes[key as keyof PlayerAttributes];
    if (typeof value === "number" && typeof weight === "number") {
      total += value * weight;
      totalWeight += weight;
    }
  }
  return Math.round(total / totalWeight);
}
