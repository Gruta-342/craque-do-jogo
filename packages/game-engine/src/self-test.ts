import { createAthlete, finalizeAthlete, generateInitialOffers, calculateOfferWeight, getArchetypesForPosition } from "./index";

function make(origin: "regional_promise" | "international_gem", position: "ST" | "GK" = "ST") {
  return finalizeAthlete(createAthlete({
    name: "Atleta de Teste", nationality: "BR", age: 17, position, origin
  }));
}

const regional = make("regional_promise");
const international = make("international_gem");
const goalkeeper = make("regional_promise", "GK");
const offers = generateInitialOffers(regional);

if (regional.overall < 1 || regional.overall > 99) throw new Error("Overall fora do intervalo 1–99");
if (offers.length !== 3) throw new Error("A geração inicial deve retornar três propostas");
if (new Set(offers.map((offer) => offer.club.id)).size !== 3) throw new Error("As propostas não podem repetir clubes");
if (getArchetypesForPosition("GK").length !== 3) throw new Error("Catálogo de goleiros incompleto");
if (goalkeeper.attributes.reflexes <= 0 || goalkeeper.attributes.elasticity <= 0 || goalkeeper.attributes.rushingOut <= 0 || goalkeeper.attributes.distribution <= 0) throw new Error("Atributos de goleiro ausentes");
const regionalLocal = calculateOfferWeight(regional, { id: "local", name: "Local", country: "Brasil", league: "Regional", reputation: 32, financialPower: 20, squadQuality: 35, region: "Brazil" });
const regionalElite = calculateOfferWeight(regional, { id: "elite", name: "Elite", country: "Brasil", league: "Elite", reputation: 94, financialPower: 95, squadQuality: 94, region: "Brazil" });
const gemElite = calculateOfferWeight(international, { id: "elite", name: "Elite", country: "Inglaterra", league: "Elite", reputation: 94, financialPower: 95, squadQuality: 94, region: "Europe" });
const gemLocal = calculateOfferWeight(international, { id: "local", name: "Local", country: "Brasil", league: "Regional", reputation: 32, financialPower: 20, squadQuality: 35, region: "Brazil" });
if (regionalLocal <= regionalElite) throw new Error("Promessa regional deve favorecer clubes regionais");
if (gemElite <= gemLocal) throw new Error("Joia internacional deve favorecer clubes de elite");
console.log("Engine OK:", { overall: regional.overall, goalkeeperOverall: goalkeeper.overall, offers: offers.map((offer) => offer.club.name) });
