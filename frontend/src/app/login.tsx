import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { useState } from 'react'
import { Link, router, Stack } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons'

export default function login(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF',
        },
        scrollView:{
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
            paddingHorizontal: 20,
            backgroundColor : '#1E2128FF'

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
        }

    })
    type formtype = {email: string, password: string};
    const[loginForm, setLoginForm] = useState<formtype>({
        email: '',
        password: ''
    })

    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const handleShowPassword = () =>{
        setHidePassword(!hidePassword);
    }
    

    return(
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen 
                options ={{
                    headerShown: false
                }}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1, backgroundColor: '#1E2128FF'}} keyboardVerticalOffset={0}>
                    <ScrollView style={styles.scrollView} contentContainerStyle = {styles.container} keyboardShouldPersistTaps= "handled">
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
                                <TouchableOpacity onPress={handleShowPassword}>
                                    {hidePassword ? <Ionicons name='eye' size={23} color='black'/> : <Ionicons name='eye-off' size={23} color='black'/>}
                                </TouchableOpacity>
                            </View>
                            
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Text style={{color: '#636AE8FF'}}>Forgot Password?</Text>
                            </View>
                            <TouchableOpacity style={styles.signInButton}>
                                <Text style= {{ color: 'white' }}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems:'center', gap: 20}}>
                            <Text style={{color: 'white'}}>Or login with</Text>
                            <Image style={{ height: 30, width: 30}} source={require('./../../assets/images/googleIcon.png')}/>
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