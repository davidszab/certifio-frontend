import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import {
	createBrowserRouter,
	RouterProvider,
	Navigate
} from "react-router-dom";
import "antd/dist/reset.css";
import "./styles/global.css";
import "./lib/axios.interceptor";
import Authentication from "./pages/Authentication";
import NestedLayout from "./pages/NestedLayout";
import Dashboard from "./pages/dashboard";
import { AdminRoute, AuthProvider, ProtectedRoute } from "./lib/auth";
import Certificate from "./pages/Certificate";
import axios from "axios";
import AdminLayout from "./pages/admin/Layout";
import AdminDashboard from "./pages/admin/Dashboard";
import QuickView from "./pages/QuickView";
import { InfoProvider } from "./lib/info";
import About from "./pages/About";

const router = createBrowserRouter([
	{
		path: "/",
		element: <NestedLayout />,
		children: [
			{
				path: "",
				element: <Home />
			},
			{
				path: "authentication",
				element: <Authentication />
			},
			{
				path: "dashboard",
				element: (
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				)
			},
			{
				path: "quick-view",
				element: <QuickView/>
			},
			{
				path: "about",
				element: <About/>
			},
			{
				path: "c/:id",
				element: <Certificate />
			}
		]
	},
	{
		path: "/admin",
		element: (
			<AdminRoute>
				<AdminLayout />
			</AdminRoute>
		),
		children: [
			{
				path: "",
				element: <Navigate to={"dashboard"}/>
			},
			{
				path: "dashboard",
				element: <AdminDashboard/>
			},
			{
				path: "signatures",
				element: <h1>signatures</h1>
			},
			{
				path: "bases",
				element: <h1>certificate bases</h1>
			},
			{
				path: "certificates",
				element: <h1>certificates</h1>
			},
			{
				path: "people",
				element: <h1>people</h1>
			},
			{
				path: "settings",
				element: <h1>settings</h1>
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<AuthProvider>
		<InfoProvider>
			<RouterProvider router={router} />
		</InfoProvider>
	</AuthProvider>
);
