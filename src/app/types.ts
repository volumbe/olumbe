import { UIMessage } from "ai";

export type ChatMessage = UIMessage & {
  metadata: {
    createdAt: number;
  };
};