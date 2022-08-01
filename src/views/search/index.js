import * as React from 'react';
import {Text, View, TouchableOpacity, StatusBar, Image, ScrollView, RefreshControl, StyleSheet, TextInput} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextRecognition from 'react-native-text-recognition';
import { useIsFocused } from '@react-navigation/native';

import {color} from '../../constants';

function DetailsScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Details!</Text>
        </View>
    );
}

function SearchScreen({navigation}) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [grade, setGrade] = React.useState(null);
    const [lessons, setLessons] = React.useState(null);
    const [search, setSearch] = React.useState('');
    const [filterData, setFilterData] = React.useState(null);

    const isFocused = useIsFocused();

    React.useEffect(() => {
        getData();
    }, []);

    React.useEffect(() => {
        getData();
    }, [isFocused])

    const getData = async () => {
        try {
            const grade = await AsyncStorage.getItem('@slug')

            if(grade !== null) {
                setGrade(grade)

                Axios.get(`http://127.0.0.1:8000/api/lessons/grade/${grade}`)
                .then(res => {
                    setLessons(res.data);  
                    setFilterData(res.data); 
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

    const searchFilter = (text) => {
        if (text) {
            const newData = filterData.filter((item) => {
                const itemData = item.name_lesson ? item.name_lesson.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilterData(newData);
            setSearch(text);
        } else {
            setFilterData(lessons);
            setSearch(text);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar animated={true} backgroundColor = {color.primary} barStyle='light-content' />

            <View style={styles.viewTop}>
                <View style={{backgroundColor: color.primary_background, flexDirection: 'row', width: '90%', height: '70%', borderRadius: 5, alignItems: 'center'}}>
                    <Image style={{width: 20, height: 20, marginLeft: 10, marginRight: 3}} source={require('../../images/search.png')} />
                    <TextInput value={search} placeholder='Tìm kiếm...' onChangeText={(text) => searchFilter(text)} placeholderTextColor={color.primary} fontSize={15} color={color.primary} style={{width: '100%'}}></TextInput>
                </View>
            </View>

            <ScrollView style={{width: '100%'}} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={getData} colors={[color.primary]} tintColor={color.primary} />
            }>
                {/* <Text style={{color: color.primary, fontSize: 16.5, fontFamily: 'opensans_bold', marginTop: 20, marginStart: 20, marginBottom: 17}}>Danh sách bài giải</Text> */}
                
                {filterData !==null ? filterData.map((lesson) => {
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
                }) : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary_background
    },
    viewTop: {
        width: '100%', height: 70, backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center'
    }
});

const CameraStack = createNativeStackNavigator();

export default function SearchStackScreen() {
    return (
        <CameraStack.Navigator screenOptions={{headerShown: false}}>
            <CameraStack.Screen name="Cameraa" component={SearchScreen} />
            <CameraStack.Screen name="Details" component={DetailsScreen} />
        </CameraStack.Navigator>
    );
}

