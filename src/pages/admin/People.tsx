//@ts-nocheck
import { Row, Col, Card, Table, Spin, Button, Form, Input, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAPIGet from "../../lib/api-request";

interface Person {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	isAdmin: boolean;
	createdAt: string;
	updatedAt: string;
}
const backendURL = import.meta.env["PUBLIC_BACKEND_URL"];

export default function AdminPeople() {
	const navigate = useNavigate();
	const { data, isLoading } = useAPIGet<Person[]>("people");

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id"
		},
		{
			title: "Vezetéknév",
			dataIndex: "lastName",
			key: "lastName"
		},
		{
			title: "Keresztnév",
			dataIndex: "firstName",
			key: "firstName"
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email"
		},
		{
			title: "Adminisztrátor",
			dataIndex: "isAdmin",
			key: "isAdmin",
			render: (v: boolean) => v ? "igen" : "nem"
		},
		{
			title: "Felvétel",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (v: string) => new Date(v).toLocaleString("hu")
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
			<Col xs={24}>
				<Card
					extra={<Button type="primary">Új személy felvétele</Button>}
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

export function PeopleForm() {
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
				<Card title={"Személy módosítása"}>
					<Form layout="vertical" requiredMark="optional" onFinish={onFinish}>
						<Form.Item
							label="Vezetéknév"
							name="name"
							initialValue={initData?.name}
							rules={[
								{ required: true, message: "Kérem adja meg az aláíró nevét!" }
							]}
						>
							<Input type="text" placeholder="Teljes név" />
						</Form.Item>
						<Form.Item
							label="Keresztnév"
							name="title"
							initialValue={initData?.title}
							rules={[
								{required: true, message: "Kérem adja meg az aláíró titulusát!"}
							]}
							>
							<Input type="text" placeholder=""/>
						</Form.Item>
						<Form.Item
							label="Email-cím"
							name="email"
							initialValue={initData?.title}
							rules={[
								{required: true, message: "Kérem adja meg az aláíró titulusát!"}
							]}
							>
							<Input type="text" placeholder="Titulus"/>
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