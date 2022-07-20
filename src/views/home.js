import * as React from 'react';
import {Text, View, TouchableOpacity, StatusBar, Image, ScrollView, ActivityIndicator, RefreshControl} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Axios from 'axios';

import {color} from '../constants';

function DetailsScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Details!??</Text>
        </View>
    );
}

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


function ModalScreen({ navigation }) {
    const [grades, setGrades] = React.useState([]);
    const [chooseGrade, setChooseGrade] = React.useState('Lớp 12');

    React.useEffect(() => {
        getGrades();
    }, [])

    const getGrades = () => {
        Axios.get(`http://127.0.0.1:8000/api/grades`)
        .then(res => {
            setGrades(res.data);
        })
        .catch(error => console.log(error));
    }

    const [gradeNames, setGradeNames] = React.useState([
        {name: 'Lớp 12', isSelected: true}, {name: 'Lớp 11', isSelected: false},
        {name: 'Lớp 10', isSelected: false}, {name: 'Lớp 9', isSelected: false},
        {name: 'Lớp 8', isSelected: false}, {name: 'Lớp 7', isSelected: false},
        {name: 'Lớp 6', isSelected: false}, {name: 'Lớp 5', isSelected: false},
        {name: 'Lớp 4', isSelected: false}, {name: 'Lớp 3', isSelected: false},
        {name: 'Lớp 2', isSelected: false},
    ])

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
                            console.log(chooseGrade)
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

    React.useEffect(() => {
        getChapters();
    }, [])

    const getChapters = () => {
        Axios.get(`http://127.0.0.1:8000/api/chapters`)
        .then(res => {
            setChapters(res.data);
        })
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false));
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
                                <Text style={{color: color.primary_black, fontSize: 15, fontFamily: 'opensans_bold', width: '90%'}}>Lớp 12</Text>
                                <Image style={{height: 15, width: 15}} source={require('../images/arrow-point-to-right.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={{width: '100%', height: '88%', marginTop: '8.3%'}} refreshControl={
                <RefreshControl efreshing={isLoading} onRefresh={getChapters} colors={[color.primary]} tintColor={color.primary} />
            }>
                <Text style={{color: color.primary, fontSize: 16.5, fontFamily: 'opensans_bold', marginTop: 20, marginStart: 20, marginBottom: 15}}>Danh sách các chương</Text>

                {isLoading ? <ActivityIndicator/> : chapters.map((item) => {
                    return (
                        <View key={item.id_chapter} style={{width: '100%', height: 95, backgroundColor: color.while, paddingStart: 20, paddingVertical: 10, paddingEnd: 20, marginBottom: 1}}>
                            <TouchableOpacity 
                                style={{width: '100%', height: '100%', backgroundColor: color.while, justifyContent: 'center', flexDirection: 'row' }}
                                onPress={() => {
                                    
                                }}
                            >
                                <View style={{width: '15%', height: '100%', justifyContent: 'center'}}>
                                    <Image style={{height: 40, width: 40}} source={require('../images/science.png')} />
                                </View>
            
                                <View style={{width: '85%', height: '100%'}}>
                                    <View style={{width: '100%', height: '63%', justifyContent: 'center'}}>
                                        <Text style={{color: color.primary_black, fontSize: 16, fontFamily: 'opensans_bold'}}>
                                            {item.name_chapter}
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
 
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{headerShown: false}}>
            <HomeStack.Group>
                <HomeStack.Screen name="Toán" component={HomeScreen} />
                <HomeStack.Screen name="Details" component={DetailsScreen} />
            </HomeStack.Group>
            <HomeStack.Group screenOptions={{ presentation: 'modal'}}>
                <HomeStack.Screen name="MyModal" component={ModalScreen} />
            </HomeStack.Group>
        </HomeStack.Navigator>
    );
}

export default HomeStackScreen;