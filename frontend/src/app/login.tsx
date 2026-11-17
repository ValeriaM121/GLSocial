import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { FONTSIZE, COLORS, SIGNUPBUTTON } from "@/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context"
import { Link, router } from "expo-router"
import Ionicons from '@react-native-vector-icons/ionicons'
import { ValidateLogin } from '@/utils/ValidateLogin';


export default function Login(){
    type loginType = {email: string, password: string};
    const [loginForm, setLoginForm] = useState<loginType>({
        email: '',
        password: ''
    });
    const [hidePassword, setHidePassword] = useState<boolean>(true);

    const[loggingIn, setLogginIn] = useState<boolean>(false);
    const[errorMessage, setErrorMessage] = useState<string>("");

    const handleLoggingIn = () =>{
        setLogginIn(true);

        const validateErrorMessage = ValidateLogin(loginForm);
        if(validateErrorMessage){
            setLogginIn(false);
            setErrorMessage(validateErrorMessage);
            return;
        }
        setErrorMessage("");
    }

    return(
         <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', gap: 40 }}>
                        <View style={{gap:30}}>
                            <TouchableOpacity onPress={() => router.dismissTo('/')}>
                                <Ionicons name='arrow-back' size={23} color={'white'}/>
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.header}>Welcome Back!</Text>
                            </View>
                            <View style={{gap:15}}>
                                <Text style={styles.text}>Email:</Text>
                                <TextInput
                                    autoCapitalize='none'
                                    value={loginForm.email}
                                    onChangeText={(text) => setLoginForm({...loginForm, email: text})}
                                    placeholder='Enter Email'
                                    placeholderTextColor='gray'
                                    style={styles.textBox}
                                />
                                <Text style={styles.text}>Password:</Text>
                                <View style={styles.eyeIcon}>
                                    <TextInput
                                        autoCapitalize='none'
                                        value={loginForm.password}
                                        onChangeText={(text) => setLoginForm({...loginForm, password: text})}
                                        placeholder='Enter Password'
                                        placeholderTextColor='gray'
                                        style={styles.passwordTextBox}
                                        secureTextEntry={hidePassword}
                                    />
                                    <TouchableOpacity onPress={()=>setHidePassword(!hidePassword)}>
                                        {hidePassword ? <Ionicons name='eye' size={23} color={'black'}/> : <Ionicons name='eye-off' size={23} color={'black'}/>}
                                    </TouchableOpacity>
                                </View>
                                {errorMessage ? <Text style={{color:COLORS.error}}>{errorMessage}</Text> : null}
                            </View>
                            <View>
                                <TouchableOpacity style={styles.loginButton} onPress={handleLoggingIn}>
                                    <Text style={{color:"white", alignSelf: 'center', fontSize:FONTSIZE.regular}}> Login </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems: 'center', gap:15}}>
                                <Text style={{color: 'white'}}>OR</Text>
                                <TouchableOpacity>
                                    <Image style={{height: 30, width: 30}} source={require('../../assets/images/googleIcon.png')}/>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        <View style={{alignItems: 'center', marginTop: 30}}>
                            <Text style={{color: 'white'}}>Don't have an account? <Link href="/signup" style={{color: '#636AE8FF'}}>Sign Up</Link></Text>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
         </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: COLORS.background,
        flex:1,
        paddingBottom: 40,
        paddingHorizontal: 20,
        width: '100%'
    },
    header:{
        fontSize: FONTSIZE.header,
        color: COLORS.text,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    subheader:{
        fontSize: FONTSIZE.subText,
        color: COLORS.text,
        fontWeight: 'bold'
    },
    text:{
        fontSize: FONTSIZE.large,
        color: COLORS.text
    },
    loginButton:{
        backgroundColor: SIGNUPBUTTON.backgroundColor,
        borderRadius: SIGNUPBUTTON.borderRadius,
        height: SIGNUPBUTTON.height,
        alignContent: 'center',
        justifyContent: 'center'
    },
    textBox:{
        justifyContent: 'flex-start',
        height: 40,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10
    },
    passwordTextBox:{
        justifyContent: 'flex-start',
        height: 40,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        flex: 1
    },
    eyeIcon:{
        flexDirection:'row',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: 'white',
        backgroundColor: 'white',
        paddingRight: 10
    }
})