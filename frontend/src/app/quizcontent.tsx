import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Link, router, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

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
        },
        nextButton:{
            backgroundColor: '#636AE8FF',
            borderRadius: 25,
            height: 45,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%'
        }
    })

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                <Text> This is user quiz page!</Text>
                <Link href="/(tabs)/homepage/homepage" push asChild>
                    <TouchableOpacity style={styles.nextButton}>
                        <Text style={{color:"white"}}> next</Text>
                    </TouchableOpacity>
                </Link>
                
            </ScrollView>
        </SafeAreaView>
    )
}