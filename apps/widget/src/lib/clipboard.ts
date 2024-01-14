import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

export const [clipboardIDs, setClipboardIDs] = makePersisted(createSignal<string[]>([]), {
	storage: cookieStorage,
	storageOptions: {
		sameSite: "None",
		secure: true,
	},
	name: "cords-cookie-clipboard",
});
