import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from "expo-secure-store";
import {validateUsername} from "@/utils/validateUsername";

export default function GoogleUsername(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF'
        },
        container:{
            flexGrow: 1,
            justifyContent: 'center',
            gap: 30,
            width: '100%',
            paddingTop: 12,
            paddingBottom: 24,
            paddingHorizontal: 20
        },
        box:{
            gap: 10,
            backgroundColor: 'rgb(58, 62, 75)',
            padding: 20,
            borderRadius: 10

        },
        nextButton:{
            backgroundColor: '#636AE8FF',
            borderRadius: 25,
            height: 45,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%'
        },
        textBox:{
            height: 40,
            borderColor: '#f1f2f5',
            backgroundColor: '#f1f2f5',
            borderRadius: 15,
            padding: 10
        }
    });

    const[username, setUsername] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const baseURL = process.env.EXPO_PUBLIC_API_URL;


    const handleAddUsername = async() =>{
        setErrorMessage("");
        const checkUsername = validateUsername(username);
        if(checkUsername){
            setErrorMessage(checkUsername);
            return;
        }
    
        try{
            const token = await SecureStore.getItemAsync('token');
            const response = await fetch(`${baseURL}userInfo/updateUsername`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username
                })
            });
            const data = await response.json();
            if(response.ok){
                setUsername('');
                router.replace("/quizcontent");
            }else{
                setUsername('');
                setErrorMessage(data.message);
            }
        }catch(error){
            console.error(`Failed to update user's username: ${error}`);
            setErrorMessage("Failed to add username. Please try again later");
        }
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                    <View style={styles.box}>
                        <Text style={{color:"white", fontSize:20}}>Before we continue, please create a username</Text>
                        <Text style={{color: 'white', fontSize: 16}}> Username:</Text>
                        <TextInput
                            autoCapitalize="none"
                            value={username}
                            placeholder= "Enter Username"
                            placeholderTextColor='gray'
                            onChangeText={text => setUsername(text)}
                            style = {styles.textBox}
                        />
                        <TouchableOpacity style={styles.nextButton} onPress={handleAddUsername}>
                            <Text style={{color:"white"}}> next</Text>
                        </TouchableOpacity>
                        {errorMessage ? <Text style={{color:"red"}}>{errorMessage}</Text> : null}
                    </View>                 
            </ScrollView>
        </SafeAreaView>
    )
}