"use client";

import { atom, createStore } from "jotai";
import * as Types from "@/types";

// Create a single store instance that will be used across the app
export const store = createStore();

// Default user state
const DEFAULT_USER: Types.Player = {
  id: "",
  name: "",
  age: 0,
  email: "",
  emailVerified: false,
};

// Export a single user atom that will be used throughout the app
export const userAtom = atom<Types.Player>(DEFAULT_USER);

export const gameTypeAtom = atom<Types.MATCH_TYPE>();
export const invitationStatusAtom = atom<Types.INVITATION_STATUS | undefined>();
