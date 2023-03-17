//@ts-nocheck
import { Row, Col, Card, Table, Spin, Button, Form, Input, Upload, Select, DatePicker, Space, Checkbox } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAPIGet from "../../lib/api-request";

const {RangePicker} = DatePicker;

interface Base {
	id: number;
	name: string;
	title: string;
	_count: {
		signers: number;
		certificates: number;
	};
}
const backendURL = import.meta.env["PUBLIC_BACKEND_URL"];

export default function AdminBases() {
	const navigate = useNavigate();
	const { data, isLoading } = useAPIGet<Base[]>("bases");

	const columns = [
		{
			title: "Név",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "Publikus név",
			dataIndex: "title",
			key: "title"
		},
		{
			title: "Aláírások",
			dataIndex: "signatures",
			key: "signatures",
			render: (v: number) => `${v} db`
		},
		{
			title: "Kiadott oklevelek",
			dataIndex: "certificates",
			key: "certificates",
			render: (v: number) => `${v} db`
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
					extra={<Button type="primary">Új oklevéltörzs felvétele</Button>}
					title="Oklevéltörzsek"
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

export function BaseForm() {
	const { id } = useParams();
	const isNew = id == "new";
	const [initData, setInitData] = useState();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const resp = await axios.get(`signatures/${id}`);
				setInitData(resp.data);
			} catch (e) {
				console.error(e);
			}
		};
		if (!isNew) fetchData();
	}, []);

	const onFinish = (v: any) => {
		const { name, title } = v;
		const file = v.img.file.originFileObj;
	};

	return (
		<Row justify={"center"}>
			<Col xs={20} md={16} lg={14} xl={12}>
				<Card title={"Oklevéltörzs létrehozása"}>
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
							label="Publikus név"
							name="title"
							initialValue={initData?.title}
							rules={[
								{
									required: true,
									message: "Kérem adja meg az aláíró titulusát!"
								}
							]}
						>
							<Input type="text" placeholder="Titulus" />
						</Form.Item>
						<Form.Item label="Aláírók" name="signers" required>
							<Select
								mode="tags"
								style={{ width: "100%" }}
								placeholder="Tags Mode"
								// onChange={handleChange}
								options={[{label: "Varga Anna (Igazgató)", value: 1}, {label: "Példa Péter (Tanár)", value: 2}]}
							/>
						</Form.Item>

						<Form.Item name="img" label="Szerkezet" required>
							<Upload
								name="logo"
								accept="image/*"
								customRequest={(options) => {
									options.onSuccess("");
								}}
							>
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


export function CertificateForm() {
	const { id } = useParams();
	const isNew = id == "new";
	const [initData, setInitData] = useState();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const resp = await axios.get(`signatures/${id}`);
				setInitData(resp.data);
			} catch (e) {
				console.error(e);
			}
		};
		if (!isNew) fetchData();
	}, []);

	const onFinish = (v: any) => {
		const { name, title } = v;
		const file = v.img.file.originFileObj;
	};

	return (
		<Row justify={"center"}>
			<Col xs={20} md={16} lg={14} xl={12}>
				<Card title={"Oklevélkiadás"}>
					<Form layout="vertical" requiredMark="optional" onFinish={onFinish}>
						<Form.Item
							label="Oklevéltörzs"
							name="name"
							initialValue={initData?.name}
							rules={[
								{ required: true, message: "Kérem adja meg az aláíró nevét!" }
							]}
						>
							  <Select
      options={[
        { value: 'jack', label: '23TAV-CSOP1-ANGOL-K2' },
        { value: 'lucy', label: '23TÉL-CSOP1-ANGOL-K1' },
      ]}
    />
						</Form.Item>
						<Form.Item
							label="Személyek"
							name="title"
							initialValue={initData?.title}
							rules={[
								{
									required: true,
									message: "Kérem adja meg az aláíró titulusát!"
								}
							]}
						>
							<Select
								mode="tags"
								style={{ width: "100%" }}
								placeholder="Tags Mode"
								// onChange={handleChange}
								options={[{label: "Gipsz Jakab (gipsz.jakab@example.com)", value: 1}, {label: "Példa Péter (Tanár)", value: 2}]}
							/>
						</Form.Item>
						<Form.Item label="Keltezés dátuma" name="signers" required>
						<Space direction="vertical" size={12}>
    <DatePicker showTime />
  </Space>
						</Form.Item>

						<Form.Item name="img" label="Email értesítő küldése" required>
							<Checkbox></Checkbox>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" size="large">
								Kiadás
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</Col>
		</Row>
	);
}