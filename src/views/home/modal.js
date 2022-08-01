import * as React from 'react';
import {
    Text, View, TouchableOpacity, StatusBar, Image, ScrollView, StyleSheet
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {color} from '../../constants';

function GradeButton(props) {
    const {title, onPress, isSelected} = props;
    return (
        <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: 57, marginTop: 10, marginBottom: 10}}>
            <TouchableOpacity style={{backgroundColor: isSelected == true ? color.primary : color.while, width: '90%', height: '100%', borderRadius: 10, borderWidth: 1, flexDirection: 'row', borderColor: isSelected == true ? color.while : color.primary}} onPress={onPress}>
                <View style={{width: '18%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={isSelected == true ? require('../../images/check_white.png') : require('../../images/check.png')} style={{width: 28, height: 28}}/>
                </View>
                <View style={{width: '82%', height: '100%', left: -3, top: -1, justifyContent: 'center'}}>
                    <Text style={{ color: isSelected == true ? color.while : color.primary, fontSize: 16.5, fontFamily: 'opensans_bold'}}>{title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default function ModalScreen({ navigation }) {
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
                        <Image source={require('../../images/close.png')} style={{width: '100%', height: '100%'}}/>
                    </TouchableOpacity>
                </View>
                
                <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: 55, marginBottom: 10}}>
                    <View style={{backgroundColor: color.white_primary, width: '90%', height: '100%', borderRadius: 10, flexDirection: 'row'}}>
                        <View style={{width: '18%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={require('../../images/light-bulb.png')} style={{width: 28, height: 28}}/>
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