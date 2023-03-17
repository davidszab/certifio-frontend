//@ts-nocheck

import { Row, Col, Card, Table, Spin, Button, Form, Input, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAPIGet from "../../lib/api-request";

interface Signature {
	id: number;
	name: string;
	title: string;
	img: string;
	basesUsing: number;
}
const backendURL = import.meta.env["PUBLIC_BACKEND_URL"];

export default function AdminSignatures() {
	const navigate = useNavigate();
	const { data, isLoading } = useAPIGet<Signature[]>("signatures");

	const columns = [
		{
			title: "Név",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "Titulus",
			dataIndex: "title",
			key: "title"
		},
		{
			title: "Aláírás",
			dataIndex: "img",
			key: "img",
			render: (value: string) => (
				<img
					src={`${backendURL}/storage/images/signatures/${value}`}
					style={{ maxHeight: "50px" }}
				/>
			)
		},
		{
			title: "Aláírt törzsek",
			dataIndex: "basesUsing",
			key: "basesUsing",
			render: (value: string) => `${value} db`
		},
		{
			title: "Kezelés",
			dataIndex: "id",
			key: "button",
			render: (value: string) => (
				<Button onClick={() => navigate(`./${value}`)}>Kezelés</Button>
			)
		}
	];

	const dataSource = data?.map((e) => {
		return { ...e, key: e.id };
	});
	const locale = { emptyText: "Nincs megjeleníthető adat." };

	return (
		<Row justify={"center"}>
			<Col xs={24} md={22} lg={20} xl={18}>
				<Card
					extra={<Button type="primary">Új aláírás felvétele</Button>}
					title="Aláírások"
				>
					{isLoading && (
						<Spin>
							<Table columns={columns} dataSource={[]} locale={locale} />
						</Spin>
					)}
					{!isLoading && (
						<Table columns={columns} dataSource={dataSource} locale={locale} />
					)}
				</Card>
			</Col>
		</Row>
	);
}

export function SignaturesForm() {
	const { id } = useParams();
	const isNew = id == "new";
	const [initData, setInitData] = useState();
	useEffect(() => {
		const fetchData = async () => {
			try{
				const resp = await axios.get(`signatures/${id}`);
				setInitData(resp.data)
			}catch(e){console.error(e)};
		}
		if(!isNew)
			fetchData();
	}, [])

	const onFinish = (v: any) => {
		const {name, title} = v;
		const file = v.img.file.originFileObj;
	}

	return (
		<Row justify={"center"}>
			<Col xs={20} md={16} lg={14} xl={12}>
				<Card title={"Aláírás módosítása"}>
					<Form layout="vertical" requiredMark="optional" onFinish={onFinish}>
						<Form.Item
							label="Név"
							name="name"
							initialValue={initData?.name}
							rules={[
								{ required: true, message: "Kérem adja meg az aláíró nevét!" }
							]}
						>
							<Input type="text" placeholder="Teljes név" />
						</Form.Item>
						<Form.Item
							label="Titulus"
							name="title"
							initialValue={initData?.title}
							rules={[
								{required: true, message: "Kérem adja meg az aláíró titulusát!"}
							]}
							>
							<Input type="text" placeholder="Titulus"/>
						</Form.Item>
						<Form.Item
							name="img"
							label="Aláírás"
							required
							>
							<Upload name="logo" accept="image/*" customRequest={(options) => { options.onSuccess("");}} >
								<Button>Tallózás</Button>
							</Upload>
							</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" size="large">
								Módosítás
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</Col>
		</Row>
	);
}
