import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useInfo } from "../lib/info";
const { Header, Content, Footer } = Layout;

export default function NestedLayout() {
	const {owner} = useInfo();
	const navigate = useNavigate();
	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Header className="navbar">
				<div className="logo-navbar">
					<img src="/logo.png" alt="Certifio" onClick={() => navigate("/")}/>
				</div>
				<div className="title-navbar">
					<h1>{owner?.name}</h1>
				</div>
			</Header>
			<Content style={{ padding: "2rem" }}>
				<Outlet />
			</Content>
			<Footer style={{ textAlign: "center" }}>
				{owner && `${owner.name} - `} Certifio v1.0
			</Footer>
		</Layout>
	);
}
