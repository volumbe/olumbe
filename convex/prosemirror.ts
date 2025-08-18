// convex/prosemirror.ts
import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";
import { components } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const prosemirrorSync = new ProsemirrorSync<Id<"documents">>(
  components.prosemirrorSync
);
export const {
  getSnapshot,
  submitSnapshot,
  latestVersion,
  getSteps,
  submitSteps,
} = prosemirrorSync.syncApi();
