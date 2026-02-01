
export type ModelType = 'gemini-3-pro-preview' | 'gemini-3-flash-preview' | 'gemini-flash-lite-latest';

export interface ModelMetadata {
  name: string;
  cost: number;
  reliability: number;
  specialty: string;
}

export const MODELS: Record<ModelType, ModelMetadata> = {
  'gemini-3-pro-preview': { name: 'Gemini 3 Pro', cost: 3.50, reliability: 0.99, specialty: 'Deep Reasoning / PM' },
  'gemini-3-flash-preview': { name: 'Gemini 3 Flash', cost: 0.50, reliability: 0.92, specialty: 'Speed / Translation' },
  'gemini-flash-lite-latest': { name: 'Flash Lite', cost: 0.10, reliability: 0.88, specialty: 'Micro-tasks' },
};

export type ToolType = 'GitHub' | 'Slack' | 'PowerPoint' | 'Terminal' | 'Email' | 'ResearchDB' | 'BillingAPI' | 'Jira' | 'Calendar';

export interface ALU {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string; // The role description
  model: ModelType;
  status: 'idle' | 'working' | 'waiting_approval' | 'paused' | 'blocked' | 'waiting' | 'meeting';
  progress: number;
  currentTask?: string;
  avatar: string;
  tools: ToolType[];
  connections: string[];
  position: { x: number; y: number };
  isManager?: boolean;
  costPerHour: number;
  reliability: number;
}

export interface PodConfig {
  name: string;
  goal: string;
  approvalRule: string;
  budget: number;
  currentSpend: number;
}

export interface Deliverable {
  id: string;
  type: 'git' | 'email' | 'code' | 'report' | 'log' | 'risk';
  title: string;
  text: string;
  timestamp: string;
  agentId: string;
}

export interface WorkUnit {
  id: string;
  content: string;
  type: 'ticket' | 'pr' | 'custom';
}
