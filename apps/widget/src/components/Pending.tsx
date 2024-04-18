import spinner from "../assets/spinner.svg";

const Pending = () => {
	return (
		<div class="h-full flex justify-center items-center">
			<img src={spinner} width={50} height={50} alt="Loading spinner" class="animate-spin" />
		</div>
	);
};

export default Pending;
