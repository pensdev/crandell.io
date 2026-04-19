import type { components } from "./api-types.generated";

export type QuintileImpact = components["schemas"]["QuintileImpact"];
export type SimulateRequest = components["schemas"]["SimulateRequest"];
export type SimulateResponse = components["schemas"]["SimulateResponse"];

export type ScenarioMeta = {
  id: string;
  title: string;
  summary: string;
  assumptions: string[];
};

export type ScenariosFile = {
  version: string;
  scenarios: ScenarioMeta[];
};
