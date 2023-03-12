import axios from "axios";
import { useEffect, useState, createContext, useContext } from "react";

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
	
	useEffect(() => {
		const fetchData = async () => {
			try{
				const resp = await axios.get("info/owner");
				const v = resp.data as OwnerInfo;
				document.title = `Certifio - ${v.name}`
				setOwnerInfo(v);
			}catch(e){
				console.error(e);
			}
		}
		fetchData();
	}, [])

	return ownerInfo;
}

const InfoContext = createContext<{owner: OwnerInfo}>({owner: {name: ""}});

export function InfoProvider({children}: {children: JSX.Element}){
	const owner = useOwnerInfo();
	return <InfoContext.Provider value={{owner}}>
		{children}
	</InfoContext.Provider>
}

export function useInfo(){
	return useContext(InfoContext);
}