import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { FONTSIZE, COLORS, SIGNUPBUTTON } from "@/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context"
import { Link, router } from "expo-router"
import Ionicons from '@react-native-vector-icons/ionicons'
import { ValidateRegistration } from '@/utils/ValidateRegistration';

/*

    Notes:
        - For the TouchableWithoutFeedback doesn't need to be holding everything. It can just be certain parts
        but it only accepts one child. So will need to have it in a view.

        - ScrollView I don't think it's needed but should add if needed

        - KeyboardAvoidingView is to make sure keyboard isn't blocking anything that should be shown to user
        so check when creating page keyboard isn't blocking anything. If it does need to add KeyboardAvoidingView.

*/

export default function SignUp(){
    type signUpForm= {username: string, email: string, password:string, confirmPassword:string};
    const [registerForm, setRegisterForm] = useState<signUpForm> ({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);

    const [signingUp, setSigningUp] = useState<boolean>(false);
    const[errorMessage, setErrorMessage] = useState<string>("");

    const handleSignUp = () =>{
        setSigningUp(true);

        const validateErrorMessage = ValidateRegistration(registerForm);
        if(validateErrorMessage){
            setSigningUp(false);
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
                        <View style={{ gap: 30 }}>
                            <TouchableOpacity onPress={() => router.dismissTo('/')}>
                                <Ionicons name='arrow-back' size={23} color='white'/>
                            </TouchableOpacity>
                            <View>
                              <Text style={styles.header}>Welcome!</Text>
                            </View>
                            <View style={{gap: 15}}>
                               <Text style={styles.text}>Username:</Text>
                                <TextInput
                                    autoCapitalize='none'
                                    value={registerForm.username}
                                    onChangeText={(text) => setRegisterForm({...registerForm, username: text})}
                                    placeholder='Enter Username'
                                    placeholderTextColor='gray'
                                    style={styles.textBox}
                                />
                                <Text style={styles.text}>Email:</Text>
                                <TextInput
                                    autoCapitalize='none'
                                    value={registerForm.email}
                                    onChangeText={(text) => setRegisterForm({...registerForm, email: text})}
                                    placeholder='Enter Email'
                                    placeholderTextColor='gray'
                                    style={styles.textBox}
                                />
                                <Text style={styles.text}>Password:</Text>
                                <View style={styles.eyeIcon}>
                                    <TextInput
                                        autoCapitalize='none'
                                        value={registerForm.password}
                                        onChangeText={(text) => setRegisterForm({...registerForm, password: text})}
                                        placeholder='Enter Password'
                                        placeholderTextColor='gray'
                                        style={styles.passwordTextBox}
                                        secureTextEntry={hidePassword}
                                    />
                                    <TouchableOpacity onPress={()=>setHidePassword(!hidePassword)}>
                                        {hidePassword ? <Ionicons name='eye' size={23} color={'black'}/> : <Ionicons name='eye-off' size={23} color={'black'}/>}
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.text}>Confirm Password:</Text>
                                <View style={styles.eyeIcon}>
                                    <TextInput
                                        autoCapitalize='none'
                                        value={registerForm.confirmPassword}
                                        onChangeText={(text) => setRegisterForm({...registerForm, confirmPassword: text})}
                                        placeholder='Confirm Password'
                                        placeholderTextColor='gray'
                                        style={styles.passwordTextBox}
                                        secureTextEntry={hideConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={()=>setHideConfirmPassword(!hideConfirmPassword)}>
                                        {hideConfirmPassword ? <Ionicons name='eye' size={23} color={'black'}/> : <Ionicons name='eye-off' size={23} color={'black'}/>}
                                    </TouchableOpacity>
                                </View> 
                                
                                {errorMessage ? <Text style={{color:COLORS.error}}>{errorMessage}</Text>: null}

                            </View>
                            <View>
                                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                                    <Text style={{color: 'white', alignSelf:'center', fontWeight:'bold'}}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems: 'center', gap: 30}}>
                                <Text style={{color: 'white'}}>OR</Text>
                                    <TouchableOpacity>
                                        <Image style={{height: 30, width: 30}} source={require('../../assets/images/googleIcon.png')}/>
                                    </TouchableOpacity>
                            </View>
                        </View> 
                        <View style={{alignItems: 'center', marginTop: 30}}>
                            <Text style={{color: 'white'}}>Already have an account? <Link href="/login" style={{color: '#636AE8FF'}}>Login</Link></Text>
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
    signUpButton:{
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