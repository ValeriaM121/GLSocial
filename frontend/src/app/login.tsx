import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { useState } from 'react'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons'
import * as SecureStore from "expo-secure-store"
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin"
import { validateLogin } from "../utils/validateLogin"
/*type formtype = {email: string, password: string};
    
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/;
    
export const validateLogin = (form: formtype) =>{
    if(!form.email || !form.password){
        return "All fields needs to be filled";
    }
    if(!emailRegex.test(form.email)){
        return "Invalid email input";
    }
    if(!passwordRegex.test(form.password)){
        return "Invalid Password";
    }
}*/


export default function login(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF',
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
        loggingInButton:{
            backgroundColor: 'rgb(95, 101, 199)',
            borderRadius: 25,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }

    })
    type formtype = {email: string, password: string};
    const[loginForm, setLoginForm] = useState<formtype>({
        email: '',
        password: ''
    })

    const [hidePassword, setHidePassword] = useState<boolean>(true);

    const [errorMessage, setErrorMessage] = useState<string>('');
    //const[loading, setLoading] = useState<boolean>(false);
    //const[token, setToken] = useState<string>('');
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const [googleSigningUp, setGoogleSigningUp] = useState<boolean>((false));
    const [googleErrorMessage, setGoogleErrorMessage] = useState<string>("");

    const handleLoginButton = async() =>{
        setErrorMessage('');
        setLoggingIn(true);

        const loginValidate = validateLogin(loginForm);
        if(loginValidate){
            setErrorMessage(loginValidate);
            setLoggingIn(false);
            return;
        }

        try {
            const response = await fetch(`${baseURL}auth/login`,{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    email: loginForm.email,
                    password: loginForm.password
                })
            });

            const data = await response.json();
            if(response.ok){
                setLoginForm({
                    email: '',
                    password: ''
                });
                await SecureStore.setItemAsync('token', data.token);
                router.push('/(tabs)/homepage/homepage');
                setLoggingIn(false);
            }else{
                setErrorMessage(data.message);
                setLoggingIn(false);
                return;
            }
        } catch (error) {
            console.error(`Login Error: ${error}`);
            setErrorMessage("Something went wrong. Please try again later");
            setLoggingIn(false);
        }

    }

    const handleGoogleSignin = async() =>{
            setGoogleSigningUp(true);
            setGoogleErrorMessage('');
            try {
                
                //await GoogleSignin.hasPlayServices();//this is for android (work when get to this)
                const response = await GoogleSignin.signIn();
                //console.log(response.data?.idToken);
                //If user is successful in signing in then it should send Google token to backend
                if(isSuccessResponse(response)){
                    //const { idToken } = await GoogleSignin.getTokens();
                    const idToken = response.data?.idToken;
                    try{
                        const backendResponse = await fetch (`${baseURL}auth/loginGoogle`,{
                            method: 'POST',
                            headers: {"Content-Type": "application/json"},
                            credentials: "include",
                            body: JSON.stringify({
                                idToken: idToken
                            })
                        });
    
                        const data = await backendResponse.json();
                        if(backendResponse.ok){
                            await SecureStore.setItemAsync('token', data.token);
                            if(data.isNewUser){
                                router.push('/quizcontent');
                                setGoogleSigningUp(false);
                            }else{
                                router.push('/(tabs)/homepage/homepage');
                                setGoogleSigningUp(false);
                            }
                        }else{
                            setGoogleErrorMessage(data.message);
                            setGoogleSigningUp(false);
                            return;
                        }
    
                    }catch(error){
                        console.error("Error with logging in with Google");
                        setGoogleSigningUp(false);
                    }
                    
                }else{
                    setGoogleSigningUp(false);
                    setGoogleErrorMessage("Sign in was cancelled by user");
                }
            
    
            } catch (error) {
                if(isErrorWithCode(error)){
                    switch (error.code){
                        case statusCodes.IN_PROGRESS:
                            //operation (eg. sign in) already in progress
                            setGoogleErrorMessage("Google Signin is in progress")
                            break;
                        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                            //This is for android, play services is not available or outdated
                            break;
                        default:
                            //some other error happened
                            setGoogleErrorMessage(error.code);
                    }
                }else{
                    //an error that's not related to google signin occurred
                    setGoogleErrorMessage("An error has occurred");
                }
                setGoogleSigningUp(false);
    
            }
        }
    

    return(
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, backgroundColor: '#1E2128FF'}} keyboardVerticalOffset={0}>
                    <ScrollView contentContainerStyle = {styles.container} keyboardShouldPersistTaps= "handled">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name='arrow-back' size={23} color='white'/>
                        </TouchableOpacity>
                        <View>
                            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 42 }}> Hello </Text>
                            <Text style={{fontWeight: 'bold', color: 'gray', fontSize: 30}}> Welcome Back </Text>
                        </View>
                        <View style={{gap: 10, width: '100%'}}>
                            <Text style={{color: 'white', fontSize: 16}}> Email:</Text>
                            <TextInput
                                value={loginForm.email}
                                placeholder= "Enter email"
                                placeholderTextColor='gray'
                                onChangeText={(text) => setLoginForm(prev => ({ ...prev, email: text }))}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style = {styles.textBox}
                            />
                            <Text style={{color: 'white', fontSize: 16}}> Password:</Text>
                            <View style={styles.showPass}>
                                <TextInput
                                    style = {styles.textBox}
                                    value={loginForm.password}
                                    placeholder= "Enter Password"
                                    placeholderTextColor='gray'
                                    onChangeText={(text) => setLoginForm(prev => ({ ...prev, password: text }))}
                                    secureTextEntry={hidePassword}
                                /> 
                                <TouchableOpacity onPress={()=>setHidePassword(!hidePassword)}>
                                    {hidePassword ? <Ionicons name='eye' size={23} color='black'/> : <Ionicons name='eye-off' size={23} color='black'/>}
                                </TouchableOpacity>
                            </View>
                            
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={{color: '#636AE8FF'}}>Forgot Password?</Text>
                            </View>
                            <View>
                                {errorMessage ? <Text style={{color: 'red', paddingBottom: 10}}>{errorMessage}</Text> : null }
                                {/*{errorMessage.map((errmsg, idx) => <Text key={idx} style={{color:'red', paddingBottom: 10}}>{errmsg}</Text>)}*/}
                            </View>
                            {loggingIn ? 
                            <TouchableOpacity style={styles.loggingInButton} disabled={true}>
                                <Text style= {{ color: 'white' }}>Sign In</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.signInButton} onPress={handleLoginButton}>
                                <Text style= {{ color: 'white' }}>Sign In</Text>
                            </TouchableOpacity>}
                        </View>
                        <View style={{alignItems:'center', gap: 20}}>
                            <Text style={{color:'white'}}>Or login with </Text>
                            {googleSigningUp ? 
                                <TouchableOpacity disabled={true}>
                                    <Image style={{ height: 30, width: 30}} source={require('../../assets/images/googleIcon.png')}/>
                                </TouchableOpacity>
                            :
                                <TouchableOpacity onPress={handleGoogleSignin}>
                                    <Image style={{ height: 30, width: 30}} source={require('../../assets/images/googleIcon.png')}/>
                                </TouchableOpacity>

                            }
                            {googleErrorMessage ? <Text style={{color: 'red'}}>{googleErrorMessage} </Text>
                            : null}
                        </View>
                        <View style={{alignItems: 'center', marginTop: 'auto'}}>
                            <Text style={{color:'white'}}>Don't have an account? <Link style={{color: '#636AE8FF'}} href="/signup" dismissTo>Sign up</Link></Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          
        </SafeAreaView>
    )
}