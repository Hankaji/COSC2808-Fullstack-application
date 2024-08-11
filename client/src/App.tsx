import "./App.css";
import LoginRegisterForm from "./LoginRegisterForm";
import HomePage from "./pages/home/Home";

function App() {
	return (
		<div className="App text-foreground bg-background min-h-svh">
			{/* <LoginRegisterForm /> */}
			<HomePage />
		</div>
	);
}

export default App;
