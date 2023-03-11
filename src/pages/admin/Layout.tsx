import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const { Header, Content, Footer, Sider } = Layout;

const items = [
	{
		label: "Vezérlőpult",
		path: "dashboard",
		icon: "mdi:monitor-dashboard"
	},
	{
		label: "Aláírások",
		path: "signatures",
		icon: "mdi:signature"
	},
	{
		label: "Oklevéltörzsek",
		path: "bases",
		icon: "mdi:pencil-ruler"
	},
	{
		label: "Oklevelek",
		path: "certificates",
		icon: "mdi:certificate"
	},
	{
		label: "Személyek",
		path: "people",
		icon: "mdi:account-group"
	}
]

export default function AdminLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname.split("/");
	const currentKey = path[path.length - 1];

	return (
		<Layout style={{minHeight: "100vh"}}>
			<Sider
				breakpoint="lg"
				collapsedWidth="0"
			>
				<div className="logo-sidebar">
					<img src="/logo.png" alt="Certifio" />
				</div>
				<Menu
					theme="dark"
					mode="inline"
					items={items.map((e) => {
						return {
							label: e.label,
							icon: <Icon icon={e.icon} style={{fontSize: "1.5rem"}}/>,
							key: e.path,
						}	
					})}
					selectedKeys={[currentKey]}
					onSelect={(info) => navigate(`/admin/${info.key}`)}
				/>
			</Sider>
			<Layout>
				<Content style={{padding: "3rem", backgroundColor: "rgb(240, 242, 245)"}}>
					<Outlet/>
				</Content>
			</Layout>
		</Layout>
	);
}
