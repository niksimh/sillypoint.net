import { z } from "zod";
import { inputHandlerResult } from "./types";

export function inputHandlerLogic(message: string): inputHandlerResult {
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);
  } catch {
    return { decision: "ignore" };
  }

  const inputSchema = z.object({
    type: z.literal('gameSelection'),
    input: z.number()
  });
  const justTheType = inputSchema.pick({ type: true });

  try {
    inputSchema.parse(parsedMessage);
    justTheType.parse(parsedMessage);
    return { decision: "gameSelection", input: parsedMessage.input };
  } catch {
    return { decision: "ignore" };
  }
}
