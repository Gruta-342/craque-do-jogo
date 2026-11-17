"use client";

import { useMemo, useState } from "react";
import { createAthlete, finalizeAthlete, generateInitialOffers, getArchetypesForPosition } from "@craque/game-engine";
import type { Athlete, ClubOffer, CareerOrigin, Position, Nationality, PreferredFoot, ArchetypeId } from "@craque/shared";

const origins: { value: CareerOrigin; label: string }[] = [
  { value: "academy_prospect", label: "Revelação da base" },
  { value: "regional_promise", label: "Promessa regional" },
  { value: "unknown_bet", label: "Aposta desconhecida" },
  { value: "international_gem", label: "Joia internacional" }
];
const nationalities: { value: Nationality; label: string }[] = [
  { value: "BR", label: "Brasil" }, { value: "AR", label: "Argentina" },
  { value: "MX", label: "México" }, { value: "OTHER", label: "Outra nacionalidade" }
];
const positions: { value: Position; label: string }[] = [
  { value: "GK", label: "Goleiro" }, { value: "CB", label: "Zagueiro" },
  { value: "LB", label: "Lateral esquerdo" }, { value: "RB", label: "Lateral direito" },
  { value: "CDM", label: "Volante" }, { value: "CM", label: "Meio-campista" },
  { value: "CAM", label: "Meia ofensivo" }, { value: "LW", label: "Ponta esquerda" },
  { value: "RW", label: "Ponta direita" }, { value: "ST", label: "Atacante" }
];
const attributeLabels: Record<string, string> = {
  finishing: "Finalização", passing: "Passe", dribbling: "Drible", ballControl: "Controle",
  crossing: "Cruzamento", marking: "Marcação", speed: "Velocidade", acceleration: "Aceleração",
  strength: "Força", stamina: "Resistência", agility: "Agilidade", vision: "Visão",
  composure: "Frieza", positioning: "Posicionamento", decisionMaking: "Decisão",
  leadership: "Liderança", reflexes: "Reflexos", elasticity: "Elasticidade",
  rushingOut: "Saída do gol", distribution: "Reposição"
};

