import { atom } from "jotai";

// define the type of view
export type ViewType = "ladder" | "join" | "auth" | "matches";

// current view
export const currentViewAtom = atom<ViewType>("ladder");

// define the type of auth mode
export const authModeAtom = atom<"login" | "register" | "forgot-password">("login");
