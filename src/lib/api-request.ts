import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export default function useAPIGet<T>(path: string, delay = 400, errorHandler?: (err: AxiosError) => void){
	const [data, setData] = useState<T>();
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		const fetchData =  async () => {
			const start = new Date();
			try {
				const resp = await axios.get(path);
				setData(resp.data);
			}catch(e){
				const error = e as AxiosError;
				if(errorHandler)
					errorHandler(error);
			}
			const end = new Date();
			const elapsed = end.getTime() - start.getTime();
			const tout = elapsed < delay ? delay : 0;
			setTimeout(() => {
				setIsLoading(false);
			}, tout);
		}
		fetchData();
	}, [])
	return {data, isLoading}
}