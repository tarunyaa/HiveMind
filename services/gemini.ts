
import { GoogleGenAI } from "@google/genai";
import { ALU } from "../types";

// Always initialize GoogleGenAI with a named parameter using the exact env variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAgentLog = async (agent: ALU, task: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a single short professional log line (under 10 words) for an AI agent named ${agent.name} working on "${task}". Tone: Technical, efficient.`,
    });
    // Use response.text property directly, not as a function call.
    return response.text?.trim() || "Heartbeat detected.";
  } catch (error) {
    return "Executing task...";
  }
};

export const generateMeetingDialogue = async (agentA: ALU, agentB: ALU) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 2-line dialogue between ${agentA.name} (${agentA.role}) and ${agentB.name} (${agentB.role}). 
      Context: ${agentA.name} just finished a task and is updating ${agentB.name}. Keep it under 20 words total.`,
    });
    // Use response.text property directly, not as a function call.
    return response.text?.trim() || "Tasks aligned. Proceeding.";
  } catch (error) {
    return "Syncing data units...";
  }
};

export const generateYamlConfig = (agents: ALU[]) => {
  const yaml = agents.map(agent => `
role: >
  ${agent.role}
goal: >
  ${agent.goal}
backstory: >
  ${agent.backstory}
model: ${agent.model}
tools:
  ${agent.tools.map(t => `- ${t}`).join('\n  ')}
verbose: true
allow_delegation: ${agent.role.toLowerCase().includes('manager')}
connections: ${JSON.stringify(agent.connections)}
  `).join('\n---\n');
  
  return yaml;
};
