import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@react-native-vector-icons/ionicons'
import * as SecureStore from "expo-secure-store"
import React from "react"

/*

    TO DO:
     - Add user input checks
     - Add Backend API
*/

export default function SignUp(){
    const styles = StyleSheet.create({
        safearea:{
            flex:1,
            backgroundColor: '#1E2128FF'
        },
        container:{
            flexGrow: 1,
            justifyContent: 'space-between',
            gap: 40,
            width: '100%',
            paddingBottom: 40,
            paddingHorizontal: 20

        },
        textBox:{
            flex: 1,
            justifyContent: 'flex-start',
            height: 40,
            borderColor: '#f1f2f5',
            backgroundColor: '#f1f2f5',
            borderRadius: 15,
            padding: 10
        },
        signInButton:{
            backgroundColor: '#636AE8FF',
            borderRadius: 25,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        showPass:{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#f1f2f5',
            borderRadius: 15,
            backgroundColor: '#f1f2f5',
            paddingRight : 10
        },
        signingUpButton:{
            backgroundColor: 'rgb(95, 101, 199)',
            borderRadius: 25,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    })
    
    type formtype = {username: string, email: string, password: string, confirmPassword: string};
    const[registerForm, setRegisterform] = useState<formtype> ({
        username: '',
        email:'',
        password: '',
        confirmPassword: ''
    })

    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);
   

    const[errorMessage, setErrorMessage] = useState<string[]>([]);
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const [signingUp, setSigningUp] = useState<boolean>(false);

    const handleSignInButton = async() =>{
        setErrorMessage([]);
        setSigningUp(true);
        

        if(!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword){
            setErrorMessage(prev => [...prev, "All fields needs to be filled"]);
            setSigningUp(false);
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        
        if(!emailRegex.test(registerForm.email) && registerForm.email){
            setErrorMessage(prev => [...prev, "Invalid email input"]);
            setSigningUp(false);
            return;
        }

        const usernameRegex = /^[a-z][a-z0-9._]{3,}$/
        if(!usernameRegex.test(registerForm.username) && registerForm.username){
            setErrorMessage(prev => [...prev, "Invalid username (Starts with lowercase and needs to be 3 characters long)"]);
            setSigningUp(false);
            return;
        }

        if(registerForm.password !== registerForm.confirmPassword){
            setErrorMessage(prev => [...prev, "Passwords need to match"]);
            setSigningUp(false);
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/
        if(!passwordRegex.test(registerForm.password) && !passwordRegex.test(registerForm.confirmPassword) && registerForm.password ){
            setErrorMessage(prev => [...prev, "Password needs to be 8 characters long. Must contain uppercase, lowercase, unique character (@$!%*?&#) and a number"])
            setSigningUp(false);
            return;
        }
        try{
            const response = await fetch(`${baseURL}auth/register`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    username: registerForm.username,
                    email: registerForm.email,
                    password: registerForm.password,
                    confirmPassword: registerForm.confirmPassword
                })
            });

            const data = await response.json();

            if(response.ok){
                await SecureStore.setItemAsync('token', data.token);
                router.push('/quizcontent');
            }else{
                
                setErrorMessage(prev => [...prev, data.message]);
                setSigningUp(false);
                return;
            }
        }catch(error){
            console.error("Error with registering user");
            setSigningUp(false);
        }
    }

    return(
        <SafeAreaView style={styles.safearea}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}} >
                    <ScrollView contentContainerStyle = {styles.container} keyboardShouldPersistTaps= "handled">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name='arrow-back' size={23} color='white'/>
                        </TouchableOpacity>
                        <View>
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 40}}>Welcome</Text>
                        </View>
                        <View style={{width: '100%', gap: 20}}>
                            <View style={{width: '100%', gap: 10}}>

                            
                                <Text style={{color: 'white', fontSize: 16}}> Username:</Text>
                                <TextInput
                                    value={registerForm.username}
                                    placeholder= "Enter Username"
                                    placeholderTextColor='gray'
                                    onChangeText={(text) => setRegisterform(prev => ({ ...prev, username: text }))}
                                    style = {styles.textBox}
                                />
                                <Text style={{color: 'white', fontSize: 16}}> Email:</Text>
                                <TextInput
                                    value={registerForm.email}
                                    placeholder= "Enter email"
                                    placeholderTextColor='gray'
                                    onChangeText={(text) => setRegisterform(prev => ({ ...prev, email: text }))}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style = {styles.textBox}
                                />
                                <Text style={{color: 'white', fontSize: 16, flex:1}}> Password:</Text>
                                <View style={styles.showPass}>
                                    <TextInput
                                        value={registerForm.password}
                                        placeholder= "Enter password"
                                        placeholderTextColor='gray'
                                        onChangeText={(text) => setRegisterform(prev => ({ ...prev, password: text }))}
                                        style = {styles.textBox}
                                        secureTextEntry={hidePassword}
                                    />
                                    <TouchableOpacity onPress={()=>setHidePassword(!hidePassword)}>
                                        {hidePassword ? <Ionicons name='eye' size={23} color='black'/> : <Ionicons name='eye-off' size={23} color='black'/>}
                                    </TouchableOpacity>
                                </View>
                            
                                <Text style={{color: 'white', fontSize: 16}}> Confirm Password:</Text>
                                <View  style={styles.showPass}>
                                    <TextInput
                                        value={registerForm.confirmPassword}
                                        placeholder= "Confirm password"
                                        placeholderTextColor='gray'
                                        onChangeText={(text) => setRegisterform(prev => ({ ...prev, confirmPassword: text }))}
                                        style = {styles.textBox}
                                        secureTextEntry={hideConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={()=>setHideConfirmPassword(!hideConfirmPassword)}>
                                        {hideConfirmPassword ? <Ionicons name='eye' size={23} color='black'/> : <Ionicons name='eye-off' size={23} color='black'/>}
                                    </TouchableOpacity>
                                </View>
                            
                            </View>
                            
                            <View>
                                {errorMessage.map((errmsg, idx) => <Text key={idx} style={{color:'red', paddingBottom: 10}}>{errmsg}</Text>)}
                                {signingUp ? 
                                <TouchableOpacity style={styles.signingUpButton} disabled={true}>
                                    <Text style= {{ color: 'white' }}>Sign In</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity style={styles.signInButton} onPress={handleSignInButton}>
                                    <Text style= {{ color: 'white' }}>Sign In</Text>
                                </TouchableOpacity> }
                            </View>
                        </View>
                        <View style={{alignItems: 'center', gap: 20 }}>
                            <Text style={{color: 'white'}}> Or login with </Text>
                            <Image style={{ height: 30, width: 30}} source={require('./../../assets/images/googleIcon.png')}/>
                        </View>
                        <View style={{alignItems: 'center',  marginTop: 'auto'}}>
                            <Text style={{color: 'white'}}>Already have an account? <Link href='/login' style={{ color: '#636AE8FF'}} dismissTo>Login</Link> </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}   

