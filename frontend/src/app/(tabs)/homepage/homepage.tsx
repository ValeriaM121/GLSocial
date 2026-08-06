import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { Link, router, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from "expo-secure-store";
import { RefreshToken } from '@/utils/refreshToken';

export default function HomePage(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF'
        },
        container:{
            flexGrow: 1,
            justifyContent: 'flex-start',
            gap: 30,
            width: '100%',
            paddingTop: 12,
            paddingBottom: 24,
            paddingHorizontal: 20
        }
    })
    const baseURL = process.env.EXPO_PUBLIC_API_URL
    const [email, setEmail] = useState<string>("");
    const[errorMessage, setErrorMessage] = useState<string>("");

    useEffect(()=>{
        const getEmail = async() =>{
            setErrorMessage('');
            try {
                const token = await SecureStore.getItemAsync('token');
                const response = await fetch(`${baseURL}userInfo/getEmail`,{
                    method:"GET",
                    headers: {Authorization: `Bearer ${token}`}
                });
                const data = await response.json();

                if(response.ok){
                    setEmail(data.email);
                    return;
                }

                if(response.status===401){
                    console.log(response.status);
                    const result = await RefreshToken();
                    if(!result){
                        return;
                    }
                    try{
                        const newResponse = await fetch(`${baseURL}userInfo/getEmail`,{
                            method:"GET",
                            headers: {Authorization: `Bearer ${result.newToken}`}
                        });
                        const newData = await newResponse.json();
                        if(newResponse.ok){
                            setEmail(newData.email);
                        }else{
                            setErrorMessage(newData.message);
                        }
                    }catch(error){
                        console.error(`Error with getting user's email ${error}`);
                        setErrorMessage("Internal server error with getting user's info");
                    }
                    return;
                }
                setErrorMessage(data.message);
            } catch (error) {
                console.error(`Error getting user's email: ${error}`);
                setErrorMessage("Internal sever error");
            }
        }; 
        getEmail();
    },[]);

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                <Text style={{color:"white"}}> This is the homepage. </Text>
                <Text style={{color: "blue"}}>User email is: {email}</Text>
                {errorMessage ? <Text style={{color:"red"}}>{errorMessage}</Text> : null}
            </ScrollView>
        </SafeAreaView>
    )
}