export default function Home() {
  const [name, setName] = useState("Novo Craque");
  const [age, setAge] = useState(17);
  const [nationality, setNationality] = useState<Nationality>("BR");
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(72);
  const [foot, setFoot] = useState<PreferredFoot>("right");
  const [position, setPosition] = useState<Position>("ST");
  const [origin, setOrigin] = useState<CareerOrigin>("regional_promise");
  const [archetype, setArchetype] = useState<ArchetypeId>("st_poacher");
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [offers, setOffers] = useState<ClubOffer[]>([]);
  const [error, setError] = useState("");
  const archetypes = useMemo(() => getArchetypesForPosition(position), [position]);

  function generate() {
    try {
      const created = finalizeAthlete(createAthlete({
        name, nationality, age, position, origin, heightCm, weightKg,
        preferredFoot: foot, archetype
      }));
      setAthlete(created);
      setOffers(generateInitialOffers(created));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar o atleta.");
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">CJ</div>
        <div><strong>CRAQUE DO JOGO</strong><span>SUA CARREIRA. SEU LEGADO.</span></div>
        <span className="version">PROTÓTIPO 0.2</span>
      </header>
      <section className="hero">
        <p className="eyebrow">MODO CARREIRA • NOVA JORNADA</p>
        <h1>Todo craque começa<br/><em>com uma oportunidade.</em></h1>
        <p className="intro">Crie seu atleta e descubra quais clubes estão dispostos a apostar no seu futuro.</p>
      </section>
      <section className="workspace">
        <div className="panel form-panel">
          <div className="panel-heading"><span>01 / IDENTIDADE</span><span className="dot"/></div>
          <h2>Seu atleta</h2>
          <label>Nome do jogador<input value={name} onChange={e => setName(e.target.value)} maxLength={32}/></label>
          <div className="two-cols">
            <label>Idade<select value={age} onChange={e => setAge(Number(e.target.value))}>{[16,17,18].map(v => <option key={v} value={v}>{v} anos</option>)}</select></label>
            <label>Nacionalidade<select value={nationality} onChange={e => setNationality(e.target.value as Nationality)}>{nationalities.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}</select></label>
          </div>
          <div className="two-cols">
            <label>Altura (cm)<input type="number" min="140" max="220" value={heightCm} onChange={e => setHeightCm(Number(e.target.value))}/></label>
            <label>Peso (kg)<input type="number" min="40" max="130" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))}/></label>
          </div>
          <div className="two-cols">
            <label>Pé dominante<select value={foot} onChange={e => setFoot(e.target.value as PreferredFoot)}><option value="right">Direito</option><option value="left">Esquerdo</option><option value="both">Ambidestro</option></select></label>
            <label>Posição<select value={position} onChange={e => { const next = e.target.value as Position; setPosition(next); setArchetype(getArchetypesForPosition(next)[0].id); }}>{positions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></label>
          </div>
          <label>Origem da carreira<select value={origin} onChange={e => setOrigin(e.target.value as CareerOrigin)}>{origins.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
          <label>Arquétipo<select value={archetype} onChange={e => setArchetype(e.target.value as ArchetypeId)}>{archetypes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
          <p className="note">{archetypes.find(a => a.id === archetype)?.description} As propostas consideram nacionalidade, origem da carreira, reputação e nível do clube.</p>
          {error && <p className="error-message">{error}</p>}
          <button onClick={generate}>GERAR MINHAS PROPOSTAS <span>↗</span></button>
        </div>
        <div className="result-panel">
          {!athlete ? (
            <div className="empty-state"><div className="silhouette">✦</div><p>SEU FUTURO COMEÇA AQUI</p><span>Preencha os dados para conhecer suas primeiras oportunidades.</span></div>
          ) : (
            <>
              <div className="player-card">
                <div><span className="muted">ATLETA • {nationalities.find(n => n.value === athlete.nationality)?.label.toUpperCase()} • {athlete.age} ANOS</span><h2>{athlete.name}</h2><span className="position">{positions.find(p => p.value === athlete.position)?.label} · {archetypes.find(a => a.id === athlete.archetype)?.name}</span></div>
                <div className="rating"><strong>{athlete.overall}</strong><span>OVR</span></div>
                <div className="potential">POTENCIAL ESTIMADO <b>{athlete.potential}</b></div>
              </div>
              <div className="attribute-panel">
                <div className="offers-heading"><div><span className="muted">FICHA DO JOGADOR</span><h2>Atributos</h2></div></div>
                <div className="attribute-grid">{Object.entries(athlete.attributes).map(([key, value]) => <div className="attribute" key={key}><span>{attributeLabels[key] ?? key}</span><strong>{value}</strong></div>)}</div>
              </div>
              <div className="offers-heading"><div><span className="muted">MERCADO DA BOLA</span><h2>Suas propostas</h2></div><span className="count">03 CLUBES</span></div>
              <div className="offers">{offers.map((offer, i) => (
                <article className="offer" key={offer.club.id}>
                  <div className="offer-index">0{i+1}</div>
                  <div className="club-info"><strong>{offer.club.name}</strong><span>{offer.club.country} · {offer.club.league}</span><small>{offer.role}</small></div>
                  <div className="salary"><strong>R$ {offer.estimatedSalary.toLocaleString("pt-BR")}</strong><span>salário estimado / mês</span></div>
                </article>
              ))}</div>
              <p className="disclaimer">As propostas são sorteadas com pesos diferentes conforme a origem, nacionalidade e reputação dos clubes. Os pesos ainda passarão por balanceamento.</p>
            </>
          )}
        </div>
      </section>
      <footer>CRAQUE DO JOGO <span>BUILD 0.2.0 • DESENVOLVIMENTO</span></footer>
    </main>
  );
}
