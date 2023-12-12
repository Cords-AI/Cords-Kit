import { RouteSectionProps } from "@solidjs/router";
import { Component, Show, Suspense, createEffect, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import logo from "/assets/logo.svg";
import spinner from "/assets/spinner.svg";

const App: Component<RouteSectionProps> = (props) => {
	// signal for widget open/close
	const [open, setOpen] = createSignal(false);
	const toggle = () => setOpen(!open());

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
							<span class="material-symbols-outlined">question_mark</span>
						</button>
					}
				>
					<div
						class="flex flex-col h-full w-full rounded-xl overflow-hidden bg-elevation2"
						style={{
							"box-shadow": "0 4px 16px rgba(0,0,0,.25)",
						}}
					>
						<header class="flex justify-between p-4 items-center bg-elevation1 border-b border-b-hairline z-10">
							<a href="/">
								<img src={logo} alt="Cords Logo" />
							</a>
							<nav class="flex-1 flex justify-end gap-2">
								<a
									href="/clipboard"
									class="flex h-7 w-7 items-center justify-center text-slate"
								>
									<span class="material-symbols-outlined">assignment</span>
								</a>
								<a
									target="_blank"
									href="https://cords.dev"
									class="flex h-7 w-7 items-center justify-center"
								>
									<span class="material-symbols-outlined">search</span>
								</a>
								<button
									onClick={toggle}
									class="flex h-7 w-7 items-center justify-center"
								>
									<span class="material-symbols-outlined">close</span>
								</button>
							</nav>
						</header>
						<div class="overflow-y-scroll flex-1 h-full">
							<Suspense
								fallback={
									<div class="h-full flex justify-center items-center">
										<img src={spinner} alt="Loading spinner" />
									</div>
								}
							>
								{props.children}
							</Suspense>
						</div>
					</div>
				</Show>
			</Transition>
		</div>
	);
};

export default App;
