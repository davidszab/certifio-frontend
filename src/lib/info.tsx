import { Button, Result, Spin } from "antd";
import axios, { AxiosError } from "axios";
import { useEffect, useState, createContext, useContext } from "react";
import FullscreenSpinner from "../components/FullscreenSpinner";

export interface OwnerInfo {
	name: string;
	address?: {
		country: string;
		postalCode: string;
		city: string;
		street: string;
	};
	website?: string;
	contact?: {
		name: string;
		email: string;
	};
}

function useOwnerInfo(){
	const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>({name: ""});
	const [isLoading, setIsLoading] = useState(true);
	const [noConnection, setNoConnection] = useState(false);
	
	useEffect(() => {
		const fetchData = async () => {
			const start = new Date();
			try{
				const resp = await axios.get("info/owner");
				const v = resp.data as OwnerInfo;
				document.title = `Certifio - ${v.name}`
				setOwnerInfo(v);
			}catch(e: any){
				e = e as AxiosError;
				console.error(e);
				if(e.code == "ERR_NETWORK")
					setNoConnection(true);
			}
			const end = new Date();
			const elapsed = end.getTime() - start.getTime();
			const delay = elapsed > 1000 ? elapsed : 1000;
			setTimeout(() => {
				setIsLoading(false);
			}, delay)
		}
		fetchData();
	}, [])

	return {ownerInfo, noConnection, isLoading};
}

const InfoContext = createContext<{owner: OwnerInfo}>({owner: {name: ""}});

export function InfoProvider({children}: {children: JSX.Element}){
	const {noConnection, ownerInfo, isLoading} = useOwnerInfo();

	if(isLoading)
		return <FullscreenSpinner/>
	if(noConnection)
		return <Result title="Nincs kapcsolat!" status={"error"} subTitle={"A háttérrendszerrel meghiúsult a kommunikáció! Kérjük próbálja újra később!"}/>
	return <InfoContext.Provider value={{owner: ownerInfo}}>
		{children}
	</InfoContext.Provider>
}

export function useInfo(){
	return useContext(InfoContext);
}