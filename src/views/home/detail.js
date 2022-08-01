import * as React from 'react';
import {
    Text, View, TouchableOpacity, StatusBar, Image, ScrollView, 
    RefreshControl, useWindowDimensions, StyleSheet
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml from 'react-native-render-html';

import {color} from '../../constants';

const tagsStyles = {
    article: {
        color: color.primary_black, fontSize: 15, fontFamily: 'opensans_medium'
    }
};

export default function DetailLessonScreen({navigation}) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [lesson, setLesson] = React.useState([]);
    const [nameLesson, setNameLesson] = React.useState([]);
    const [idLesson, setIdLesson] = React.useState([]);
    const { width } = useWindowDimensions();

    React.useEffect(() => {
        getChooseLesson();
    }, [])

    const getChooseLesson = async () => {
        try {
            const id = await AsyncStorage.getItem('@id_lesson')
            const name = await AsyncStorage.getItem('@name_lesson')
            if(id !== null && name !== null) {
                setIdLesson(id);
                setNameLesson(name);

                Axios.get(`http://127.0.0.1:8000/api/lesson/${id}`)
                .then(res => {
                    setLesson(res.data);
                })    
                .catch(error => console.log(error))
                .finally(() => setIsLoading(false));
            }
        } catch(e) {
            console.log(e)
        }
    }
    
    const source = {
        html: lesson.content !== undefined ? `<article>${lesson.content}</article>` : ``
    };

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
            <StatusBar animated={true} backgroundColor = {color.primary} barStyle='light-content' />
            <View style={{width: '100%', height: '7%', backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: '75%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ color: color.while, fontSize: 17.5, fontFamily: 'opensans_bold'}} numberOfLines={1}>{nameLesson}</Text>
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
                <RefreshControl refreshing={isLoading} onRefresh={getChooseLesson} colors={[color.primary]} tintColor={color.primary} />
            }>
                <View key={lesson.id_lesson} style={{width: '100%', height: '100%', backgroundColor: color.white, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginTop: 1}}>
                    <RenderHtml contentWidth={width} source={source} tagsStyles={tagsStyles}/>
                </View>
            </ScrollView>
        </View>
    );
}