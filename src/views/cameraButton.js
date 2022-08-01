import * as React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity, Animated} from 'react-native'

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { useNavigation } from '@react-navigation/native';

function CameraScreen() {
    const [image, setImage] = React.useState(null);
    const navigation = useNavigation();

    React.useEffect(() => { 
        (async() => {
            if(image) {
                const result = await TextRecognition.recognize(image.assets[0].uri);
                // console.log(image)
                console.log(image.assets[0].uri)
                console.log(result)
                navigation.navigate("Tìm kiếm")
            }
        })();
    }, [image]);

    return (
        <View>
            <TouchableOpacity onPress={() => launchCamera({saveToPhotos: true}, setImage)}>
                <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 100, backgroundColor: 'white'}}>
                    <Image style={{height: 33, width: 33}} source={require('../images/camera.png')}/>
                </View>
            </TouchableOpacity>
        </View>
        
    );
}

function LibraryScreen() {
    const [image, setImage] = React.useState(null);
    const navigation = useNavigation();

    React.useEffect(() => { 
        (async() => {
            if(image) {
                const result = await TextRecognition.recognize(image.assets[0].uri);
                console.log(result)
                navigation.navigate("Tìm kiếm")
            }
        })();
    }, [image]);

    return (
        <View>
            <TouchableOpacity onPress={() => launchImageLibrary({}, setImage)}>
                <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 100, backgroundColor: 'white'}}>
                    <Image style={{height: 33, width: 33}} source={require('../images/gallery.png')}/>
                </View>
            </TouchableOpacity>
        </View>
        
    );
}


function WriteScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate("Tìm kiếm")}>
                <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 100, backgroundColor: 'white'}}>
                    <Image style={{height: 32, width: 32}} source={require('../images/pen.png')}/>
                </View>
            </TouchableOpacity>
        </View>
        
    );
}


export default class CameraButton extends React.Component {
    buttonSize = new Animated.Value(1)
    mode = new Animated.Value(0)

    handlePress = () => {
        Animated.sequence([
            Animated.timing(this.buttonSize, {
                toValue: 0.95,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(this.buttonSize, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(this.mode, {
                toValue: this.mode._value === 0 ? 1 : 0,
                useNativeDriver: false 
            }),
        ]).start();
    }

    render() {
        const rotation = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"]
        })

        const cameraX = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -65]
        })

        const cameraY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50]
        })

        const libraryX = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0]
        })

        const libraryY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -80]
        })

        const penX = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 65]
        })

        const penY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50]
        })

        return (
            <View style={{position: 'absolute',alignItems: 'center', justifyContent: 'center',}}>
                <Animated.View style={{position: 'absolute', left: cameraX, top: cameraY}}>
                    <CameraScreen />
                </Animated.View>

                <Animated.View style={{position: 'absolute', left: libraryX, top: libraryY}}>
                    <LibraryScreen />
                </Animated.View>

                <Animated.View style={{position: 'absolute', left: penX, top: penY}}>
                    <WriteScreen/>
                </Animated.View>

                <Animated.View style={{ transform: [{scale: this.buttonSize}], backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', bottom: 8, borderRadius: 100, width: '150%', height: 80}}>
                    <TouchableOpacity onPress={this.handlePress}>
                        <Animated.View style={{ transform: [{rotate: rotation}] }}>
                            <Image style={{height: 50, width: 50}} source={require('../images/camera.png')}/>
                        </Animated.View>
                        <Text style={{color: '#16B5EA', fontSize: 11, fontFamily: 'opensans_medium'}}>Tìm kiếm</Text>
                    </TouchableOpacity>
                </Animated.View>
                
            </View>
        )
    }
}