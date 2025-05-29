import spinner from "@/assets/spinner.svg";

const Pending = ({
	width = 50,
	height = 50,
}: {
	width?: number;
	height?: number;
}) => {
	return (
		<div class="h-full flex justify-center items-center">
			<img
				src={spinner}
				width={width}
				height={height}
				alt="Loading spinner"
				class="animate-spin"
			/>
		</div>
	);
};

export default Pending;
