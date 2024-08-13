import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginRegisterForm from "./LoginRegisterForm";
import HomePage from "./pages/home/Home";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

const router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginRegisterForm />,
	},
	{
		path: "/register",
		// element: <LoginRegisterForm />,
	},
	{
		path: "/home",
		element: <HomePage />,
	},
	{
		path: "/profile",
		children: [
			{
				// Show people profile through this link
				path: "/:userId",
			},
		],
	},
	{
		path: "/group",
		children: [
			{
				path: "/:groupId",
			},
		],
	},
]);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
