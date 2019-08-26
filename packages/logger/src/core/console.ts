import { LevelType } from "./level";

/** Defines logging function of the {@link console}. */
export interface ConsolePrint {
  (message: string, ...params: any[]): void;
}

/** Maps {@link LevelType} to a {@link console} function. */
export const consolePrintByLevel: Record<LevelType, ConsolePrint> = {
  FATAL: console.error,
  ERROR: console.error,
  WARN: console.warn,
  INFO: console.info,
  DEBUG: console.debug,
  TRACE: console.trace,
};

export function consolePrint(level: LevelType, ...params: any[]) {
  consolePrintByLevel[level].apply(console, params as any);
}
