import { Row, Col, Card, Statistic, StatisticProps } from "antd";

function StatisticCard(props: StatisticProps){
	return <Card>
		<Statistic {...props}/>
	</Card>
}

export default function AdminDashboard(){
	return <>
		<h1>Vezérlőpult</h1>
		<Row gutter={[16, 32]} justify={"center"}>
			<Col xs={24} md={20} lg={18}>
				<Row gutter={[16, 32]} justify={"center"}>
					<Col xs={12}>
						<StatisticCard title={"Aláírások"}/>
					</Col>
					<Col xs={12}>
						<StatisticCard title={"Oklevéltörzsek"}/>
					</Col>
					<Col xs={12}>
						<StatisticCard title={"Kiadott oklevelek"}/>
					</Col>
					<Col xs={12}>
						<StatisticCard title={"Nyilvántartott személyek"}/>
					</Col>
				</Row>
			</Col>
		</Row>
	</>
}