//@ts-nocheck
import { Result, Spin, Card, Row, Col } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Frame from "../components/certificate/Frame";
import FullscreenSpinner from "../components/FullscreenSpinner";
import {Template, templateToComponent} from "../lib/template";

export default function Certificate(){
	const {id} = useParams();
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [isNotFound, setIsNotFound] = useState(false);

	useEffect(() => {
		if(id){
			const fetchData = async () => {
				const start = new Date();
				try{
					
					const resp = await axios.get(`certificates/${id}`);
					setData(resp.data);
				}
				catch(e){
					console.log(e);
					setIsNotFound(true);
				}
				const end = new Date();
				const elapsed = end.getTime() - start.getTime();
				const delay = elapsed > 1000 ? elapsed : 1000;
				setTimeout(() => {
					setIsLoading(false);
				}, delay);
			}
			fetchData();
		}
	}, [id]);
	if(isLoading)
		return <FullscreenSpinner/>
	if(isNotFound)
		return <Row justify={"center"}>
			<Col xs={24} sm={20} md={18} lg={14} xl={10} xxl={8}>
				<Card>
					<Result status={"warning"} title={"Oklevél nem található"} subTitle={"A megadott azonosítóval nem található oklevél a nyilvántartásban!"}/>
				</Card>
			</Col>
		</Row>
	
	return <div className="certificate-positioner">
		{data && 
		<Frame frameColor={data.frameColor}>
			{data.template.map((t, i) => templateToComponent(t, i.toString(), data.context))}
			<div className="certificate-id">ID: {data.context.certificate.id}</div>
		</Frame>}
	</div>
}