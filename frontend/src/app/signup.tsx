import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Link, router, Stack } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@react-native-vector-icons/ionicons'

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
    
    type formtype = {username: string, email: string, password: string, confirmPassword: string};
    const[registerForm, setRegisterform] = useState<formtype> ({
        username: '',
        email:'',
        password: '',
        confirmPassword: ''
    })

    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const handleShowPassword = () => {
        setHidePassword(!hidePassword);
    }

    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);
    const handleShowConfirmPassword = () =>{
        setHideConfirmPassword(!hideConfirmPassword);
    }

    return(
        <SafeAreaView style={styles.safearea}>
            <Stack.Screen 
                options ={{
                    headerShown: false
                }}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}} >
                    <ScrollView contentContainerStyle = {styles.container} keyboardShouldPersistTaps= "handled">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name='arrow-back' size={23} color='white'/>
                        </TouchableOpacity>
                        <View>
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 40}}>Welcome</Text>
                        </View>
                        <View style={{width: '100%', gap: 30}}>
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
                                <TouchableOpacity onPress={handleShowPassword}>
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
                                <TouchableOpacity onPress={handleShowConfirmPassword}>
                                    {hideConfirmPassword ? <Ionicons name='eye' size={23} color='black'/> : <Ionicons name='eye-off' size={23} color='black'/>}
                                </TouchableOpacity>
                            </View>
                            
                            </View>
                            <View>
                                <TouchableOpacity style={styles.signInButton}>
                                    <Text style= {{ color: 'white' }}>Sign In</Text>
                                </TouchableOpacity>
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

