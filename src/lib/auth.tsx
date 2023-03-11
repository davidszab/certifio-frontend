//@ts-nocheck
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Navigate } from "react-router-dom";
import { setJWTHeader, unsetJWTHeader } from "./axios.interceptor";

interface LoginProps {
	email: string,
	token?: string,
	code?: string
}

interface User {
	id: number,
	firstName: string,
	lastName: string,
	email: string,
	isAdmin: boolean,
	createdAt: Date,
	updatedAt: Date
}

function useAuthProvider(){
	const [user, setUser] = useState<User | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isStorageProcessed, setIsStorageProcessed] = useState(false);
	const [axiosInterceptorID, setAxiosInterceptorID] = useState(0);

	useEffect(() => {
		processJWT(sessionStorage.getItem("token"));
	}, []);

	const processJWT = (jwt: string | null) => {
		if(jwt){
			const data: any = jwt_decode(jwt);
			sessionStorage.setItem("token", jwt);
			let person = data.person;
			person.createdAt = new Date(person.createdAt);
			person.updatedAt = new Date(person.updatedAt);
			setUser(person);
			setIsLoggedIn(true);
			setIsStorageProcessed(true);
			setAxiosInterceptorID(setJWTHeader(jwt));
		}else{
			setIsLoggedIn(false);
			setIsStorageProcessed(true);
		}
	}

	const login = async ({email, token, code}: LoginProps) => {
		try {
			const resp = await axios.post("auth/process", { email, token, code });
			processJWT(resp.data.jwt);
		} catch (error) {
			setUser(null);
			setIsLoggedIn(false);
		}
	}
	const logout = () => {
		sessionStorage.removeItem("token");
		setUser(null);
		setIsLoggedIn(false);
		unsetJWTHeader(axiosInterceptorID);
	}

	return {user, isLoggedIn, isStorageProcessed, login, logout}
}

interface useAuthInt {
	user: User,
	isLoggedIn: boolean,
	isStorageProcessed: boolean,
	login: (props: LoginProps) => Promise<boolean>
	logout: () => void
}

const AuthContext = createContext<useAuthInt>({});

function AuthProvider({children}: {children: JSX.Element}){
	const auth = useAuthProvider();
	//@ts-ignore
	return <AuthContext.Provider value={auth}>
		{children}
	</AuthContext.Provider>
}

function useAuth(){
	return useContext(AuthContext);
}

interface ProtectedRouteProps {
	children: JSX.Element
}

function ProtectedRoute({children}: ProtectedRouteProps){
	const {isLoggedIn, isStorageProcessed} = useAuth();
	if(!isStorageProcessed)
		return null;
	if(isLoggedIn)
		return children;
	else
		return <Navigate to={"/"}/>;
}

function AdminRoute({children}: ProtectedRouteProps){
	const {isLoggedIn, isStorageProcessed, user} = useAuth();
	if(!isStorageProcessed)
		return null;
	if(isLoggedIn && user.isAdmin)
		return children;
	else
		return <Navigate to={"/"}/>
}

export {AuthProvider, useAuth, ProtectedRoute, AdminRoute}