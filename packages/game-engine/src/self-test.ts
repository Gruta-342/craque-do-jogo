import { createAthlete, finalizeAthlete, generateInitialOffers } from "./index";

const athlete = finalizeAthlete(createAthlete({
  name: "Atleta de Teste",
  nationality: "BR",
  age: 17,
  position: "ST",
  origin: "regional_promise"
}));

const offers = generateInitialOffers(athlete);

if (athlete.overall < 1 || athlete.overall > 99) throw new Error("Overall fora do intervalo 1–99");
if (offers.length !== 3) throw new Error("A geração inicial deve retornar três propostas");
if (new Set(offers.map((offer) => offer.club.id)).size !== 3) throw new Error("As propostas não podem repetir clubes");

console.log("Engine OK:", { overall: athlete.overall, potential: athlete.potential, offers: offers.map((offer) => offer.club.name) });
