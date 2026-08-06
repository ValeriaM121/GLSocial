import { View, Text, StyleSheet, ScrollView, Touchable, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { Link, router, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from "expo-secure-store"
import { Logout} from "@/utils/logout"

export default function Setting(){
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
        },
        logoutButton: {
            backgroundColor: '#636AE8FF',
            borderRadius: 25,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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

    const handleLogout = async() =>{
        Logout();
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                <Text> This is settings page</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={{color:"white"}}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}