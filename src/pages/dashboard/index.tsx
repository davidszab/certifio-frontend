//@ts-nocheck
import {
	Layout,
	Row,
	Col,
	Card,
	Button,
	Statistic,
	Tabs,
	TabsProps,
	Timeline,
	Popconfirm,
	TimelineItemProps,
	TableColumnsType,
	Table,
	Space,
	Spin
} from "antd";
import { InlineIcon } from "@iconify/react";
import { useAuth } from "../../lib/auth";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogoutButton(){
	const {logout} = useAuth();
	return <Popconfirm
    title="Kijelentkezés"
    description="Biztosan ki szeretne jelentkezni?"
    okText="Igen"
	okButtonProps={{danger: true}}
    cancelText="Nem"
	cancelButtonProps={{danger: true}}
	onConfirm={() => logout()}
	icon={<InlineIcon icon={"mdi:logout"}/>}
  	>
		<Button danger>Kijelentkezés</Button>
  	</Popconfirm>
}

function DashboardButtons() {
	const {user} = useAuth();
	const navigate = useNavigate();
	return <Space>
		{user && user.isAdmin && <Button onClick={() => navigate("/admin")}>Adminisztratív felület</Button>}
		<LogoutButton/>
	</Space>
}

export default function Dashboard() {
	const {user} = useAuth();
	const [certificates, setCertificates] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if(user){
			const fetchData = async () => {
				try{
					const start = new Date();
					const resp = await axios.get("/certificates");
					const data = resp.data.map((e: any) => {
						return {id: e.id, title: e.title, date: new Date(e.date)}
					});
					const end = new Date();
					console.log(end.getTime() - start.getTime());
					const delay = (end.getTime() - start.getTime()) >= 1000 ? 0 : 1000;
					setTimeout(() => {
						setCertificates(data);
						setIsLoading(false);
					}, delay);
				}catch(err){
					console.error(err);
				}
			}
			fetchData();
		}
	}, [user])

	if (!user) return null;

	const items: TabsProps["items"] = [
		{
			key: "tab1",
			label: <span><InlineIcon icon={"mdi:view-list-outline"}/> Oklevelek</span>,
			children: <CertificateTable certificates={certificates} isLoading={isLoading}/>
		},
		{
			key: "tab2",
			label: <span><InlineIcon icon={"mdi:timeline-text-outline"}/> Idővonal</span>,
			children: <UserTimeline certificates={certificates} isLoading={isLoading}/>
		},
		{
			key: "tab3",
			label: <span><InlineIcon icon={"mdi:account-details-outline"}/> Személyes adatok</span>,
			children: <UserDetails/>
		}
	];
	return (
		<>
			<Row justify={"center"}>
				<Col xs={24} md={20} lg={15} xl={12}>
					<Card title={"Személyes oldal"} extra={<DashboardButtons/>}>
						<div style={{display: "flex", alignItems: "center"}}>
							<h1>{user.lastName} {user.firstName}</h1>
							<Card style={{marginLeft: "auto"}}>
								{isLoading && <Spin><Statistic value={0} suffix={" db"} title={"Nyilvántartott oklevelek"} /></Spin>}
								{!isLoading && <Statistic value={certificates.length} suffix={" db"} title={"Nyilvántartott oklevelek"} />}
							</Card>
						</div>
					</Card>
					<br/>
					<Card>
						<Tabs items={items} centered />
					</Card>
				</Col>
			</Row>
		</>
	);
}

interface CertificateTableType {
	id: string
	title: string
	date: Date
}

function CertificateTable({certificates, isLoading}: {certificates: CertificateTableType[], isLoading: boolean}){
	const navigate = useNavigate();
	const columns: ColumnsType<CertificateTableType> = [
		{
			key: "1",
			title: "Megnevezés",
			dataIndex: "title",
		},
		{
			key: "2",
			title: "Kibocsájtás ideje",
			dataIndex: "date",
			render: (v: Date) => v.toLocaleDateString("hu")
		},
		{
			key: "3",
			title: "Azonosító",
			dataIndex: "id"
		},
		{
			key: "4",
			dataIndex: "id",
			render: (text) => <Button onClick={() => navigate(`/c/${text}`)}><InlineIcon icon={"mdi:eye"}/></Button>,
			align: "center"
		}
	]
	return <>
		{isLoading && <Spin><Table columns={columns} dataSource={certificates} bordered pagination={false} size={"small"} scroll={{x: true}} locale={{emptyText: "Nincs rögzített oklevele."}}/></Spin>}
		{!isLoading && <Table columns={columns} dataSource={certificates} bordered pagination={false} size={"small"} scroll={{x: true}} locale={{emptyText: "Nincs rögzített oklevele."}}/>}

	</>
}

function UserTimeline({isLoading, certificates}: {isLoading: boolean, certificates: CertificateTableType[]}){
	const { user } = useAuth();
	const [items, setItems] = useState<TimelineItemProps[]>([]);

	useEffect(() => {
		if(!isLoading){
			const items: TimelineItemProps[] = certificates.map((e) => {
				return {
					label: e.date.toLocaleString("hu"),
					children: <div>
						<b>Oklevél kiadás</b>
						<p>{e.title} ({e.id})</p>
					</div>
				}
			});
			items.unshift({
				label: user.createdAt.toLocaleString("hu"), 
				children: <div>
					<b>Nyilvántartásba véve.</b>
					<p>Az Ön személyes adatai rögzítésre kerültek a rendszerben.</p>
				</div>
			})
			setItems(items);
		}
	},[isLoading])

	return <Timeline items={items} mode={"left"} reverse={true}/>;
}

function UserDetails() {
	const {user}= useAuth();
	const fields = [
		{
			label: "Vezetéknév",
			key: "lastName"
		},
		{
			label: "Keresztnév",
			key: "firstName"
		},
		{
			label: "E-mail cím",
			key: "email"
		},
		{
			label: "Nyilvántartásba vétel dátuma",
			key: "createdAt",
			modifier: (v: Date) => v.toLocaleString("hu")
		},
		{
			label: "Módosítás dátuma",
			key: "updatedAt",
			modifier: (v: Date) => v.toLocaleString("hu")
		}
	]

	return (
		<>
			<Row gutter={[16, 16]}>
				{fields.map((e) => <Col xs={24} lg={12}>
					<Statistic title={e.label} value={e.modifier ? e.modifier(user[e.key]) : user[e.key]} />
				</Col>)}
			</Row>
		</>
	);
}
