import type { Athlete, ClubOffer, CareerOrigin } from "@craque/shared";
import { INITIAL_CLUBS } from "./clubs";

const originPreference: Record<CareerOrigin, Record<string, number>> = {
  academy_prospect: { Brazil: 1.4, Argentina: 1.1, Mexico: 0.8, Europe: 0.9, Money: 0.6 },
  regional_promise: { Brazil: 1.8, Argentina: 0.9, Mexico: 0.7, Europe: 0.35, Money: 0.25 },
  unknown_bet: { Brazil: 1.0, Argentina: 0.8, Mexico: 0.8, Europe: 0.5, Money: 0.4 },
  international_gem: { Brazil: 0.7, Argentina: 0.8, Mexico: 0.7, Europe: 1.8, Money: 0.8 }
};

function randomWeighted<T>(items: T[], weightOf: (item: T) => number): T {
  const weights = items.map(weightOf);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function generateInitialOffers(athlete: Athlete, count = 3): ClubOffer[] {
  const available = [...INITIAL_CLUBS];
  const offers: ClubOffer[] = [];

  while (offers.length < count && available.length > 0) {
    const club = randomWeighted(available, (candidate) => {
      const originWeight = originPreference[athlete.origin][candidate.region] ?? 0.5;
      const reputationGap = Math.max(0, candidate.reputation - athlete.overall);
      const realisticFit = Math.max(0.08, 1 - reputationGap / 115);
      const nationalityBoost =
        (athlete.nationality === "BR" && candidate.region === "Brazil") ||
        (athlete.nationality === "AR" && candidate.region === "Argentina") ||
        (athlete.nationality === "MX" && candidate.region === "Mexico") ? 1.35 : 1;
      return originWeight * realisticFit * nationalityBoost;
    });
    available.splice(available.findIndex((item) => item.id === club.id), 1);

    const role = athlete.overall >= club.squadQuality + 5 ? "Jogador de rotação"
      : athlete.overall >= club.squadQuality - 8 ? "Aposta para o elenco"
      : "Projeto de desenvolvimento";

    offers.push({
      club,
      role,
      estimatedSalary: Math.round((4500 + club.financialPower * 950) * (0.65 + athlete.overall / 150)),
      contractYears: 3,
      probabilityWeight: 0
    });
  }

  return offers;
}
