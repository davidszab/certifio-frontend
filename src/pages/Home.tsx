import { Row, Col, Card, Button, Skeleton } from "antd";
import { Icon } from "@iconify/react";
import "../styles/pages/home.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useInfo } from "../lib/info";

interface FunctionCardProps {
	title: string;
	icon: string;
	children: JSX.Element | JSX.Element[];
}

function FunctionCard({ title, icon, children }: FunctionCardProps) {
	return (
		<Col xs={24} md={12} xl={6}>
			<Card
				title={title}
				bordered={false}
				style={{ height: "100%" }}
				className="home-card"
				extra={<Icon icon={icon} fontSize="2em" />}
			>
				{children}
			</Card>
		</Col>
	);
}

function QuickView() {
	const navigate = useNavigate();
	return (
		<FunctionCard title="Gyors megtekintés" icon="mdi:lightning-bolt-outline">
			<p>
				Ha egy olyan oklevelet kíván megtekinteni, amelynek ismeri az egyedi
				azonosítóját, akkor bejelentkezés nélkül, csak az azonosító megadásával
				lekérheti az oklevelet.
			</p>
			<Button onClick={() => navigate("/quick-view")} type={"primary"}>
				Gyors megtekintés
			</Button>
		</FunctionCard>
	);
}

function Authentication() {
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	return (
		<FunctionCard
			title="Azonosított megtekintés"
			icon="mdi:account-key-outline"
		>
			<>
				<p>
					Ha már rendelkezik rendszerünkben nyilvántartott oklevelekkel, akkor
					emailes azonosítást követően egyszerre megtekintheti az összes
					kiállított oklevelét.
				</p>
				{isLoggedIn && (
					<>
						<p style={{ textAlign: "center" }}>
							<b>Ön már sikeresen azonosította magát!</b>
						</p>
						<Button onClick={() => navigate("/dashboard")} type={"primary"}>
							Személyes oldal
						</Button>
					</>
				)}
				{!isLoggedIn && (
					<Button onClick={() => navigate("/authentication")} type={"primary"}>
						Azonosítás
					</Button>
				)}
			</>
		</FunctionCard>
	);
}

function About() {
	const navigate = useNavigate();
	return (
		<FunctionCard title="A rendszerről" icon="mdi:information-outline">
			<p>
				Ha többet szeretne megtudni a rendszer működéséről, akkor figyelmébe
				ajánljuk az ismertetőnket és a Gyakran Ismételt Kérdések listáját.
			</p>
			<Button onClick={() => navigate("/about")} type={"primary"}>
				A rendszerről
			</Button>
		</FunctionCard>
	);
}

export default function Home() {
	const {owner} = useInfo();
	return (
		<>
			{owner.name && <h1 style={{textAlign: "center", marginBottom: "3rem", fontSize: "1.5rem"}}>Üdvözöljük a(z) {owner.name} rendszerében!</h1>}
			<Row gutter={[16, 32]} justify={"center"}>
				<QuickView />
				<Authentication />
				<About />
			</Row>
		</>
	);
}
