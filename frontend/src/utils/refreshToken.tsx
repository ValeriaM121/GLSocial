import * as SecureStore from "expo-secure-store"
import { Logout } from "../utils/logout"
import * as Device from 'expo-device';

/**
 * Deals with refreshing token once the access token expires.
 * For now if anything goes wrong it would just log user out. 
 *  
 * Possible improvement: if the user as network issues and not
 * getting refresh token because of it. It would be annoything for
 * user to deal with consistently logging the user out. So
 * if were to change check reason why refresh fails and see if
 * it's reasonable to log the user out.
 * Also don't think i need to return refreshToken. But for now
 * it stays
 *  
 * @returns a new access token and a new Refresh Token
 */

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
                refreshToken: refreshToken,
                deviceName: Device.deviceName
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