import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { Link, router, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from "expo-secure-store";
import { RefreshToken } from "@/utils/refreshToken"

export default function quizContent(){
    const styles = StyleSheet.create({
        safeArea:{
            flex: 1,
            backgroundColor: '#1E2128FF'
        },
        container:{
            flexGrow: 1,
            justifyContent: 'flex-start',
            flexDirection: 'column',
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
        },
        showGrid:{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            rowGap: 5,
            columnGap: 15
        },
        showCard:{
            width: '30%',
            marginBottom: 5,
            gap:5,
            alignItems: 'center'
        },
        poster:{
            width:'100%',
            aspectRatio: 0.65,
            borderRadius: 12,
            backgroundColor: '#1E2128FF'
        },
        clickedPoster:{
            width:'100%',
            aspectRatio: 0.65,
            borderRadius: 12,
            borderWidth: 3,
            borderColor: '#636AE8FF',
            overflow: 'hidden'
        }
    });

    type Show ={
        id: string,
        title: string,
        originalTitle: string,
        posterURL: string | null
    }
    type onBoarding={
        active: boolean,
        id: string,
        position: number,
        show: Show,
        showId: string
    }
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const [username, setUsername] = useState<string>("");
    
    const [showData, setShowData] = useState<Show[]>([]);
    const [showList, setShowList] = useState<Show[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() =>{
        const onBoarding = async()=>{
            try {
                const token = await SecureStore.getItemAsync('token');
                const response = await fetch(`${baseURL}onBoarding/getOnBoarding`,{
                    method: "GET",
                    headers: {Authorization: `Bearer ${token}`}
                });
                const data = await response.json();
                if(response.ok){
                    const shows = data.data.map((item:onBoarding) => ({
                        id: item.show.id,
                        title: item.show.title,
                        originalTitle: item.show.originalTitle,
                        posterURL: item.show.posterURL
                    }))
                    setShowData(shows);
                    return;
                }
                if(response.status === 401){
                    const result = RefreshToken();
                    if(!result){
                        return;
                    }
                    const secondResponse = await fetch(`${baseURL}onBoarding/getOnBoarding`,{
                        method: "GET",
                        headers: {Authorization: `Bearer ${token}`}
                    })

                    const secondData = await secondResponse.json();
                    if(secondResponse.ok){
                        const secondShow = secondData.data.map((item:onBoarding) =>({
                            id: item.show.id,
                            title: item.show.title,
                            originalTitle: item.show.originalTitle,
                            posterURL: item.show.posterURL
                        }))
                        setShowData(secondShow);
                        return;
                    }else{
                        console.error(`Failed to refresh`);
                        return;
                    }
                }
                console.error(`Failed to get onboarding information. From database`);

            } catch (error) {
                console.error(`Failed to onBoard: ${error}`);
            }   
        }
        onBoarding()
    },[]);

    const handleClickingShow = (show:Show) =>{
        const exists = showList.find(series => series.id === show.id);
        if(exists){
            setShowList(prev => prev.filter(s => s.id !== show.id));
        }else{
            setShowList(prev => [...prev, show]);
        }
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                    <Text style={{color:"white", fontSize:28, fontWeight: 'bold'}}> May you please choose show you are already watching?</Text>
                    {errorMessage ? <Text style={{color:"red"}}>{errorMessage} </Text> : null}
                    <View style={styles.showGrid}>
                    {showData.map((item, index) => {
                        const posterUri = item.posterURL
                            ? `https://image.tmdb.org/t/p/w500${item.posterURL}`
                            : null;
                        const findShow = showList.find(series => series.id === item.id);
                        return (
                            <View key={item.id} style={styles.showCard}>
                                {findShow ? (
                                    posterUri ? (
                                        <TouchableOpacity onPress={()=> handleClickingShow(item)}>
                                            <Image source={{ uri: posterUri }} style={styles.clickedPoster} />
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <View style={[styles.clickedPoster, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={{ color: '#FFFFFF80' }}>No image</Text>
                                        </View>
                                    )
                                )
                                :
                                    posterUri ? (
                                        <TouchableOpacity onPress={()=> handleClickingShow(item)}>
                                            <Image source={{ uri: posterUri }} style={styles.poster} />
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <View style={[styles.poster, { justifyContent: 'center', alignItems: 'center' }]}>
                                            <Text style={{ color: '#FFFFFF80' }}>No image</Text>
                                        </View>
                                    )

                                }
                                    <Text style={{color:"white"}}>
                                        {item.title}
                                    </Text>
                            </View>
                                
                            
                        )
                    })}
                    </View>
                    <View>
                        {showList.map((item)=>{
                            return(
                                <View key={item.id}>
                                    <Text style={{color:"white"}}>
                                        {item.title}
                                    </Text>
                                </View>
                            )
                        })}

                    </View>
                    
                    <Link href="/(tabs)/homepage/homepage" push asChild>
                        <TouchableOpacity style={styles.nextButton}>
                            <Text style={{color:"white"}}> next</Text>
                        </TouchableOpacity>
                    </Link>                
            </ScrollView>
        </SafeAreaView>
    )
}