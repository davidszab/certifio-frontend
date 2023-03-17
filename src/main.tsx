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
import AdminSignatures, {SignaturesForm} from "./pages/admin/Signatures";
import AdminPeople, { PeopleForm } from "./pages/admin/People";
import AdminBases, { BaseForm, CertificateForm } from "./pages/admin/Bases";

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
		],
	},
	{
		path: "c/:id",
		element: <Certificate />
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
				element: <Navigate to={"dashboard"} replace/>
			},
			{
				path: "dashboard",
				element: <AdminDashboard/>
			},
			{
				path: "signatures",
				element: <AdminSignatures/>
			},
			{
				path: "signatures/:id",
				element: <SignaturesForm/>	
			},
			{
				path: "bases",
				element: <AdminBases/>
			},
			{
				path: "bases/:id",
				element: <BaseForm/>
			},
			{
				path: "certificates",
				element: <CertificateForm/>
			},
			{
				path: "people",
				element: <AdminPeople/>
			},
			{
				path: "people/:id",
				element: <PeopleForm/>
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
