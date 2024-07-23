import { CordsWidget } from "@cords/react";
import { useState } from "react";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1>Free Food Service</h1>
			<p>
				Welcome to the food bank! We have <strong>{count}</strong> items available.
			</p>
			<button onClick={() => setCount(count + 1)}>Add Item</button>
			<h3>We offer food bank, free grocery, and meal services.</h3>
			<h3>
				Water is quite important. We know that some people don’t drink enough of it. So we
				give both one-shot water bottles (bad for the environment, but like whatever) and
				reusable water bottles (good for people who access to clean water sources).
			</h3>
			<p>
				We’re not opposed to juice, we just know that juice has a lot of sugar. Sugar is
				important too (Krebs cycle and all) but too much sugar is bad. So we just give
				water. You can also get things with sugar in them from us.
			</p>
			<p>
				Some people prefer to drink milk, but we get a lot of complaints from people about
				how we’re encouraging the dairy industry and that company cows (not natural, just
				living out there on their own cows) are bad for the environment. So, we don’t
				provide milk.
			</p>
			<CordsWidget apiKey={import.meta.env.VITE_CORDS_API_KEY} />
		</>
	);
}

export default App;
