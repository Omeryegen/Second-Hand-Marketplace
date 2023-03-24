
import {  useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { StyleSheet, View, TextInput,  Text, Image, StatusBar, Pressable} from 'react-native';
import { signInWithEmailAndPassword  } from 'firebase/auth';
import { Link, useIsFocused } from '@react-navigation/native';
import AnimatedLoader from "react-native-animated-loader";
export default function WelcomeScreen({navigation}) {
    const[uploading, setUploading] = useState(false)
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
  
    const handleLogin = () =>{
        setUploading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then(res => {
                
                navigation.replace('Homepage')
                setUploading(false)
            })
            .catch(err => setUploading(false))
    }
    useEffect(()=>{
        if(auth.currentUser){
          navigation.replace('Homepage')
        }
      }, [useIsFocused()])
    
        return (
            <View style={styles.body}>
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
                    <TextInput onChangeText={newText => setEmail(newText)} style={styles.input} placeholder='Email' />
                    <View  style={styles.marginView}></View>
                    <TextInput secureTextEntry={true}  onChangeText={text => setPassword(text)}  style={styles.input} placeholder='Password'/>
                    <View  style={styles.marginView}></View>
                    <View  style={styles.marginView}></View>
                    <Pressable style={styles.btn} onPress={()=>handleLogin()} >
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>Login</Text>
                    </Pressable>
                    
                    <View  style={styles.marginView}></View>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 16, color: 'white'}}>Are you new here?</Text>
                        <Link style={{  fontSize: 16, color: 'white', textDecorationLine: 'underline'}} to={{screen: 'Register'}}>Click here</Link>
                    </View>
                  
                </View>
               
                
            </View>
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
        paddingVertical: 10,
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
  
  