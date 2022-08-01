import * as React from 'react';
import {
    Text, View, TouchableOpacity, StatusBar, Image, ScrollView, 
    ActivityIndicator, RefreshControl, useWindowDimensions, StyleSheet, Modal
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateGrade } from '../../redux/actions/update';

import {color} from '../../constants';
import ChaptersScreen from './chapters'
import LessonsScreen from './lessons'
import DetailLessonScreen from './detail'
import ModalScreen from './modal'

function HomeScreen({navigation}) {
    const [subjects, setSubjects] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    // const info = useSelector((state) => state.personalInfo)
    const [chooseGrade, setChooseGrade] = React.useState("Lớp 12");
    const [chooseSlugGrade, setSlugChooseGrade] = React.useState("lop-12");
    const isFocused = useIsFocused();

    const getChooseGrade = async () => {
        try {
            const value = await AsyncStorage.getItem('@grade')
            const slug = await AsyncStorage.getItem('@slug')
            if(value !== null && slug !== null) {
                setChooseGrade(value);
                setSlugChooseGrade(slug);

                Axios.get(`http://127.0.0.1:8000/api/subjects/grade/${slug}`)
                .then(res => {
                    setSubjects(res.data);
                })    
                .catch(error => console.log(error))
                .finally(() => setIsLoading(false));
            }
        } catch(e) {
            console.log(e)
        }
    }

    React.useEffect(() => {
        getChooseGrade();
    }, [])

    React.useEffect(() => {
        getChooseGrade();
    }, [isFocused])

    const storeSubject = async (value, id) => {
        try {
            await AsyncStorage.setItem('@name_subject', value)
            await AsyncStorage.setItem('@id_subject', ''+id)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: color.primary_background}}>
            <StatusBar animated={true} backgroundColor = {color.primary} barStyle='light-content' />
            
            <View style={{width: '100%', height: '12.2%', backgroundColor: color.primary, alignItems: 'center'}}>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ color: 'white', fontSize: 27, fontFamily: 'bangers'}}>GIẢI BÀI TẬP TOÁN </Text>
                </View>
            
                <View style={{height: '70%', width: '90%', backgroundColor: 'white', borderRadius:15, position: 'absolute', bottom: '-35%', flexDirection: 'row'}}>
                    <View style={{height: '100%', width: '23%', justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{height: '60%', width: '60%'}} source={require('../../images/graduation-hat.png')} />
                    </View>
                    <View style={{height: '100%', width: "2%", justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{height: '65%', width: 1.5, backgroundColor: color.white_gray, borderRadius: 2}}></View>
                    </View>
                    <View style={{height: '100%', width: "75%", justifyContent: 'center', alignItems: 'center', padding: 10}}>
                        <View style={{height: '50%', width: '100%'}}>
                            <Text style={{color: color.primary_black, fontSize: 13, fontFamily: 'opensans_medium'}}>
                                Giải bài tập lớp
                            </Text>
                        </View>
                        <View style={{height: '50%', width: '100%'}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                onPress={() => navigation.navigate('MyModal')}
                            >
                                <Text style={{color: color.primary_black, fontSize: 15, fontFamily: 'opensans_bold', width: '90%'}}>{chooseGrade}</Text>
                                <Image style={{height: 15, width: 15}} source={require('../../images/arrow-point-to-right.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={{width: '100%', height: '88%', marginTop: '8.3%'}} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={getChooseGrade} colors={[color.primary]} tintColor={color.primary} />
            }>
                <Text style={{color: color.primary, fontSize: 16.5, fontFamily: 'opensans_bold', marginTop: 20, marginStart: 20, marginBottom: 15}}>Chọn loại sách</Text>

                {subjects.map((subject) => {
                    return (
                        <View key={subject.id_subject} style={{width: '100%', height: 95, backgroundColor: color.while, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginBottom: 2}}>
                            <TouchableOpacity 
                                style={{width: '100%', height: '100%', backgroundColor: color.while, justifyContent: 'center', flexDirection: 'row' }}
                                onPress={() => {
                                    storeSubject(subject.name_subject, subject.id_subject)
                                    navigation.navigate('Chapters')
                                }}
                            >
                                
                                <View style={{width: '15%', height: '100%', justifyContent: 'center'}}>
                                    <Image style={{height: 40, width: 40}} source={require('../../images/student.png')} />
                                </View>
            
                                <View style={{width: '85%', height: '100%'}}>
                                    <View style={{width: '100%', height: '63%', justifyContent: 'center'}}>
                                        <Text style={{color: color.primary_black, fontSize: 16, fontFamily: 'opensans_bold'}}>
                                            {subject.name_subject}
                                        </Text>
                                    </View>
                                    <View style={{width: '100%', height: '37%', flexDirection: 'row', paddingTop: 3}}>
                                        <Image style={{width: 17, height: 17, marginRight: 6}} source={require('../../images/open-book.png')} />
                                        <Text style={{color: color.gray, fontSize: 12, fontFamily: 'opensans_medium'}}>
                                            {subject.id_subject+23} bài giải
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
 
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
            <HomeStack.Group>
                <HomeStack.Screen name="Toán" component={HomeScreen} />
            </HomeStack.Group>
            <HomeStack.Group screenOptions={{ presentation: 'modal'}}>
                <HomeStack.Screen name="MyModal" component={ModalScreen} />
                <HomeStack.Screen name="Chapters" component={ChaptersScreen} />
                <HomeStack.Screen name="Lessons" component={LessonsScreen} />
                <HomeStack.Screen name="DetailLesson" component={DetailLessonScreen} />
            </HomeStack.Group>
        </HomeStack.Navigator>
    );
}

export default HomeStackScreen;