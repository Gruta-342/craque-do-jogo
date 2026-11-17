import type { ArchetypeId, PlayerAttributes, Position } from "@craque/shared";

export interface ArchetypeDefinition {
  id: ArchetypeId;
  name: string;
  description: string;
  positions: Position[];
  boosts: Partial<PlayerAttributes>;
}

export const ARCHETYPES: ArchetypeDefinition[] = [
  { id: "gk_shot_stopper", name: "Defensor de Pênaltis", description: "Especialista em reflexos, elasticidade e defesas difíceis.", positions: ["GK"], boosts: { reflexes: 12, elasticity: 10, composure: 4 } },
  { id: "gk_sweeper", name: "Goleiro Líbero", description: "Atua adiantado, antecipa jogadas e cobre a última linha.", positions: ["GK"], boosts: { rushingOut: 13, speed: 5, decisionMaking: 7, positioning: 3 } },
  { id: "gk_distributor", name: "Goleiro Construtor", description: "Inicia as jogadas com segurança e qualidade na reposição.", positions: ["GK"], boosts: { distribution: 14, passing: 7, vision: 6, ballControl: 3 } },

  { id: "cb_marker", name: "Zagueiro Marcador", description: "Forte no duelo físico e na marcação individual.", positions: ["CB"], boosts: { marking: 12, strength: 8, positioning: 4 } },
  { id: "cb_ball_playing", name: "Zagueiro Construtor", description: "Qualidade no passe e na saída de bola desde a defesa.", positions: ["CB"], boosts: { passing: 10, vision: 7, ballControl: 5 } },
  { id: "cb_anticipator", name: "Zagueiro Antecipador", description: "Lê o jogo e intercepta antes que o perigo se forme.", positions: ["CB"], boosts: { positioning: 9, decisionMaking: 8, speed: 4, marking: 4 } },

  { id: "fullback_attacking", name: "Ala Ofensivo", description: "Apoia o ataque com velocidade, cruzamentos e ultrapassagens.", positions: ["LB", "RB"], boosts: { speed: 7, stamina: 8, crossing: 9, acceleration: 4 } },
  { id: "fullback_balanced", name: "Lateral Equilibrado", description: "Combina apoio ofensivo com responsabilidade defensiva.", positions: ["LB", "RB"], boosts: { stamina: 5, passing: 4, marking: 4, crossing: 4 } },
  { id: "fullback_defensive", name: "Lateral Defensivo", description: "Prioriza cobertura, posicionamento e duelos defensivos.", positions: ["LB", "RB"], boosts: { marking: 9, positioning: 7, strength: 4 } },

  { id: "cdm_destroyer", name: "Cão de Guarda", description: "Protege a defesa, pressiona e vence disputas.", positions: ["CDM"], boosts: { marking: 10, strength: 7, stamina: 6 } },
  { id: "cdm_deep_playmaker", name: "Volante Construtor", description: "Organiza a saída de bola com passes e visão.", positions: ["CDM"], boosts: { passing: 9, vision: 9, decisionMaking: 5 } },
  { id: "cdm_anchor", name: "Primeiro Volante", description: "Mantém a posição e protege o espaço à frente da zaga.", positions: ["CDM"], boosts: { positioning: 10, marking: 7, composure: 5 } },

  { id: "cm_box_to_box", name: "Box-to-Box", description: "Participa das duas áreas e sustenta alta intensidade.", positions: ["CM"], boosts: { stamina: 10, speed: 4, strength: 4, finishing: 3 } },
  { id: "cm_playmaker", name: "Meio-campista Criativo", description: "Cria jogadas com passe, visão e controle de bola.", positions: ["CM"], boosts: { vision: 10, passing: 8, ballControl: 5 } },
  { id: "cm_tempo_setter", name: "Regista", description: "Controla o ritmo e escolhe os melhores caminhos para a equipe.", positions: ["CM"], boosts: { passing: 10, decisionMaking: 8, composure: 5 } },

  { id: "cam_creator", name: "Armador", description: "Principal articulador das jogadas ofensivas.", positions: ["CAM"], boosts: { vision: 10, passing: 9, ballControl: 5 } },
  { id: "cam_shadow_striker", name: "Meia Infiltrador", description: "Ataca os espaços e chega à área para finalizar.", positions: ["CAM"], boosts: { finishing: 8, positioning: 7, acceleration: 5 } },
  { id: "cam_dribbler", name: "Meia Driblador", description: "Usa condução e drible curto para romper linhas.", positions: ["CAM"], boosts: { dribbling: 10, agility: 7, ballControl: 5 } },

  { id: "winger_dribbler", name: "Ponta Driblador", description: "Parte para cima no um contra um e cria superioridade.", positions: ["LW", "RW"], boosts: { dribbling: 10, agility: 7, acceleration: 6 } },
  { id: "winger_inside_forward", name: "Ponta Invertido", description: "Corta para dentro e busca a finalização.", positions: ["LW", "RW"], boosts: { finishing: 8, ballControl: 6, positioning: 5 } },
  { id: "winger_wide_playmaker", name: "Ponta Construtor", description: "Cria chances aberto, combinando passe e cruzamento.", positions: ["LW", "RW"], boosts: { crossing: 9, vision: 6, passing: 6 } },

  { id: "st_poacher", name: "Finalizador", description: "Especialista em encontrar espaço e concluir as jogadas.", positions: ["ST"], boosts: { finishing: 12, positioning: 8, composure: 5 } },
  { id: "st_target_man", name: "Homem de Referência", description: "Usa o corpo, disputa bolas e segura o ataque.", positions: ["ST"], boosts: { strength: 10, ballControl: 4, passing: 3 } },
  { id: "st_false_nine", name: "Falso 9", description: "Sai da área para participar da criação e confundir a marcação.", positions: ["ST"], boosts: { passing: 7, vision: 7, dribbling: 6, ballControl: 5 } },
  { id: "st_second_striker", name: "Segundo Atacante", description: "Flutua ao redor do centroavante e combina criação com chegada à área.", positions: ["ST"], boosts: { dribbling: 6, passing: 5, finishing: 6, vision: 4 } }
];

export function getArchetypesForPosition(position: Position): ArchetypeDefinition[] {
  return ARCHETYPES.filter((archetype) => archetype.positions.includes(position));
}

export function getArchetype(id: ArchetypeId): ArchetypeDefinition {
  const archetype = ARCHETYPES.find((item) => item.id === id);
  if (!archetype) throw new Error(`Arquétipo inválido: ${id}`);
  return archetype;
}
