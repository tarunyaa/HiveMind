
import { ALU } from './types';

export const INITIAL_AGENTS: ALU[] = [
  {
    id: 'agent-1',
    name: 'Sarah Chen',
    role: 'Product Lead',
    goal: 'Ensure milestone alignment and team cohesion.',
    backstory: 'A veteran supervisor model with 10k hours in simulated management environments.',
    model: 'gemini-3-pro-preview',
    costPerHour: 2.50,
    reliability: 0.98,
    status: 'idle',
    progress: 0,
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Sarah&backgroundColor=f1f5f9',
    tools: ['Jira', 'Calendar'],
    connections: ['agent-2'],
    position: { x: 30, y: 50 }
  },
  {
    id: 'agent-2',
    name: 'Byte-7',
    role: 'Lead Architect',
    goal: 'Refactor core infrastructure for extreme scalability.',
    backstory: 'An LLM-driven coder trained on high-performance C++ and Rust codebases.',
    // Corrected to use a valid Gemini model following senior engineering standards
    model: 'gemini-3-pro-preview',
    costPerHour: 4.00,
    reliability: 0.95,
    status: 'idle',
    progress: 0,
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Byte&backgroundColor=f1f5f9',
    tools: ['GitHub', 'Terminal'],
    connections: [],
    position: { x: 70, y: 50 }
  }
];
