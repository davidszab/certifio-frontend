import { Icon, InlineIcon } from "@iconify/react";
import { Row, Col, Card, Form, Input, Button, Result, Spin } from "antd";

export default function QuickView(){
	return <Row justify={"center"}>
<Col xs={24} sm={20} md={15} lg={12} xl={8} xxl={5}>
			<Card
				title={"Gyors megtekintés"}
				extra={<Icon icon={"mdi:lightning-bolt-outline"} fontSize={"2em"} />}
			>
				<p>
					Az oklevél megtekintéséhez adja meg annak egyedi azonosítóját az alábbi mezőbe!
				</p>
				<Form
					name="auth"
					layout="vertical"
					requiredMark="optional"
				>
					<Form.Item
						label="Oklevél azonosítója"
						name="id"
						rules={[
							{ required: true, message: "Kérem adja meg az oklevél azonosítóját!" }
						]}
						style={{ marginBottom: "2.2em" }}
					>
						<Input
							type="email"
							autoFocus
							prefix={<InlineIcon icon="mdi:certificate-outline" fontSize="1.25em" />}
							placeholder="0123456789"
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
						>
							{/* <InlineIcon icon="mdi:eye-outline"/> */}
							Megtekintés
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Col>
	</Row>
}