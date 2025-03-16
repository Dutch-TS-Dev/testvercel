"use client";

import { atom, createStore } from "jotai";

import * as Types from "@/types";

export const store = createStore();

export const userAtom = atom<Types.Player>();
