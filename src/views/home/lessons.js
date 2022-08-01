import * as React from 'react';
import {
    Text, View, TouchableOpacity, StatusBar, Image, ScrollView, 
    RefreshControl, StyleSheet
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {color} from '../../constants';

export default function LessonsScreen({navigation}) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [lessons, setLessons] = React.useState([]);
    const [nameChapter, setNameChapter] = React.useState([]);
    const [idChapter, setIdChapter] = React.useState([]);

    React.useEffect(() => {
        getChooseChapter();
    }, [])

    const getChooseChapter = async () => {
        try {
            const id = await AsyncStorage.getItem('@id_chapter')
            const value = await AsyncStorage.getItem('@name_chapter')
            if(id !== null && value !== null) {
                setIdChapter(id);
                setNameChapter(value)

                Axios.get(`http://127.0.0.1:8000/api/lessons/chapter/${id}`)
                .then(res => {
                    setLessons(res.data);
                })    
                .catch(error => console.log(error))
                .finally(() => setIsLoading(false));
            }
        } catch(e) {
            console.log(e)
        }
    }

    const storeLesson = async (id, name) => {
        try {
            await AsyncStorage.setItem('@id_lesson', ''+id)
            await AsyncStorage.setItem('@name_lesson', name)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary_background}}>
            <StatusBar animated={true} backgroundColor = {color.primary} barStyle='light-content' />
            <View style={{width: '100%', height: '7%', backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: '75%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ color: color.while, fontSize: 17.5, fontFamily: 'opensans_bold'}} numberOfLines={1}>{nameChapter}</Text>
                </View>

                <View style={{width: 35, height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', paddingStart: 24, paddingTop: 1}}>
                    <TouchableOpacity 
                        style={{width: 35, height: 35, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Image source={require('../../images/back.png')} style={{width: 17, height: 17}}/>
                    </TouchableOpacity>
                </View>
                
            </View>

            <ScrollView style={{width: '100%', height: '93%'}} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={getChooseChapter} colors={[color.primary]} tintColor={color.primary} />
            }>
                <Text style={{color: color.primary, fontSize: 16.5, fontFamily: 'opensans_bold', marginTop: 20, marginStart: 20, marginBottom: 17}}>Danh sách bài giải</Text>
                
                {lessons.map((lesson) => {
                    return (
                        <View key={lesson.id_lesson} style={{width: '100%', height: 85, backgroundColor: color.while, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginBottom: 2}}>
                            <TouchableOpacity 
                                style={{width: '100%', height: '100%', backgroundColor: color.while, justifyContent: 'center', flexDirection: 'row' }}
                                onPress={() => {
                                    storeLesson(lesson.id_lesson, lesson.name_lesson)
                                    navigation.navigate('DetailLesson')
                                }}
                            >
                                <View style={{width: '15%', height: '100%', justifyContent: 'center'}}>
                                    <Image style={{height: 40, width: 40}} source={require('../../images/studying.png')} />
                                </View>
            
                                <View style={{width: '85%', height: '100%'}}>
                                    <View style={{width: '100%', height: '100%', justifyContent: 'center'}}>
                                        <Text style={{color: color.primary_black, fontSize: 16, fontFamily: 'opensans_bold'}}>
                                            {lesson.name_lesson}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })}

            </ScrollView>
        </View>
    );
}