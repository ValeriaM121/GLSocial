import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { Link,router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { validateForgotPassword } from "@/utils/validateForgotPassword"

export default function ForgotPassword(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF',
        },
        container:{
            flexGrow: 1,
            justifyContent: "flex-start",
            gap: 30,
            width: '100%',
            paddingTop: 12,
            paddingBottom: 24,
            paddingHorizontal: 20
        },
        textBox:{
            justifyContent: 'flex-start',
            height: 40,
            borderColor: '#f1f2f5',
            backgroundColor: '#f1f2f5',
            borderRadius: 15,
            padding: 10
        },
        sendButton:{
            backgroundColor: '#636AE8FF',
            borderRadius: 25,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        loadingButton:{
            backgroundColor: 'rgb(95, 101, 199)',
            borderRadius: 25,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

    const [email, setEmail] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const baseURL = process.env.EXPO_PUBLIC_API_URL;

    const handleSubmitButton = async() =>{
        setLoading(true);
        setErrorMessage("");
        setMessage("");

        const check = validateForgotPassword(email);
        if(check){
            setErrorMessage(check);
            setLoading(false);
        }
        
        try {
            const response = await fetch(`${baseURL}auth/forgotPassword`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    email: email
                })
            })
            const data = await response.json();
            if(response.ok){
                setEmail("");
                setMessage(data.message);
            }else{
                setErrorMessage(data.message)
            }
        } catch (error) {
            console.error(`Error with sending user email to reset password: ${error}`);
            setErrorMessage("Something went wrong please try again later");
            setLoading(false);
        }  

    }
    
    return(
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, backgroundColor: '#1E2128FF'}} keyboardVerticalOffset={0}>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name='arrow-back' size={23} color='white'/>
                        </TouchableOpacity>
                        
                        <View style={{gap:10}}>
                            <Text style={{color:"white", fontWeight:"bold", fontSize:30 }}>Forgot Password</Text>
                            <Text style={{color:"white", fontSize: 15}}> We will send the steps to change your password to your email.</Text>
                        </View>
                        <View style={{gap: 10, width: '100%'}}>
                            <Text style={{color: 'white', fontSize: 16}}> Email:</Text>
                            <TextInput
                                value={email}
                                placeholder= "Enter Email"
                                placeholderTextColor='gray'
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style = {styles.textBox}
                                onChangeText={(text) => setEmail(text)}
                            />
                            {errorMessage ? 
                                <Text style={{color:"red"}}>{errorMessage}</Text>
                            :
                                null
                            }
                            {message ? <Text style={{color:"white"}}>{message}</Text> : null}
                        </View>
        
                        {loading ? 
                            <TouchableOpacity style={styles.loadingButton} disabled={true}>
                                <Text style={{color:"white"}}>Submit</Text>
                            </TouchableOpacity>
                        :
                            <TouchableOpacity style={styles.sendButton} onPress={handleSubmitButton}>
                                <Text style={{color:"white"}}>Submit</Text>
                            </TouchableOpacity>
                        }
                        <Link style={{color: '#636AE8FF'}} href="/forgotPassword/changePassword" dismissTo>check</Link>
                    </View>
                    

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )

}