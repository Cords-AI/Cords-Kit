import { A, RouteSectionProps, useNavigate, useSearchParams } from "@solidjs/router";
import { createForm } from "@tanstack/solid-form";
import { Component, ErrorBoundary, Show, Suspense, createEffect, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import logo from "./assets/logo.svg";
import Error from "./components/Error";
import LocationFooter from "./components/LocationFooter";
import Pending from "./components/Pending";
import { clipboardIDs } from "./lib/clipboard";
import { setInitialLocation } from "./lib/location";
import { setSearch } from "./lib/search";

const [searchMode, setSearchMode] = createSignal(false);

const SearchHeader = () => {
	const navigate = useNavigate();
	const [query] = useSearchParams();
	const form = createForm(() => ({
		defaultValues: {
			query: "",
		},
		onSubmit: async ({ value }) => {
			setSearch({ query: value.query, page: 1 });
			navigate(`/search?${new URLSearchParams(query).toString()}`);
		},
	}));

	return (
		<header class="flex h-16 bg-elevation1 px-6 items-center border-b border-b-hairline z-10">
			<form
				class="w-full border rounded h-12 flex items-center"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<span
					class="material-symbols-outlined flex items-center justify-center h-full text-primary w-12 cursor-pointer"
					onClick={() => {
						setSearchMode(false);
					}}
				>
					arrow_back
				</span>
				<form.Field
					name="query"
					children={(field) => (
						<input
							autocomplete="off"
							class="outline-none pr-4 h-full"
							name={field().name}
							value={field().state.value}
							onBlur={field().handleBlur}
							onInput={(e) => field().handleChange(e.target.value)}
						/>
					)}
				/>
				<button type="submit" class="hidden"></button>
			</form>
		</header>
	);
};

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
						<Show
							when={searchMode()}
							fallback={
								<header class="flex justify-between h-16 bg-elevation1 px-4 items-center border-b border-b-hairline z-10">
									<A href={`/?${new URLSearchParams(query).toString()}`}>
										<img src={logo} alt="Cords Logo" />
									</A>
									<nav class="flex-1 flex justify-end gap-2">
										<A
											href={`/clipboard?${new URLSearchParams(query).toString()}`}
											class="flex relative h-7 w-7 items-center justify-center text-slate"
										>
											<Show when={clipboardIDs().length > 0}>
												<div class="rounded-full absolute -top-1 -right-1 bg-primary h-4 w-4 flex items-center justify-center border-elevation1 border-[2px]">
													<p class="text-[8px] text-white">
														{clipboardIDs().length}
													</p>
												</div>
											</Show>
											<span class="material-symbols-outlined">
												assignment
											</span>
										</A>
										<button
											onClick={() => setSearchMode(true)}
											class="flex h-7 w-7 items-center justify-center"
										>
											<span class="material-symbols-outlined">search</span>
										</button>
										<button
											onClick={toggle}
											class="flex h-7 w-7 items-center justify-center"
										>
											<span class="material-symbols-outlined">close</span>
										</button>
									</nav>
								</header>
							}
						>
							<SearchHeader />
						</Show>
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
