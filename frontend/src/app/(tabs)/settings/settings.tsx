import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { Link, router, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from "expo-secure-store"

export default function quizContent(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF'
        },
        container:{
            flexGrow: 1,
            justifyContent: 'space-between',
            gap: 30,
            width: '100%',
            paddingTop: 12,
            paddingBottom: 24,
            paddingHorizontal: 20
        }
    });
    const [token, setToken] = useState<String>("");
    
    useEffect(()=>{
        const loadToken = async() => {
            const getToken = await SecureStore.getItemAsync('token');
            if(getToken){
                setToken(getToken);
            }
        };
        loadToken();
    },[]);

    useEffect(()=>{
        
    })

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                <Text> This is settings page</Text>
            </ScrollView>
        </SafeAreaView>
    )
}