const Error = ({ error }: { error: Error }) => {
	return (
		<div class="h-full flex justify-center items-center flex-col">
			<div class="flex justify-center items-center px-8 flex-col">
				<h3 class="mt-10 mb-4">Something went wrong.</h3>
				<p class="text-center">{error.message}</p>
			</div>
		</div>
	);
};

export default Error;
