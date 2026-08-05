import { View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { use, useState } from "react";
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { ChangePasswordValidation } from "@/utils/validateChangePassword"

export default function ChangePassword(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF',
        },
        container:{
            flexGrow: 1,
            gap: 30,
            width: '100%',
            paddingTop: 12,
            paddingBottom: 24,
            paddingHorizontal: 20
        },
        textBox:{
            flex:1,
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
        },
        showPass:{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#f1f2f5',
            borderRadius: 15,
            backgroundColor: '#f1f2f5',
            paddingRight : 10
        },
    });

    type passwordType = {password: string, confirmPassword:string};
    const[ passwordForm, setPasswordForm] = useState<passwordType>({
        password:"",
        confirmPassword: ""
    })

    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const {token} = useLocalSearchParams();
    const {id} = useLocalSearchParams();

    const handleSubmitButton = async() =>{
        setLoading(true);
        setErrorMessage("");
        setMessage("");
        
        const check = ChangePasswordValidation(passwordForm);
        if(check){
            setErrorMessage(check);
            setLoading(false);
            return;
        }
        try{
            const response = await fetch(`${baseURL}auth/changePassword`,{
                method: "PATCH",
                headers:{ 
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body:JSON.stringify({
                    id: id,
                    newPassword: passwordForm.password,
                    token: token
                })
            });
            const data = await response.json();
            console.log(data);
            if(response.ok){
                setMessage(data.message);
                router.replace("/login");
            }else{
                setErrorMessage(data.message);
                setLoading(false);
            }

        }catch(error){
            console.error(`Failed to change password: ${error}`);
            setErrorMessage("Failed to change user's password. Please try again later");
        }

        
        //const check = validateForgotPassword(email);
        /*if(check){
            setErrorMessage(check);
            setLoading(false);
        }*/
        

    }
    
    return(
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, backgroundColor: '#1E2128FF'}} keyboardVerticalOffset={0}>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => router.replace('/login')}>
                            <Ionicons name='arrow-back' size={23} color='white'/>
                        </TouchableOpacity>
                        
                        <View style={{gap:10}}>
                            <Text style={{color:"white", fontWeight:"bold", fontSize:30 }}>Change password</Text>
                            <Text style={{color:"white", fontSize: 15}}> Once you submit just login from login page</Text>
                        </View>
                        <View style={{gap: 10, width: '100%'}}>
                            <Text style={{color: 'white', fontSize: 16}}> Password:</Text>
                                <View style={styles.showPass}>
                                    <TextInput
                                        testID="password-input"
                                        style = {styles.textBox}
                                        value={passwordForm.password}
                                        placeholder= "Enter Password"
                                        placeholderTextColor='gray'
                                        onChangeText={(text) => setPasswordForm(prev => ({ ...prev, password: text }))}
                                        secureTextEntry={hidePassword}
                                    /> 
                                    <TouchableOpacity onPress={()=>setHidePassword(!hidePassword)}>
                                        {hidePassword ? <Ionicons name='eye' size={23} color='black'/> : <Ionicons name='eye-off' size={23} color='black'/>}
                                    </TouchableOpacity>
                                </View>
                                <Text style={{color: 'white', fontSize: 16}}> Confirm Password:</Text>
                                <View style={styles.showPass}>
                                    <TextInput
                                        testID="password-input"
                                        style = {styles.textBox}
                                        value={passwordForm.confirmPassword}
                                        placeholder= "Enter Confirm Password"
                                        placeholderTextColor='gray'
                                        onChangeText={(text) => setPasswordForm(prev => ({ ...prev, confirmPassword: text }))}
                                        secureTextEntry={hideConfirmPassword}
                                    /> 
                                    <TouchableOpacity onPress={()=>setHideConfirmPassword(!hideConfirmPassword)}>
                                        {hideConfirmPassword ? <Ionicons name='eye' size={23} color='black'/> : <Ionicons name='eye-off' size={23} color='black'/>}
                                    </TouchableOpacity>
                                </View>
                            {message ? 
                                <Text style={{color:'white'}}>{message}</Text>
                            :
                                null
                            }
                            {errorMessage ? 
                                <Text style={{color:"red"}}>{errorMessage}</Text>
                            :
                                null
                            }
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
                    </View>
                    

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )

}