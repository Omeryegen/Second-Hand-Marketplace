
import { Text, View, Image, StyleSheet, TouchableOpacity, Button, StatusBar} from "react-native";
import { collection, query, where , getDocs, updateDoc, doc} from "firebase/firestore";
import { db } from "../../firebase";
import { useContext, useEffect } from "react";
import { useState } from "react";
import Navbar from "./components/shared/Navbar";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import * as ImagePicker from 'expo-image-picker';
import { signOut } from "firebase/auth";
import { Context } from "../../Context";
import { storage } from "../../firebase";
import { getDownloadURL, uploadBytes,ref } from "firebase/storage";
import AnimatedLoader from "react-native-animated-loader"; 
import { useIsFocused } from "@react-navigation/native";
export default function Profile({navigation}) {
  const[uploading, setUploading] = useState(false)
  const[image, setImage] = useState(null)
  const {changeRotation} = useContext(Context)


  const changeUrls = async (url) =>{
    const itemsRef = collection(db, "items");
    const q = query(itemsRef, where("ownerEmail", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty){
      querySnapshot.forEach(async (res) => {
        const itemRef = doc(db, 'items', res.id)
        await updateDoc(itemRef, {profileUrl: url})
      });
    }
  }
  const logOff = () =>{
    signOut(auth).then((res)=> navigation.replace('Login')).then(res => changeRotation('Login'))
  }
  
  const pickImage = async()=>{
    setImage(null)
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
    });
    
    if(!result.canceled){
        setUploading(true)
        const storageRef = ref(storage, auth.currentUser.email)
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob()
        await uploadBytes(storageRef, blob)
        const url = await getDownloadURL(storageRef)
        await updateProfile(auth.currentUser, {photoURL: url})
        changeUrls(url)
        setImage(url)
        setUploading(false)
        
    }else{
        console.log('canceled')
    }
    };
    useEffect(()=>{
      changeRotation('Profile')
    }, [useIsFocused()])
  
  return (
    <View style={styles.body}>
      <View style={styles.marginView}></View>
      <View style={styles.marginView}>
          <TouchableOpacity  style={styles.camera} onPress={pickImage}>
              <Image source={{uri: auth.currentUser.photoURL}} style={styles.camera}/> 
          </TouchableOpacity>
      </View>
      <View >
            <Text style={styles.text}>Username: {auth.currentUser.displayName}</Text>
            <View style={styles.marginView}/>
            <Text style={[styles.text, {marginBottom: 20}]}>Email: {auth.currentUser.email}</Text>
            
      </View>
      <View style={styles.buttonContainer}>
         <TouchableOpacity style={{marginBottom:10, height: 50, width: '100%',backgroundColor:'orange', justifyContent:'center', alignItems:'center'}} onPress={()=> navigation.navigate('MyListings')}>
            <Text style={{fontWeight: 'bold', color:'white', fontSize: 15}} >My Listings</Text>
         </TouchableOpacity>
         <TouchableOpacity style={{marginBottom:30, height: 50, width: '100%',backgroundColor:'#D864A9', justifyContent:'center', alignItems:'center'}}  onPress={()=> navigation.navigate('Messages')}>
            <Text style={{fontWeight: 'bold', color:'white', fontSize: 15}} >My Messages</Text>
         </TouchableOpacity>
         <TouchableOpacity style={{height: 50, width: '100%',backgroundColor:'#AA77FF', justifyContent:'center', alignItems:'center'}}  onPress={logOff}>
            <Text style={{fontWeight: 'bold', color:'white', fontSize: 15}} >Log out</Text>
         </TouchableOpacity>
      </View>
      <AnimatedLoader
                visible={uploading}
                source={require('../assets/login.json')}
                animationStyle={styles.lottie}
                speed={1}>
            </AnimatedLoader>
      <Navbar navigation={navigation}/>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems:'center',
  },
  marginView: {
      marginBottom: 10
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18
  },
  lottie: {
    width: '100%',
    height: '100%'
  },
  buttonContainer: {
      width: "100%",
      marginBottom: 20,
  
  },
  input: {
      borderRadius: 20,
      padding: (3, 10),
      backgroundColor: '#D8D8D8',
  },
  camera: {
      width: 100,
      height: 100,
      display: 'flex',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: '#D8D8D8',
      borderRadius: 50,
  }
  });