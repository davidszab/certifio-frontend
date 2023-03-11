import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
const { Header, Content, Footer } = Layout;

export default function NestedLayout(){
	return <Layout style={{minHeight: "100vh"}}>
		<Header>
			<div className="logo-navbar">
				<img src="/logo.png" alt="Certifio" />
			</div>
		</Header>
		<Content style={{padding: "2rem"}}>
			<Outlet/>
		</Content>
		<Footer style={{ textAlign: 'center' }}>Certifio - Online oklevelek</Footer>
	  </Layout>
}
