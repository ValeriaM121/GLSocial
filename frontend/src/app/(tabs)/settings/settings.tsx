import { View, Text, StyleSheet, ScrollView } from 'react-native'
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
        }
    })

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                <Text> This is settings page</Text>
            </ScrollView>
        </SafeAreaView>
    )
}