import * as React from 'react';
import {Text, View, TouchableOpacity, StatusBar, Image, ScrollView, RefreshControl, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {color} from '../../constants';

function DetailsScreen({navigation}) {
    return (
        <View style={{flex: 1}}>
            <View style={{width: '100%', height: '7%', backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: '75%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ color: color.while, fontSize: 17.5, fontFamily: 'opensans_bold'}} numberOfLines={1}>Đang cập nhật</Text>
                </View>
                <View style={{width: 35, height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start', paddingStart: 24, paddingTop: 1}}>
                    <TouchableOpacity style={{width: 35, height: 35, justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.goBack()}>
                        <Image source={require('../../images/back.png')} style={{width: 17, height: 17}}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function SettingsScreen({navigation}) {
    return (
        // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        // <Text>Settings screen</Text>
        // <Button
        //     title="Go to Details"
        //     onPress={() => navigation.navigate('Details')}
        // />
        // </View>

        <View style={styles.container}>
            <StatusBar animated={true} backgroundColor = {color.primary} barStyle='light-content' />

            <View style={styles.viewTop}>
                <TouchableOpacity style={styles.touchableRegister} onPress={() => navigation.navigate('Details')}>
                    <Text style={styles.textRegister}>Đăng ký</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchableLogin} onPress={() => navigation.navigate('Details')}>
                    <Text style={styles.textLogin}>Đăng nhập</Text>
                </TouchableOpacity>
            </View>

            <View style={{padding: 20}}>
                <TouchableOpacity style={styles.settings} onPress={() => navigation.navigate('Details')}>
                    <Image style={styles.imageSetting} source={require('../../images/24-hours.png')}/>
                    <Text style={styles.textSetting}>Đã lưu trữ</Text>
                    <Image style={{height: 15, width: 15, marginLeft: 'auto' }} source={require('../../images/arrow-point-to-right.png')} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settings} onPress={() => navigation.navigate('Details')}>
                    <Image style={styles.imageSetting} source={require('../../images/settings.png')}/>
                    <Text style={styles.textSetting}>Cài đặt</Text>
                    <Image style={{height: 15, width: 15, marginLeft: 'auto' }} source={require('../../images/arrow-point-to-right.png')} />
                </TouchableOpacity>
            </View>
            

            <ScrollView style={{width: '100%', height: '93%'}} refreshControl={
                <RefreshControl colors={[color.primary]} tintColor={color.primary} />
            }>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', backgroundColor: 'white'
    },
    viewTop: {
        width: '100%', height: '8%', backgroundColor: color.primary, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row'
    },
    touchableRegister: {
        width: '33%', height: '65%',  backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 100, borderWidth: 1, borderColor: color.while
    },
    touchableLogin: {
        width: '33%', height: '65%', backgroundColor: color.while, justifyContent: 'center', alignItems: 'center', borderRadius: 100, margin: 7
    },
    textRegister : {
        color: color.while, fontSize: 14, fontFamily: 'opensans_medium'
    },
    textLogin : {
        color: color.primary, fontSize: 14, fontFamily: 'opensans_medium'
    },
    settings : {
        flexDirection: 'row', alignItems: 'center', marginBottom: 15
    },
    imageSetting: {
        width: 35, height: 35
    },
    textSetting: {
        color: color.primary_black, fontSize: 15, fontFamily: 'opensans_bold', marginLeft: 15
    }
});

const SettingsStack = createNativeStackNavigator();

export default function SettingsStackScreen() {
    return (
        <SettingsStack.Navigator screenOptions={{headerShown: false}}>
            <SettingsStack.Screen name="Settings" component={SettingsScreen} />
            <SettingsStack.Screen name="Details" component={DetailsScreen} />
        </SettingsStack.Navigator>
    );
}

