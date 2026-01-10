import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import type { RunnableToolFunctionWithoutParse } from "openai/lib/RunnableFunction.mjs";

export const tools: (RunnableToolFunctionWithoutParse | RunnableToolFunctionWithParse<unknown>)[] = [];
