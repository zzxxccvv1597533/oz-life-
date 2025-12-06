
export enum AppStep {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  QUIZ_INTRO = 'QUIZ_INTRO',
  QUIZ = 'QUIZ',
  AI_QUIZ = 'AI_QUIZ', // New Interactive Mode
  COMPUTING = 'COMPUTING',
  CONSULTATION = 'CONSULTATION',
}

export enum EnergyType {
  TYPE_A = 'TYPE_A', // Manifestor
  TYPE_B = 'TYPE_B', // Generator/Projector
  TYPE_C = 'TYPE_C', // Emotional/Reflector
}

export enum TrapMode {
  FIGHT = 'FIGHT', // Control
  FLIGHT = 'FLIGHT', // Avoidance
}

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  lifePathNumber: number;
  yearCode: number;
  hdType: EnergyType;
  mbti?: string;
  trapMode?: TrapMode;
}

// Database Interfaces
export interface LifePathData {
  archetype: string;
  desire: string;
  positive: string;
  shadow: string[];
  fix: string;
}

export interface YearCodeData {
  fear: string;
  subconscious: string;
  career: string[];
  relationship: string[];
}

export interface HDData {
  role: string;
  mechanism: string;
  alarm: string;
  fixCommand: string;
  details: string[];
}

export interface MBTIData {
  strengths: string;
  blindspots: string;
  advice: string;
}

export interface TrapData {
  mode: string;
  behavior: string;
  reaction: string[];
  analysis: string;
}

// Quiz Types
export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';

export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  optionA: { text: string; value: string };
  optionB: { text: string; value: string };
}

export type AnswerMap = Record<number, string>;

// Chat System Types
export interface ChatMessage {
  id: string;
  sender: 'system' | 'user';
  text: string;
  isTyping?: boolean;
}