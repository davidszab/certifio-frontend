import { Icon, InlineIcon } from "@iconify/react";
import { Row, Col, Card, Form, Input, Button, Result, Spin } from "antd";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
// import { getUserData, storeJWT } from "../lib/token";
import { useAuth } from "../lib/auth";

enum PageStates {
	EmailForm,
	CodeForm,
	InvalidCredentials,
	EmailSent,
	EmailNotFound,
	EmailError,
	LinkBasedAuth,
}

export default function Authentication() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [state, setState] = useState<PageStates>(PageStates.EmailForm);
	const [email, setEmail] = useState("");
	const navigate = useNavigate();
	const {login, isLoggedIn} = useAuth();
	
	useEffect(()=> {
		if(searchParams.has("token") && searchParams.has("email")){
			const email = searchParams.get("email");
			if(email){
				setState(PageStates.LinkBasedAuth)
				setEmail(email);
			}
		}
	}, [searchParams]);

	useEffect(() => {
		if(state == PageStates.LinkBasedAuth){
			const token = searchParams.get("token");
			const handleLogin = async () => {
				if(!token)
					return;
				const result = await login({email, token});
				if(!result){
					const newSearch = new URLSearchParams(searchParams);
					newSearch.delete("token");
					newSearch.delete("email");
					setSearchParams(newSearch);
					setState(PageStates.InvalidCredentials);
				}

			}
			handleLogin();
		}
	}, [state])

	useEffect(() => {
		if(isLoggedIn)
			navigate("/dashboard");
	}, [isLoggedIn])

	return (
		<Row justify={"center"}>
			{state == PageStates.EmailForm && (
				<EmailForm
					state={state}
					setState={setState}
					email={email}
					setEmail={setEmail}
				/>
			)}
			{state == PageStates.CodeForm && <CodeForm email={email} handleInvalidCredentials={() => setState(PageStates.InvalidCredentials)}/>}
			{state >= PageStates.InvalidCredentials && (
				<AuthResult state={state} email={email} setState={setState} />
			)}
		</Row>
	);
}

interface EmailFormProps {
	state: PageStates;
	setState: (s: PageStates) => void;
	email: string;
	setEmail: (e: string) => void;
}

function EmailForm({ state, setState, email, setEmail }: EmailFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const onFinish = (values: any) => {
		setEmail(values.email);
		setIsLoading(true);
		const startAuth = async () => {
			try {
				await axios.post("auth/start", { email: values.email });
				setState(PageStates.EmailSent);
			} catch (err) {
				const error = err as AxiosError;
				const status = error.response?.status;
				if (status == 404) setState(PageStates.EmailNotFound);
				else setState(PageStates.EmailError);
			}
		};
		startAuth();
	};

	return (
		<Col xs={24} sm={20} md={15} lg={12} xl={8} xxl={5}>
			<Card
				title={"Azonosítás"}
				extra={<Icon icon={"mdi:account-key-outline"} fontSize={"2em"} />}
			>
				<p>
					Az azonosítás megkezdéséhez adja meg az email-címét, amelyre
					értesítést kapott oklevélkiállításról. A rendszer egy levelet fog
					küldeni Önnek, amely tartalmazza a folyamat befejezéséhez szükséges
					lépéseket.
				</p>
				<Form
					name="auth"
					layout="vertical"
					requiredMark="optional"
					onFinish={onFinish}
				>
					<Form.Item
						label="Email-cím"
						name="email"
						rules={[
							{ required: true, message: "Kérem adja meg email-címét!" }
							// {type: 'email', message: "Kérem adjon meg egy érvényes email-címet!"}
						]}
						style={{ marginBottom: "2.2em" }}
					>
						<Input
							type="email"
							autoFocus
							prefix={<InlineIcon icon="mdi:email-outline" fontSize="1.25em" />}
							placeholder="gipsz.jakab@example.com"
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={isLoading}
							size="large"
						>
							Azonosítás
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Col>
	);
}

interface CodeFormProps {
	email: string;
	handleInvalidCredentials: () => void
}

