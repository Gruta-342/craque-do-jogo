import type { Athlete, Club, ClubOffer, CareerOrigin } from "@craque/shared";
import { INITIAL_CLUBS } from "./clubs";

const originPreference: Record<CareerOrigin, Record<string, number>> = {
  academy_prospect: { Brazil: 1.5, Argentina: 1.0, Mexico: 0.8, Europe: 1.0, Money: 0.65 },
  regional_promise: { Brazil: 2.0, Argentina: 0.8, Mexico: 0.65, Europe: 0.25, Money: 0.2 },
  unknown_bet: { Brazil: 1.0, Argentina: 0.9, Mexico: 0.85, Europe: 0.65, Money: 0.5 },
  international_gem: { Brazil: 0.75, Argentina: 0.7, Mexico: 0.65, Europe: 2.0, Money: 1.1 }
};

export function calculateOfferWeight(athlete: Athlete, club: Club): number {
  const originWeight = originPreference[athlete.origin][club.region] ?? 0.5;
  const reputation = club.reputation;
  let reputationWeight = 1;

  // A origem altera o patamar dos clubes que tendem a observar o atleta.
  if (athlete.origin === "regional_promise") {
    reputationWeight = reputation <= 50 ? 5 : reputation <= 79 ? 1.35 : 0.22;
  } else if (athlete.origin === "international_gem") {
    reputationWeight = reputation >= 85 ? 4.5 : reputation >= 65 ? 1.35 : 0.12;
  } else if (athlete.origin === "academy_prospect") {
    reputationWeight = reputation >= 65 ? 1.8 : 0.8;
  } else {
    reputationWeight = reputation <= 55 ? 1.5 : reputation >= 90 ? 0.75 : 1;
  }

  const reputationGap = Math.max(0, reputation - athlete.overall);
  const realisticFit = Math.max(0.08, 1 - reputationGap / 115);
  const nationalityBoost =
    (athlete.nationality === "BR" && club.region === "Brazil") ||
    (athlete.nationality === "AR" && club.region === "Argentina") ||
    (athlete.nationality === "MX" && club.region === "Mexico") ? 1.45 : 1;

  return originWeight * reputationWeight * realisticFit * nationalityBoost;
}

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
  const offerCount = Math.max(0, Math.min(Math.floor(count), available.length));

  while (offers.length < offerCount && available.length > 0) {
    const club = randomWeighted(available, (candidate) => calculateOfferWeight(athlete, candidate));
    const probabilityWeight = calculateOfferWeight(athlete, club);
    available.splice(available.findIndex((item) => item.id === club.id), 1);

    const role = athlete.overall >= club.squadQuality + 5 ? "Jogador de rotação"
      : athlete.overall >= club.squadQuality - 8 ? "Aposta para o elenco"
      : "Projeto de desenvolvimento";

    offers.push({
      club,
      role,
      estimatedSalary: Math.round((4500 + club.financialPower * 950) * (0.65 + athlete.overall / 150)),
      contractYears: 3,
      probabilityWeight
    });
  }

  return offers;
}
