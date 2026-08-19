import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
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
            gap: 20,
            width: '100%',
            paddingBottom: 24,
            paddingHorizontal: 20
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
    })
    type Show ={
        id: string,
        tmdbId: number | null,
        title: string,
        originalTitle: string,
        overview: string | null,
        relaseYear: Int16Array,
        genres: string[],
        seasons: number | null,
        episodes: number | null,
        posterURL: string | null,
        createdBy: string,
        createdAt: Date
    }

    const [username, setUsername] = useState<string>("");
    const [watchList, setWatchList] = useState<Show[]>([]);
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

        const getWatchlist = async() =>{
            setErrorMessage('');
            try {
                const result = await BackendCalls('watchListShow/watchListShow','GET');
                const shows = result.watchList.map((item:any)=>({
                    id: item.show.id,
                    title:item.show.title,
                    originalTitle: item.show.originalTitle,
                    posterURL: item.show.posterURL
                }))
                setWatchList(shows);

                return;
            } catch (error) {
                if(error instanceof Error){
                    setErrorMessage(error.message);
                }else{
                    console.error(`Failed calling to backend: ${error}`);
                    setErrorMessage(`Failed to call backend. Please try again later`);
                }
            }
        }

        getUsername();
        getWatchlist();
    },[]);

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle = {styles.container}>
                <View style={{alignItems: 'center'}}>
                     <Text style={{color:"white", fontWeight:'bold', fontSize: 32, fontStyle:'italic'}}> GLSocial</Text>
                </View>
                <View style={{gap: 5}}>
                    <Text style={{color:"white", fontWeight:'bold',fontSize: 16}}>Watchlist</Text>
                    <View style={{flexDirection:'row', justifyContent:'flex-start', rowGap: 5, columnGap:15}}> 
                        {watchList.map((item) => {
                            const posterUri = item.posterURL ? `https://image.tmdb.org/t/p/w500${item.posterURL}` : null;
                            return(
                                <View key={item.id} style={styles.showCard}>
                                    {posterUri ? (
                                        <TouchableOpacity>
                                            <Image source={{ uri: posterUri }} style={styles.poster} alt={item.title}/>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <TouchableOpacity>
                                            <View style={[styles.poster, { justifyContent: 'center', alignItems:'center'}]}>
                                                <Text style={{color: '#FFFFFF80'}}>No Image</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                      <Text style={{color:'white'}}>{item.title}</Text>
                                </View>
                                
                            )
                              
                        })}
                      

                    </View>
                    
                </View>
                <Text style={{color: "blue"}}>User username is: {username}</Text>
                {errorMessage ? <Text style={{color:"red"}}>{errorMessage}</Text> : null}
            </ScrollView>
        </SafeAreaView>
    )
}