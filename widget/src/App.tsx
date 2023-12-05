import {
	FaSolidClipboardCheck,
	FaSolidHouse,
	FaSolidMagnifyingGlass,
	FaSolidQuestion,
	FaSolidX,
} from "solid-icons/fa";
import { Show, createEffect, createSignal, lazy } from "solid-js";
import { Transition } from "solid-transition-group";
import { initializeAnalytics } from "./lib/analytics";

const Home = lazy(() => import("./routes/Home"));
const Clipboard = lazy(() => import("./routes/Clipboard"));

const App = () => {
	// signal for widget open/close
	const [open, setOpen] = createSignal(false);
	const [page, setPage] = createSignal("home");
	const toggle = () => setOpen(!open());
	const id = "30f430fc-1a57-4265-9603-7837da6dbb5c";

	createEffect(() => {
		window.parent.postMessage(
			{
				type: "cords-resize",
				width: open() ? 410 : 60,
				height: open() ? 700 : 60,
			},
			"*"
		);
	});

	// Initialize clipboard
	initializeAnalytics();

	return (
		<div class="w-full h-full max-w-full max-h-full p-4">
			<Transition
				onEnter={(el, done) => {
					const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: 100,
					});
					a.finished.then(done);
				}}
				onExit={(el, done) => {
					const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
						duration: 100,
					});
					a.finished.then(done);
				}}
			>
				<Show
					when={open()}
					fallback={
						<button
							onClick={toggle}
							class="font-lato fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-2xl hover:opacity-90 transition-opacity"
						>
							<FaSolidQuestion size={24} />
						</button>
					}
				>
					<div
						class="flex flex-col h-full w-full rounded-xl overflow-hidden bg-slate-100"
						style={{
							"box-shadow": "0 4px 16px rgba(0,0,0,.25)",
						}}
					>
						<header class="flex justify-between p-4 items-center bg-white shadow-md z-10">
							<nav class="flex-1 flex justify-end gap-2">
								<button
									onClick={() => setPage("home")}
									class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 bg-opacity-50 text-white transition-colors hover:bg-opacity-60"
								>
									<FaSolidHouse size={14} />
								</button>
								<button
									onClick={() => setPage("clipboard")}
									class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 bg-opacity-50 text-white transition-colors hover:bg-opacity-60"
								>
									<FaSolidClipboardCheck size={14} />
								</button>
								<a
									target="_blank"
									href="https://cords.dev"
									class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 bg-opacity-50 text-white transition-colors hover:bg-opacity-60"
								>
									<FaSolidMagnifyingGlass size={14} />
								</a>
								<button
									onClick={toggle}
									class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 bg-opacity-50 text-white transition-colors hover:bg-opacity-60"
								>
									<FaSolidX size={14} />
								</button>
							</nav>
						</header>
						<div class="overflow-y-scroll flex-1 h-full">
							{page() === "home" && <Home id={id} />}
							{page() === "clipboard" && <Clipboard />}
						</div>
					</div>
				</Show>
			</Transition>
		</div>
	);
};

export default App;
