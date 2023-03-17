import { Row, Col, Card, Statistic, StatisticProps, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import useAPIGet from "../../lib/api-request";

function StatisticCard({isLoading, title, value}: {isLoading: Boolean, title: string, value?: number}){
	const Core = () => {
		return <Card>
			<Statistic title={title} value={value}/>
		</Card>
	}
	if(isLoading)
		return <Spin><Core/></Spin>
	else
		return <Core/>
}

interface ApiResponse {
	signatures: number,
	bases: number,
	certificates: number,
	people: number
}

export default function AdminDashboard(){
	const {data, isLoading} = useAPIGet<ApiResponse>("info/statistics");
		return <Row gutter={[16, 32]} justify={"center"}>
			<Col xs={24} md={20}>
				<Row gutter={[16, 32]} justify={"center"}>
					<Col xs={24} md={12}>
						<StatisticCard isLoading={isLoading} title={"Aláírások"} value={data?.signatures}/>
					</Col>
					<Col xs={24} md={12}>
						<StatisticCard isLoading={isLoading} title={"Oklevéltörzsek"} value={data?.bases}/>
					</Col>
					<Col xs={24} md={12}>
						<StatisticCard isLoading={isLoading} title={"Kiadott oklevelek"} value={data?.certificates}/>
					</Col>
					<Col xs={24} md={12}>
						<StatisticCard isLoading={isLoading} title={"Nyilvántartott személyek"} value={data?.people}/>
					</Col>
				</Row>
			</Col>
		</Row>
}