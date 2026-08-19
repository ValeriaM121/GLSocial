import { RefreshToken } from "@/utils/refreshToken"
import * as SecureStore from "expo-secure-store";


export const BackendCalls = async (route:string, method:string, data?:any) =>{
    
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const token = await SecureStore.getItemAsync('token');
    
    if(method === "POST" || method === "PATCH"){
        let response;
        try {
            response = await fetch(`${baseURL}${route}`,{
                method: method,
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
        } catch (error) {
            console.error(`Failed reaching server: ${error}`);
            throw new Error("Failed to reach server. Please try again");
        }
        const returnData = await response.json();
        if(response.ok){
            return returnData
        }
        if(response.status === 401){
            const result = await RefreshToken();
            if(!result){
                throw new Error("Failed to refresh token");
            }
            let secondResponse;
            try{
                secondResponse = await fetch(`${baseURL}${route}`,{
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${result.newToken}`
                    },
                    body: JSON.stringify(data)
                });
            }catch(error){
                console.error(`Failed to connect to server error: ${error}`);
                throw new Error(`Failed to reach server. Please try again`);
            }
            const secondData = await secondResponse.json();
            if(secondResponse.ok){
                return secondData;
            }
            throw new Error(secondData.message);
        }
        throw new Error(returnData.message);
    }

    if(method === "GET" || method === "DELETE"){
        let response;
        try {
            response = await fetch(`${baseURL}${route}`,{
                method: method,
                
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error(`Failed to reach server: ${error}`);
            throw new Error("Failed to reach the server. Please try again");
        }
        const data = await response.json();
        if(response.ok){
            return data
        }
        if(response.status === 401){
            const result = await RefreshToken();
            if(!result){
                throw new Error('Failed to refresh token');
            }
            let secondResponse;
            try{
                secondResponse = await fetch(`${baseURL}${route}`,{
                    method: method,
                    headers: {
                        "Authorization": `Bearer ${result.newToken}`
                    }
                });
            }catch(error){
                console.error(`Failed to reach server: ${error}`);
                throw new Error("Failed to reach the server. Please try again");
            }
            const secondData = await secondResponse.json();
            if(secondResponse.ok){
                return secondData
            }
            throw new Error(secondData.message);
        }
        throw new Error(data.message);
    }
    
}