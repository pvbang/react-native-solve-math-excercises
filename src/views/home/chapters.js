import * as React from 'react';
import {
    Text, View, TouchableOpacity, StatusBar, Image, ScrollView, RefreshControl, StyleSheet
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {color} from '../../constants';

export default function ChaptersScreen({navigation}) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [chapters, setChapters] = React.useState([]);
    const [nameSubject, setNameSubject] = React.useState([]);
    const [chooseGrade, setChooseGrade] = React.useState("Lớp 12");

    React.useEffect(() => {
        getChooseGrade();
    }, [])

    const getChooseGrade = async () => {
        try {
            const grade = await AsyncStorage.getItem('@grade')
            const id_subject = await AsyncStorage.getItem('@id_subject')
            const name_subject = await AsyncStorage.getItem('@name_subject')
            if(id_subject !== null && name_subject !== null) {
                setNameSubject(name_subject);
                setChooseGrade(grade);

                Axios.get(`http://127.0.0.1:8000/api/chapters/subject/${id_subject}`)
                .then(res => {
                    setChapters(res.data);
                })    
                .catch(error => console.log(error))
                .finally(() => setIsLoading(false));
            }
        } catch(e) {
            console.log(e)
        }
    }

    const storeChapter = async (id) => {
        try {
            await AsyncStorage.setItem('@id_chapter', ''+id)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary_background}}>
            <StatusBar animated={true} backgroundColor = {color.primary} barStyle='light-content' />
            <View style={{width: '100%', height: '7%', backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: '75%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ color: color.while, fontSize: 17.5, fontFamily: 'opensans_bold'}} numberOfLines={1}>{nameSubject +' '+ chooseGrade}</Text>
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
                <RefreshControl refreshing={isLoading} onRefresh={getChooseGrade} colors={[color.primary]} tintColor={color.primary} />
            }>
                <Text style={{color: color.primary, fontSize: 16.5, fontFamily: 'opensans_bold', marginTop: 20, marginStart: 20, marginBottom: 17}}>Danh sách các chương</Text>
                
                {chapters.map((chapter) => {
                    return (
                        <View key={chapter.id_chapter} style={{width: '100%', height: 95, backgroundColor: color.while, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginBottom: 2}}>
                            <TouchableOpacity 
                                style={{width: '100%', height: '100%', backgroundColor: color.while, justifyContent: 'center', flexDirection: 'row' }}
                                onPress={() => {
                                    storeChapter(chapter.id_chapter)
                                    navigation.navigate('Lessons')
                                }}
                            >
                                <View style={{width: '15%', height: '100%', justifyContent: 'center'}}>
                                    <Image style={{height: 40, width: 40}} source={require('../../images/science.png')} />
                                </View>
            
                                <View style={{width: '85%', height: '100%'}}>
                                    <View style={{width: '100%', height: '63%', justifyContent: 'center'}}>
                                        <Text style={{color: color.primary_black, fontSize: 16, fontFamily: 'opensans_bold'}}>
                                            {chapter.name_chapter}
                                        </Text>
                                    </View>
                                    <View style={{width: '100%', height: '37%', flexDirection: 'row', paddingTop: 3}}>
                                        <Image style={{width: 17, height: 17, marginRight: 6}} source={require('../../images/open-book.png')} />
                                        <Text style={{color: color.gray, fontSize: 12, fontFamily: 'opensans_medium'}}>
                                            {chapter.id_chapter+12} bài giải 
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