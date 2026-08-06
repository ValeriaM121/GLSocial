import * as SecureStore from "expo-secure-store"
import { Logout } from "../utils/logout"

export const RefreshToken = async()=>{
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if(!refreshToken){
        await Logout();
        console.error(`No refresh token found`)
        return null;
    }

    try {
        const response = await fetch(`${baseURL}auth/refreshToken`,{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        });
        const data = await response.json();

        if(!response.ok){
            await Logout();
            console.error(`Refresh Token must have been expired or incorrect: ${data.message}`);
            return null;
        };
        
        await SecureStore.setItemAsync('token', data.token);
        await SecureStore.setItemAsync('refreshToken', data.refreshToken);
            
        const newToken = await SecureStore.getItemAsync('token');
        const newRefreshToken = await SecureStore.getItemAsync('refreshToken');
            
        return {newToken, newRefreshToken}
    } catch (error) {
        console.error(`Failed to refreshToken: ${error}`);
        await Logout();
        return null;
    }
    
}