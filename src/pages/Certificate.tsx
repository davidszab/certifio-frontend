import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Frame from "../components/certificate/Frame";
import {Template, templateToComponent} from "../lib/template";

export default function Certificate(){
	const {id} = useParams();
	const [data, setData] = useState();
	useEffect(() => {
		if(id){
			const fetchData = async () => {
				try{
					const resp = await axios.get(`certificates/${id}`);
					console.log(resp);
					setData(resp.data);
				}
				catch(e){
					console.log(e);
				}
			}
			fetchData();
		}
	}, [id]);
	return <Frame>
		{data && data.template.map((t, i) => templateToComponent(t, i.toString(), data.context))}
	</Frame>
}