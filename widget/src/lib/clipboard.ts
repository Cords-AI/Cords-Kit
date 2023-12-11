import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

export const [clipboardIDs, setClipboardIDs] = makePersisted(createSignal<string[]>([]), {
	storage: localStorage,
});
