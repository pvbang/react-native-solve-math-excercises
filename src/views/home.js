import * as React from 'react';
import {
    Text, View, TouchableOpacity, StatusBar, Image, ScrollView, 
    ActivityIndicator, RefreshControl, useWindowDimensions, StyleSheet
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml from 'react-native-render-html';

import { useDispatch, useSelector } from 'react-redux';
import { updateGrade } from '../redux/actions/update';

import {color} from '../constants';
import { useIsFocused } from '@react-navigation/native';

function GradeButton(props) {
    const {title, onPress, isSelected} = props;
    return (
        <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: 57, marginTop: 10, marginBottom: 10}}>
            <TouchableOpacity style={{backgroundColor: isSelected == true ? color.primary : color.while, width: '90%', height: '100%', borderRadius: 10, borderWidth: 1, flexDirection: 'row', borderColor: isSelected == true ? color.while : color.primary}} onPress={onPress}>
                <View style={{width: '18%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={isSelected == true ? require('../images/check_white.png') : require('../images/check.png')} style={{width: 28, height: 28}}/>
                </View>
                <View style={{width: '82%', height: '100%', left: -3, top: -1, justifyContent: 'center'}}>
                    <Text style={{ color: isSelected == true ? color.while : color.primary, fontSize: 16.5, fontFamily: 'opensans_bold'}}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}


function SubjectsScreen({navigation}) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [chooseSlugGrade, setSlugChooseGrade] = React.useState("lop-12");
    const [subjects, setSubjects] = React.useState([]);
    const [nameChapter, setNameChapter] = React.useState([]);

    React.useEffect(() => {
        getChooseGrade();
        getNameChapter()
    }, [])

    const getChooseGrade = async () => {
        try {
            const slug = await AsyncStorage.getItem('@slug')
            if(slug !== null) {
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

    const getNameChapter = async () => {
        try {
            const value = await AsyncStorage.getItem('@name_chapter')
            if(value !== null) {
                setNameChapter(value)
            }
        } catch(e) {
            console.log(e)
        }
    }
    
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {/* <StatusBar animated={true} backgroundColor= 'white' barStyle='dark-content' /> */}
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
                        <Image source={require('../images/back.png')} style={{width: 17, height: 17}}/>
                    </TouchableOpacity>
                </View>
                
            </View>

            <ScrollView style={{width: '100%', height: '93%'}} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={getChooseGrade} colors={[color.primary]} tintColor={color.primary} />
            }>
                <Text style={{color: color.primary, fontSize: 16.5, fontFamily: 'opensans_bold', marginTop: 20, marginStart: 20, marginBottom: 15}}>Chọn loại sách</Text>
                
                {subjects.map((subject) => {
                    return (
                        <View key={subject.id_subject} style={{width: '100%', height: 95, backgroundColor: color.while, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginBottom: 1}}>
                            <TouchableOpacity 
                                style={{width: '100%', height: '100%', backgroundColor: color.while, justifyContent: 'center', flexDirection: 'row' }}
                                onPress={() => {
                                    navigation.navigate('Lessons')
                                }}
                            >
                                <View style={{width: '15%', height: '100%', justifyContent: 'center'}}>
                                    <Image style={{height: 40, width: 40}} source={require('../images/science.png')} />
                                </View>
            
                                <View style={{width: '85%', height: '100%'}}>
                                    <View style={{width: '100%', height: '63%', justifyContent: 'center'}}>
                                        <Text style={{color: color.primary_black, fontSize: 16, fontFamily: 'opensans_bold'}}>
                                            {subject.name_subject}
                                        </Text>
                                    </View>
                                    <View style={{width: '100%', height: '37%', flexDirection: 'row', paddingTop: 3}}>
                                        <Image style={{width: 17, height: 17, marginRight: 6}} source={require('../images/open-book.png')} />
                                        <Text style={{color: color.gray, fontSize: 12, fontFamily: 'opensans_medium'}}>
                                            7 bài giải
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


function LessonsScreen({navigation}) {
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                        <Image source={require('../images/back.png')} style={{width: 17, height: 17}}/>
                    </TouchableOpacity>
                </View>
                
            </View>

            <ScrollView style={{width: '100%', height: '93%'}} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={getChooseChapter} colors={[color.primary]} tintColor={color.primary} />
            }>
                <Text style={{color: color.primary, fontSize: 16.5, fontFamily: 'opensans_bold', marginTop: 20, marginStart: 20, marginBottom: 15}}>Danh sách bài giải</Text>
                
                {lessons.map((lesson) => {
                    return (
                        <View key={lesson.id_lesson} style={{width: '100%', height: 95, backgroundColor: color.while, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginBottom: 1}}>
                            <TouchableOpacity 
                                style={{width: '100%', height: '100%', backgroundColor: color.while, justifyContent: 'center', flexDirection: 'row' }}
                                onPress={() => {
                                    storeLesson(lesson.id_lesson, lesson.name_lesson)
                                    navigation.navigate('DetailLesson')
                                }}
                            >
                                <View style={{width: '15%', height: '100%', justifyContent: 'center'}}>
                                    <Image style={{height: 40, width: 40}} source={require('../images/science.png')} />
                                </View>
            
                                <View style={{width: '85%', height: '100%'}}>
                                    <View style={{width: '100%', height: '63%', justifyContent: 'center'}}>
                                        <Text style={{color: color.primary_black, fontSize: 16, fontFamily: 'opensans_bold'}}>
                                            {lesson.name_lesson}
                                        </Text>
                                    </View>
                                    <View style={{width: '100%', height: '37%', flexDirection: 'row', paddingTop: 3}}>
                                        <Image style={{width: 17, height: 17, marginRight: 6}} source={require('../images/open-book.png')} />
                                        <Text style={{color: color.gray, fontSize: 12, fontFamily: 'opensans_medium'}}>
                                            7 bài giải
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

const tagsStyles = {
    article: {
        color: color.primary_black, fontSize: 15, fontFamily: 'opensans_medium'
    }
};

function DetailLessonScreen({navigation}) {
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
                        <Image source={require('../images/back.png')} style={{width: 17, height: 17}}/>
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


function ModalScreen({ navigation }) {
    // const info = useSelector((state) => state.personalInfo)
    // const dispatch = useDispatch();
    const [gradesDESC, setGradesDESC] = React.useState([]);

    const [choose, setChoose] = React.useState();
    const getChooseGrade = async () => {
        try {
            const value = await AsyncStorage.getItem('@grade')
            if(value !== null) {
                setChoose(value);
            }
        } catch(e) {
            console.log(e)
        }
    }

    const [chooseGrade, setChooseGrade] = React.useState("Lớp 12");
    const [slugChooseGrade, setSlugChooseGrade] = React.useState("lop-12");

    const storeGrade = async (value, slug) => {
        try {
            await AsyncStorage.setItem('@grade', value)
            await AsyncStorage.setItem('@slug', slug)
        } catch (e) {
            console.log(e)
        }
    }

    React.useEffect(() => {
        getGradesDESC();
        getChooseGrade();
    }, [])

    const truefalse = (gradeee) => {
        if(gradeee === choose) {
            return true
        } else {
            return false
        }
    }

    const getGradesDESC = () => {
        Axios.get(`http://127.0.0.1:8000/api/gradesDESC`)
        .then(res => {
            setGradesDESC(res.data);
        })
        .catch(error => console.log(error));
    }

    const [gradeNames, setGradeNames] = React.useState([])
    
    {gradesDESC.map(grade => {
        const found = gradeNames.find(obj => {
            return obj.name === grade.name_grade;
        });
        
        if(found === undefined) {
            gradeNames.push({
                name: grade.name_grade, isSelected: truefalse(grade.name_grade), slug: grade.slug
            },)
        } else {
            return gradesDESC;
        }
    })}

    return (
        <View style={{ flex: 1, backgroundColor: 'white'}}>
            <StatusBar animated={true} backgroundColor= 'white' barStyle='dark-content' />

            <View style={{width: '100%', height: '90%'}}>
                <View style={{width: '100%', height: 60, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ color: color.primary_black, fontSize: 18, fontFamily: 'opensans_bold'}}>Bạn đang học lớp mấy?</Text>
                </View>

                <View style={{width: 35, height: 60, position: 'absolute', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', paddingEnd: 29, paddingTop: 4}}>
                    <TouchableOpacity 
                        style={{width: 35, height: 35, borderRadius:100}}
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Image source={require('../images/close.png')} style={{width: '100%', height: '100%'}}/>
                    </TouchableOpacity>
                </View>
                
                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: 55, marginBottom: 10}}>
                    <View style={{backgroundColor: color.white_primary, width: '90%', height: '100%', borderRadius: 10, flexDirection: 'row'}}>
                        <View style={{width: '18%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={require('../images/light-bulb.png')} style={{width: 28, height: 28}}/>
                        </View>
                        <View style={{width: '82%', height: '100%', alignItems: 'center', left: -7, justifyContent: 'center'}}>
                            <Text style={{ color: color.primary_black, fontSize: 12, fontFamily: 'opensans_medium'}}>Chọn đúng lớp bạn cần giải bài tập nhé. Chọn lớp nào chỉ giải được bài lớp đó thôi!</Text>
                        </View>
                    </View>
                </View>

                <ScrollView>
                    {gradeNames.map(gradeName => 
                        <GradeButton key={gradeName.name} title={gradeName.name} isSelected={gradeName.isSelected} onPress={() => {
                            let newGradeNames = gradeNames.map(eachGradeName => {
                                if (eachGradeName.name == gradeName.name) {
                                    setChooseGrade(gradeName.name)
                                    setSlugChooseGrade(gradeName.slug)
                                    return {...eachGradeName, isSelected: true}
                                } else {
                                    return {...eachGradeName, isSelected: false}
                                }
                            })
                            setGradeNames(newGradeNames)
                        }} />
                    )}
                </ScrollView>

            </View>
            
            <View style={{width: '100%', height: '10%', flexDirection: 'row'}}>
                <View style={{width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={{width: "85%", height: '60%', borderRadius:100, backgroundColor: color.white, justifyContent:'center', alignItems:'center', borderWidth: 1, borderColor: color.primary}}
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <Text style={{color: color.primary, fontSize: 15, fontFamily: 'opensans_medium'}}>Hủy</Text>
                    </TouchableOpacity>
                </View>

                <View style={{width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style={{width: "85%", height: '60%', borderRadius:100, backgroundColor: color.primary, justifyContent:'center', alignItems:'center'}}
                        onPress={() => {
                            // dispatch(updateGrade(chooseGrade));
                            storeGrade(chooseGrade, slugChooseGrade);
                            navigation.goBack();
                        }}
                    >
                        <Text style={{color:'white', fontSize: 15, fontFamily: 'opensans_medium'}}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


function HomeScreen({navigation}) {
    const [chapters, setChapters] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    // const info = useSelector((state) => state.personalInfo)
    const [chooseGrade, setChooseGrade] = React.useState("Lớp 12");
    const [chooseSlugGrade, setSlugChooseGrade] = React.useState("lop-12");
    const [counts, setCounts] = React.useState([]);
    const isFocused = useIsFocused();

    const getChooseGrade = async () => {
        try {
            const value = await AsyncStorage.getItem('@grade')
            const slug = await AsyncStorage.getItem('@slug')
            if(value !== null && slug !== null) {
                setChooseGrade(value);
                setSlugChooseGrade(slug);

                Axios.get(`http://127.0.0.1:8000/api/chapters/grade/${slug}`)
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

    React.useEffect(() => {
        getChooseGrade();
    }, [])

    React.useEffect(() => {
        getChooseGrade();
    }, [isFocused])

    const getChapters = () => {
        Axios.get(`http://127.0.0.1:8000/api/chapters/grade/${chooseSlugGrade}`)
        .then(res => {
            setChapters(res.data);
        })    
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false));
    }

    const storeChapter = async (value, id) => {
        try {
            await AsyncStorage.setItem('@name_chapter', value)
            await AsyncStorage.setItem('@id_chapter', ''+id)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={{flex: 1}}>
            <StatusBar animated={true} backgroundColor = {color.primary} barStyle='light-content' />
            
            <View style={{width: '100%', height: '12.2%', backgroundColor: color.primary, alignItems: 'center'}}>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ color: 'white', fontSize: 27, fontFamily: 'bangers'}}>GIẢI BÀI TẬP TOÁN </Text>
                </View>
            
                <View style={{height: '70%', width: '90%', backgroundColor: 'white', borderRadius:15, position: 'absolute', bottom: '-35%', flexDirection: 'row'}}>
                    <View style={{height: '100%', width: '23%', justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{height: '60%', width: '60%'}} source={require('../images/graduation-hat.png')} />
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
                                <Image style={{height: 15, width: 15}} source={require('../images/arrow-point-to-right.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={{width: '100%', height: '88%', marginTop: '8.3%'}} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={getChapters} colors={[color.primary]} tintColor={color.primary} />
            }>
                <Text style={{color: color.primary, fontSize: 16.5, fontFamily: 'opensans_bold', marginTop: 20, marginStart: 20, marginBottom: 15}}>Danh sách các chương</Text>

                {chapters.length === undefined ? ( 
                    <View key={chapters.id_chapter} style={{width: '100%', height: 95, backgroundColor: color.while, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginBottom: 1}}>
                    <TouchableOpacity 
                        style={{width: '100%', height: '100%', backgroundColor: color.while, justifyContent: 'center', flexDirection: 'row' }}
                        onPress={() => {
                            navigation.navigate('Subjects')
                        }}
                    >
                        <View style={{width: '15%', height: '100%', justifyContent: 'center'}}>
                            <Image style={{height: 40, width: 40}} source={require('../images/science.png')} />
                        </View>
    
                        <View style={{width: '85%', height: '100%'}}>
                            <View style={{width: '100%', height: '63%', justifyContent: 'center'}}>
                                <Text style={{color: color.primary_black, fontSize: 16, fontFamily: 'opensans_bold'}}>
                                    {chapters.name_chapter}
                                </Text>
                            </View>
                            <View style={{width: '100%', height: '37%', flexDirection: 'row', paddingTop: 3}}>
                                <Image style={{width: 17, height: 17, marginRight: 6}} source={require('../images/open-book.png')} />
                                <Text style={{color: color.gray, fontSize: 12, fontFamily: 'opensans_medium'}}>
                                    {chapters.id_chapter} bài giải
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View> 
                ) : (
                    chapters.map((chapter) => {
                        return (
                            <View key={chapter.id_chapter} style={{width: '100%', height: 95, backgroundColor: color.while, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginBottom: 1}}>
                                <TouchableOpacity 
                                    style={{width: '100%', height: '100%', backgroundColor: color.while, justifyContent: 'center', flexDirection: 'row' }}
                                    onPress={() => {
                                        storeChapter(chapter.name_chapter, chapter.id_chapter)
                                        navigation.navigate('Subjects')
                                    }}
                                >
                                    
                                    <View style={{width: '15%', height: '100%', justifyContent: 'center'}}>
                                        <Image style={{height: 40, width: 40}} source={require('../images/science.png')} />
                                    </View>
                
                                    <View style={{width: '85%', height: '100%'}}>
                                        <View style={{width: '100%', height: '63%', justifyContent: 'center'}}>
                                            <Text style={{color: color.primary_black, fontSize: 16, fontFamily: 'opensans_bold'}}>
                                                {chapter.name_chapter}
                                            </Text>
                                        </View>
                                        <View style={{width: '100%', height: '37%', flexDirection: 'row', paddingTop: 3}}>
                                            <Image style={{width: 17, height: 17, marginRight: 6}} source={require('../images/open-book.png')} />
                                            <Text style={{color: color.gray, fontSize: 12, fontFamily: 'opensans_medium'}}>
                                                {chapter.id_chapter} bài giải
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    } 
                ))}

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
                <HomeStack.Screen name="Subjects" component={SubjectsScreen} />
                <HomeStack.Screen name="Lessons" component={LessonsScreen} />
                <HomeStack.Screen name="DetailLesson" component={DetailLessonScreen} />
            </HomeStack.Group>
        </HomeStack.Navigator>
    );
}

export default HomeStackScreen;