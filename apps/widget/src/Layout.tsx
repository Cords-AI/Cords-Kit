import { autofocus } from "@solid-primitives/autofocus";
import { createForm } from "@tanstack/solid-form";
import {
	Component,
	ErrorBoundary,
	JSX,
	Show,
	createEffect,
	createSignal,
} from "solid-js";
import { Transition } from "solid-transition-group";
import Error from "@/components/Error";
import Footer from "@/components/Footer";
import { search, setMapOpen, setSearch } from "@/lib/search";
import { useTranslation } from "@/translations";
import { Link, useNavigate, useRouteContext } from "@tanstack/solid-router";
autofocus;

const [searchMode, setSearchMode] = createSignal(false);

const SearchHeader = ({ close }: { close: () => void }) => {
	const navigate = useNavigate();
	const form = createForm(() => ({
		defaultValues: {
			query: "",
		},
		onSubmit: async ({ value }) => {
			setSearch((search) => ({
				q: value.query,
				options: {
					...search.options,
					page: 1,
				},
			}));
			setMapOpen(false);
			close();
			navigate({
				to: "/",
				search: (s) => s,
			});
		},
		validators: {
			onChange: ({ value }) => {
				if (value.query.length < 1)
					return "Please enter at least 1 character";
			},
		},
	}));

	return (
		<header class="flex h-16 bg-elevation1 px-6 gap-1 items-center border-b border-b-hairline z-10">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				class="relative flex-1 flex"
			>
				<div class="border h-12 flex items-center rounded-sm flex-1">
					<span
						class="material-symbols-outlined flex items-center justify-center h-full text-primary w-14 cursor-pointer"
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
								type="text"
								autocomplete="off"
								use:autofocus
								autofocus
								class="outline-hidden pr-4 h-full w-full rounded-r"
								name={field().name}
								value={field().state.value}
								onBlur={field().handleBlur}
								onInput={(e) =>
									field().handleChange(e.target.value)
								}
							/>
						)}
					/>
					<button type="submit" class="hidden"></button>
				</div>
			</form>
		</header>
	);
};

export const Layout: Component<{ children: JSX.Element }> = (props) => {
	// signal for widget open/close
	const [open, setOpen] = createSignal(false);
	const toggle = () => setOpen(!open());
	const { locale, setLocale } = useTranslation();
	let scrollRef: HTMLDivElement | undefined;
	const context = useRouteContext({ from: "__root__" });
	const { session } = context();

	createEffect(() => {
		window.parent.postMessage(
			{
				type: "cords-resize",
				width: open() ? 410 : 60,
				height: open() ? 700 : 60,
			},
			"*",
		);
		console.log(open());
	});

	createEffect(() => {
		if (!scrollRef) return;
		scrollRef.scrollTo({
			top: 0,
		});
	});

	return (
		<div class="w-full h-full max-w-full max-h-full p-4 bg-transparent">
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
							<span class="material-symbols-outlined text-3xl">
								info
							</span>
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
									<button
										class="border rounded-full w-8 h-8 text-sm font-medium"
										onClick={() => {
											setLocale(
												locale() === "en" ? "fr" : "en",
											);
										}}
									>
										{locale() === "fr" ? "EN" : "FR"}
									</button>
									<nav class="flex-1 flex justify-end gap-2">
										<Link
											to="/"
											onClick={() => {
												if (search().q) {
													setSearch((s) => {
														return {
															q: "",
															options: {
																...s.options,
																page: 1,
															},
														};
													});
												}
												setMapOpen(false);
											}}
											class="flex relative h-7 w-7 items-center justify-center text-slate"
										>
											<span class="material-symbols-outlined">
												home
											</span>
										</Link>
										<Link
											to="/clipboard"
											class="flex relative h-7 w-7 items-center justify-center text-slate"
										>
											{session?.clipboardServices &&
												session.clipboardServices
													.length > 0 && (
													<div class="rounded-full absolute -top-1 -right-1 bg-primary h-4 w-4 flex items-center justify-center border-elevation1 border-2">
														<p class="text-[8px] text-white">
															{
																session
																	?.clipboardServices
																	.length
															}
														</p>
													</div>
												)}
											<span class="material-symbols-outlined">
												assignment
											</span>
										</Link>
										<button
											onClick={() => setSearchMode(true)}
											class="flex h-7 w-7 items-center justify-center"
										>
											<span class="material-symbols-outlined">
												search
											</span>
										</button>
										<button
											onClick={toggle}
											class="flex h-7 w-7 items-center justify-center"
										>
											<span class="material-symbols-outlined">
												close
											</span>
										</button>
									</nav>
								</header>
							}
						>
							<SearchHeader close={() => setSearchMode(false)} />
						</Show>
						<div
							ref={scrollRef}
							class="overflow-y-auto overscroll-contain flex-1 h-full"
						>
							<ErrorBoundary
								fallback={(error) => <Error error={error} />}
							>
								{props.children}
							</ErrorBoundary>
						</div>
						<Footer />
					</div>
				</Show>
			</Transition>
		</div>
	);
};
