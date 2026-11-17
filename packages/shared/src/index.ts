export type Nationality = "BR" | "AR" | "MX" | "OTHER";

export type CareerOrigin =
  | "academy_prospect"
  | "regional_promise"
  | "unknown_bet"
  | "international_gem";

export type Position =
  | "GK" | "CB" | "LB" | "RB" | "CDM"
  | "CM" | "CAM" | "LW" | "RW" | "ST";

export type PreferredFoot = "right" | "left" | "both";

export type ArchetypeId =
  | "gk_shot_stopper" | "gk_sweeper" | "gk_distributor"
  | "cb_marker" | "cb_ball_playing" | "cb_anticipator"
  | "fullback_attacking" | "fullback_balanced" | "fullback_defensive"
  | "cdm_destroyer" | "cdm_deep_playmaker" | "cdm_anchor"
  | "cm_box_to_box" | "cm_playmaker" | "cm_tempo_setter"
  | "cam_creator" | "cam_shadow_striker" | "cam_dribbler"
  | "winger_dribbler" | "winger_inside_forward" | "winger_wide_playmaker"
  | "st_poacher" | "st_target_man" | "st_false_nine" | "st_second_striker";

export interface PlayerAttributes {
  finishing: number;
  passing: number;
  dribbling: number;
  ballControl: number;
  crossing: number;
  marking: number;
  speed: number;
  acceleration: number;
  strength: number;
  stamina: number;
  agility: number;
  vision: number;
  composure: number;
  positioning: number;
  decisionMaking: number;
  leadership: number;
  reflexes: number;
  elasticity: number;
  rushingOut: number;
  distribution: number;
}

export interface Athlete {
  id: string;
  name: string;
  nationality: Nationality;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  position: Position;
  archetype: ArchetypeId;
  origin: CareerOrigin;
  potential: number;
  overall: number;
  attributes: PlayerAttributes;
}

export interface Club {
  id: string;
  name: string;
  country: string;
  league: string;
  reputation: number;
  financialPower: number;
  squadQuality: number;
  region: "Brazil" | "Argentina" | "Mexico" | "Europe" | "Money";
}

export interface ClubOffer {
  club: Club;
  role: string;
  estimatedSalary: number;
  contractYears: number;
  probabilityWeight: number;
}

export interface Career {
  id: string;
  athlete: Athlete;
  currentYear: number;
  currentHalf: 1 | 2;
  club: Club;
  confidence: number;
  morale: number;
  reputation: number;
}
