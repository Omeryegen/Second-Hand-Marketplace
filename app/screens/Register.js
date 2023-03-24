import {  useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase';
import { Context } from '../../Context';
import { StyleSheet, View, TextInput, SafeAreaView,StatusBar, Pressable, Image,Text } from 'react-native';
import {  createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link, useIsFocused } from '@react-navigation/native';
import AnimatedLoader from "react-native-animated-loader";
export default function WelcomeScreen({navigation}) {
    const{changeRotation} = useContext(Context)
    const[uploading, setUploading] = useState(false)
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[userName, setUserName] = useState("");
    const handleRegister = () =>{
        setUploading(true)
        createUserWithEmailAndPassword(auth, email, password)
        .then(res => changeRotation('Homepage'))
            .then(res => {
                updateProfile(auth.currentUser, {displayName: userName, photoURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'})
                .then(res => {
                    changeRotation('Homepage')
                    navigation.replace('Homepage')
                    setUploading(false)
                })
                .catch(err => setUploading(false))
            })
            .catch(err => setUploading(false))
    }
    useEffect(()=>{
        if(auth.currentUser){
          navigation.replace('Homepage')
        }
      }, [useIsFocused()])
   
    return (
        <SafeAreaView style={styles.body}>
            <StatusBar/>
            <AnimatedLoader
            visible={uploading}
            source={require('../assets/login.json')}
           
            animationStyle={styles.lottie}
            speed={1}>
            </AnimatedLoader> 
            <Image style={{width: 100, height: 100}} source={require('../assets/logo.png')}/>
            <View  style={styles.marginView}></View>
            <View  style={styles.marginView}></View>
            <View style={styles.buttonContainer}>
                <TextInput onChangeText={newText => setUserName(newText)} style={styles.input} placeholder='Username' />
                <View  style={styles.marginView}></View>
                <TextInput onChangeText={newText => setEmail(newText)} style={styles.input} placeholder='Email' />
                <View  style={styles.marginView}></View>
                <TextInput secureTextEntry={true} onChangeText={text => setPassword(text)}  style={styles.input} placeholder='Password'/>
            </View>
            <View style={styles.marginView}></View>
            <View style={styles.buttonContainer}>
            <Pressable style={styles.btn} onPress={()=>handleRegister()} >
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>Register</Text>
                </Pressable>
            </View>
            <View  style={styles.marginView}></View>
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16, color: 'white'}}>Already have account?</Text>
                    <Link style={{  fontSize: 16, color: 'white', textDecorationLine: 'underline'}} to={{screen: 'Login'}}>Click here</Link>
                </View>
            
        </SafeAreaView>
      )
   
}

const styles = StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: '#FF914D',
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 100
    },
    marginView: {
        marginBottom: 10
    },
    buttonContainer: {
        width: "50%",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderRadius: 10
    },
    btn: {
        padding: 10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        borderRadius: 10
    }
  });
  
  