function CodeForm({ email, handleInvalidCredentials }: CodeFormProps) {
	const {login, isLoggedIn} = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const finished = (values: any) => {
		const { code } = values;
		setIsLoading(true);
		const handleLogin = async () => {
			const result = await login({email, code});
			if(!result)
				handleInvalidCredentials();
		}
		handleLogin();
	};
	return (
		<Col xs={24} sm={20} md={15} lg={12} xl={8} xxl={5}>
			<Card
				title={"Kóddal történő azonosítás"}
				extra={<Icon icon={"mdi:email-lock-outline"} />}
			>
				<p>Kérem adja meg a levélben található 4 számjegyű kódót!</p>
				<Form onFinish={finished}>
					<Form.Item
						name="code"
						required
						rules={[
							{
								pattern: /[0-9]{4}/,
								message: "Adja meg a 4 számjegyű kódot!"
							}
						]}
					>
						<Input
							type={"string"}
							autoFocus
							maxLength={4}
							prefix={<Icon icon={"mdi:lock-outline"} />}
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
							loading={isLoading}
						>
							Azonosítás
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Col>
	);
}

interface AuthResultProps {
	state: PageStates;
	email?: string;
	setState: (s: PageStates) => void;
}

function AuthResult({ state, email, setState }: AuthResultProps) {
	const navigate = useNavigate();
	const handleHome = () => {
		navigate("/");
	};
	return (
		<Col xs={24} sm={20} md={18} lg={14} xl={10} xxl={8}>
			<Card
				title={"Azonosítás"}
				extra={<Icon icon={"mdi:account-key-outline"} fontSize={"2em"} />}
			>
				{state == PageStates.EmailSent && (
					<Result
						status={"info"}
						title={"Azonosító email elküdve."}
						subTitle={
							"Kérem ellenőrizze beérkező leveleit, és kövesse a benne található utasításokat!"
						}
						extra={[
							// <Button type={"primary"} key="1">Gmail megnyitása</Button>,
							<Button key="2" onClick={() => setState(PageStates.CodeForm)}>
								Kódot használok
							</Button>,
							<Button key="3" onClick={() => handleHome()}>
								Kezdőlap
							</Button>
						]}
					/>
				)}
				{state == PageStates.EmailNotFound && (
					<Result
						status={"warning"}
						title={"Ismeretlen email-cím."}
						subTitle={`A megadott email-cím (${email}) nem szerepel a nyilvántartásban, ellenőrizze a cím helyességét és próbálja újra!`}
						extra={[
							<Button
								type={"primary"}
								key="1"
								onClick={() => setState(PageStates.EmailForm)}
							>
								Újra
							</Button>,
							<Button key="2" onClick={() => handleHome()}>
								Kezdőlap
							</Button>
						]}
					/>
				)}
				{state == PageStates.EmailError && (
					<Result
						status={"error"}
						title={"Hiba történt."}
						subTitle={
							"Az azonosítási folyamat meghiúsult, kérem próbálja újra később! Ha a hiba tartósan fennáll, értesítse a rendszer üzemeltetőjét!"
						}
						extra={[<Button onClick={() => handleHome()}>Kezdőlap</Button>]}
					/>
				)}
				{state == PageStates.InvalidCredentials && (
					<Result
						status={"error"}
						title={"Sikertelen azonosítás"}
						subTitle={
							"Az azonosításhoz használt hivatkozás vagy kód nem érvényes! Ne feledje, az azonosító információk a levél küldéstől számított 10 percig érvényesek, és csak egyszer használhatóak!"
						}
						extra={[
							<Button
								type={"primary"}
								key="0"
								onClick={() => setState(PageStates.EmailForm)}
							>
								Újra
							</Button>,
							<Button key="1" onClick={() => handleHome()}>Kezdőlap</Button>
						]}
					/>
				)}
				{state == PageStates.LinkBasedAuth && (
					<div style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "250px"}}>
						<Spin size="large"/>
					</div>
				)}
			</Card>
		</Col>
	);
}
