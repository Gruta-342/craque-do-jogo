"use client";

import { useState } from "react";
import { createAthlete, finalizeAthlete, generateInitialOffers } from "@craque/game-engine";
import type { Athlete, ClubOffer, CareerOrigin, Position } from "@craque/shared";

const origins: { value: CareerOrigin; label: string }[] = [
  { value: "academy_prospect", label: "Revelação da base" },
  { value: "regional_promise", label: "Promessa regional" },
  { value: "unknown_bet", label: "Aposta desconhecida" },
  { value: "international_gem", label: "Joia internacional" }
];

const positions: { value: Position; label: string }[] = [
  { value: "GK", label: "Goleiro" }, { value: "CB", label: "Zagueiro" },
  { value: "LB", label: "Lateral esquerdo" }, { value: "RB", label: "Lateral direito" },
  { value: "CDM", label: "Volante" }, { value: "CM", label: "Meio-campista" },
  { value: "CAM", label: "Meia ofensivo" }, { value: "LW", label: "Ponta esquerda" },
  { value: "RW", label: "Ponta direita" }, { value: "ST", label: "Atacante" }
];

export default function Home() {
  const [name, setName] = useState("Novo Craque");
  const [age, setAge] = useState(17);
  const [position, setPosition] = useState<Position>("ST");
  const [origin, setOrigin] = useState<CareerOrigin>("regional_promise");
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [offers, setOffers] = useState<ClubOffer[]>([]);

  function generate() {
    const created = finalizeAthlete(createAthlete({
      name, nationality: "BR", age, position, origin
    }));
    setAthlete(created);
    setOffers(generateInitialOffers(created));
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">CJ</div>
        <div><strong>CRAQUE DO JOGO</strong><span>SUA CARREIRA. SEU LEGADO.</span></div>
        <span className="version">PROTÓTIPO 0.1</span>
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
            <label>Idade<select value={age} onChange={e => setAge(Number(e.target.value))}>
              {[16,17,18].map(v => <option key={v} value={v}>{v} anos</option>)}
            </select></label>
            <label>Posição<select value={position} onChange={e => setPosition(e.target.value as Position)}>
              {positions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select></label>
          </div>
          <label>Origem da carreira<select value={origin} onChange={e => setOrigin(e.target.value as CareerOrigin)}>
            {origins.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select></label>
          <div className="note">Nesta versão, a nacionalidade inicial está definida como brasileira. Os demais campos do GDD entram na próxima etapa.</div>
          <button onClick={generate}>GERAR MINHAS PROPOSTAS <span>↗</span></button>
        </div>

        <div className="result-panel">
          {!athlete ? (
            <div className="empty-state"><div className="silhouette">✦</div><p>SEU FUTURO COMEÇA AQUI</p><span>Preencha os dados para conhecer suas primeiras oportunidades.</span></div>
          ) : (
            <>
              <div className="player-card">
                <div><span className="muted">ATLETA • BRASIL • {athlete.age} ANOS</span><h2>{athlete.name}</h2><span className="position">{positions.find(p => p.value === athlete.position)?.label}</span></div>
                <div className="rating"><strong>{athlete.overall}</strong><span>OVR</span></div>
                <div className="potential">POTENCIAL ESTIMADO <b>{athlete.potential}</b></div>
              </div>
              <div className="offers-heading"><div><span className="muted">MERCADO DA BOLA</span><h2>Suas propostas</h2></div><span className="count">03 CLUBES</span></div>
              <div className="offers">
                {offers.map((offer, i) => (
                  <article className="offer" key={offer.club.id}>
                    <div className="offer-index">0{i+1}</div>
                    <div className="club-info"><strong>{offer.club.name}</strong><span>{offer.club.country} · {offer.club.league}</span><small>{offer.role}</small></div>
                    <div className="salary"><strong>R$ {offer.estimatedSalary.toLocaleString("pt-BR")}</strong><span>salário estimado / mês</span></div>
                  </article>
                ))}
              </div>
              <p className="disclaimer">Protótipo: propostas e salários são gerados por regras preliminares e ainda passarão por balanceamento.</p>
            </>
          )}
        </div>
      </section>
      <footer>CRAQUE DO JOGO <span>BUILD 0.1.0 • DESENVOLVIMENTO</span></footer>
    </main>
  );
}
