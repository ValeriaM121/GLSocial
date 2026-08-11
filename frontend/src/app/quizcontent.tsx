import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useState, useEffect } from 'react'
import { Link, router, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from "expo-secure-store";
import { RefreshToken } from "@/utils/refreshToken"

export default function quizContent(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF'
        },
        container:{
            flexGrow: 1,
            justifyContent: 'space-between',
            gap: 30,
            width: '100%',
            paddingTop: 12,
            paddingBottom: 24,
            paddingHorizontal: 20
        },
        nextButton:{
            backgroundColor: '#636AE8FF',
            borderRadius: 25,
            height: 45,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%'
        }
    });
    
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const [username, setUsername] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");


    /*useEffect( () =>{
        const getUsername = async() =>{
            try {
                const token = await SecureStore.getItemAsync('token');
                const response = await fetch(`${baseURL}userInfo/getUsername`,{
                    method: "GET",
                    headers: {Authorization: `Bearer ${token}`}
                });
                const data = await response.json();
                if(response.ok){
                    setUsername(data.username);
                    return;
                }
                if(response.status === 401){
                    const result = RefreshToken();
                    if(!result){
                        return;
                    }
                    try{
                        const newResponse = await fetch(`${baseURL}userInfo/getUsername`,{
                            method: "GET",
                            headers: {Authorization: `Bearer ${token}`}
                        });
                        const newData = await newResponse.json();
                        if(newResponse.ok){
                            setUsername(newData.username);
                            return;
                        }else{
                            setErrorMessage(newData.message);
                            return;
                        }

                    }catch(error){
                        console.error(`Issue with getting user's username within refresh: ${error}`);
                        setErrorMessage(`There was in issue with getting user's username. Maybe try again later.`);
                    }
                    setErrorMessage(data.message);
                }
            } catch (error) {
                console.error(`Failed to get user's username with access token: ${error}`);
                setErrorMessage("Failed to get username. Maybe try later");
            }
        }
        getUsername();
    },[]);
    */


    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                    <Text style={{color:"white", fontSize:28, fontWeight: 'bold'}}> May you please choose shows you like?</Text>
                    {errorMessage ? <Text style={{color:"red"}}>{errorMessage} </Text> : null}
                    <Link href="/(tabs)/homepage/homepage" push asChild>
                        <TouchableOpacity style={styles.nextButton}>
                            <Text style={{color:"white"}}> next</Text>
                        </TouchableOpacity>
                    </Link>                
            </ScrollView>
        </SafeAreaView>
    )
}