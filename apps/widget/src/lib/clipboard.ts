import { createSignal } from "solid-js";

export const [clipboardIDs, setClipboardIDs] = createSignal<string[]>([]);
