import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackendCalls } from '@/utils/backendCalls';

export default function HomePage(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF'
        },
        container:{
            flexGrow: 1,
            justifyContent: 'flex-start',
            gap: 30,
            width: '100%',
            paddingTop: 12,
            paddingBottom: 24,
            paddingHorizontal: 20
        }
    })

    const [username, setUsername] = useState<string>("");
    const[errorMessage, setErrorMessage] = useState<string>("");

    useEffect(()=>{
        const getUsername = async() =>{
            setErrorMessage('');
            try {
                const result = await BackendCalls('userInfo/getUsername','GET');
                setUsername(result.username);
                return;
            } catch (error) {
                if(error instanceof Error){
                    setErrorMessage(error.message);
                }else{
                    console.error(`Something went wrong: ${error}`);
                    setErrorMessage(`Something failed. Please try again later.`);
                }
            }
        }
        getUsername();
    },[]);

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                <Text style={{color:"white"}}> This is the homepage.</Text>
                <Text style={{color: "blue"}}>User username is: {username}</Text>
                {errorMessage ? <Text style={{color:"red"}}>{errorMessage}</Text> : null}
            </ScrollView>
        </SafeAreaView>
    )
}