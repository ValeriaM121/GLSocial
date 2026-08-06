import * as SecureStore from "expo-secure-store"
import { router } from 'expo-router'

export const Logout = async() =>{
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if(refreshToken){
            const response = await fetch(`${baseURL}auth/logout`,{
                method:"POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    refreshToken
                })
            });
            const data = await response.json();
            if(response.ok){
                console.log("Successfully logged out with tokens");
            }else{
                console.log("Logged out anyways with no tokens" + data.message);
            }
        }
    } catch (error) {
        console.error(`Error with backend logging user our or no RefreshToken: ${error}`)
    } finally{
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refreshToken");
        router.replace("/login");
        console.log(`Logged User out`);
    }
}