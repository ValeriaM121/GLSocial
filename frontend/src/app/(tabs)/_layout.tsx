import { Tabs, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import Ionicons from '@react-native-vector-icons/ionicons'

export default function RootLayout(){
    return(
        <React.Fragment>
            <StatusBar style="auto"/>
            <Tabs screenOptions={{ 
                headerShown: false,
                tabBarStyle:{
                    backgroundColor: '#1E2128FF',
                    borderTopColor:'transparent',
                    height: 60
                }
            }}>
                <Tabs.Screen name="homepage/homepage" options={{title: "", tabBarIcon: () => ( <Ionicons size={24} name="home" color="white"/>)}}/>
                <Tabs.Screen name="search/search" options={{title:"", tabBarIcon: () => (<Ionicons size={24} name="search" color="white"/>)}}/>
                <Tabs.Screen name="settings/settings" options={{title: "", tabBarIcon: () => (<Ionicons size={24} name="settings-outline" color="white"/>)}}/>  
            </Tabs>
        </React.Fragment>
    )
}