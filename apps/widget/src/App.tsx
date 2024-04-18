import { A, RouteSectionProps, useSearchParams } from "@solidjs/router";
import { Component, ErrorBoundary, Show, Suspense, createEffect, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import logo from "./assets/logo.svg";
import Error from "./components/Error";
import LocationFooter from "./components/LocationFooter";
import Pending from "./components/Pending";
import { setInitialLocation } from "./lib/location";

const App: Component<RouteSectionProps> = (props) => {
	// signal for widget open/close
	const [open, setOpen] = createSignal(false);
	const toggle = () => setOpen(!open());
	const [query] = useSearchParams();
	setInitialLocation;

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
							<span class="material-symbols-outlined text-3xl">info</span>
						</button>
					}
				>
					<div
						class="flex flex-col h-full w-full rounded-xl overflow-hidden bg-elevation2"
						style={{
							"box-shadow": "0 4px 16px rgba(0,0,0,.25)",
						}}
					>
						<header class="flex justify-between bg-elevation1 p-4 px-8 items-center border-b border-b-hairline z-10">
							<A href={`/?${new URLSearchParams(query).toString()}`}>
								<img src={logo} alt="Cords Logo" />
							</A>
							<nav class="flex-1 flex justify-end gap-2">
								<A
									href={`/clipboard?${new URLSearchParams(query).toString()}`}
									class="flex h-7 w-7 items-center justify-center text-slate"
								>
									<span class="material-symbols-outlined">assignment</span>
								</A>
								<A
									target="_blank"
									href="https://cords.ai"
									class="flex h-7 w-7 items-center justify-center"
								>
									<span class="material-symbols-outlined">search</span>
								</A>
								<button
									onClick={toggle}
									class="flex h-7 w-7 items-center justify-center"
								>
									<span class="material-symbols-outlined">close</span>
								</button>
							</nav>
						</header>
						<div class="overflow-y-auto flex-1 h-full">
							<Suspense fallback={<Pending />}>
								<ErrorBoundary fallback={(error) => <Error error={error} />}>
									{props.children}
								</ErrorBoundary>
							</Suspense>
						</div>
						<LocationFooter />
					</div>
				</Show>
			</Transition>
		</div>
	);
};

export default App;
