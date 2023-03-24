
import { useContext, useState } from 'react'
import { Text, StyleSheet, Image, View , StatusBar, TextInput, Pressable} from 'react-native'
import { Context } from '../../Context'
import {  doc, setDoc, getDoc, arrayUnion, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { auth } from '../../firebase'
import AnimatedLoader from "react-native-animated-loader";
export default function SingleItem ({navigation, route}) {
    const{all} = useContext(Context)
    const [message, setMessage] = useState('')
    const[uploading, setUploading] = useState(false)
    const item = route.params.item
    const listings = all.filter(element => element.owner === item.owner && element)
    const sendMessage = async(to)=>{
      setUploading(true)
      try{
        const docRefOne = doc(db, "chats", auth.currentUser.displayName + to);
        const docRefTwo = doc(db, "chats",  to + auth.currentUser.displayName );
        const checkOne = await getDoc(docRefOne);
        const checkTwo = await getDoc(docRefTwo);
        if(checkOne.exists() && checkTwo.exists()){
          const refOne = doc(db, "chats", checkOne.id);
          const refTwo = doc(db, "chats", checkTwo.id);
          await updateDoc(refOne, {
            chat: arrayUnion({from: auth.currentUser.displayName, to: to, message: message})
          });
          await updateDoc(refTwo, {chat: arrayUnion({from: auth.currentUser.displayName,  message: message})});
          
        }else if(checkOne.exists() && !checkTwo.exists()){
          const refOne = doc(db, "chats", checkOne.id);
          await setDoc(doc(db, 'chats', to + auth.currentUser.displayName), {chat: [{from: auth.currentUser.displayName,to: to,message: message}]})
          await updateDoc(refOne, {chat: arrayUnion({from: auth.currentUser.displayName,to:to,  message: message})});
         
        }else if(!checkOne.exists() && checkTwo.exists()){
          const refTwo = doc(db, "chats", checkTwo.id);
          await setDoc(doc(db, 'chats', auth.currentUser.displayName + to), {chat: [{from: auth.currentUser.displayName,to:to, message: message}]})
          await updateDoc(refTwo, {chat: arrayUnion({from: auth.currentUser.displayName,to:to,  message: message})});
          
        }else if(!checkOne.exists() && !checkTwo.exists()){
          await setDoc(doc(db, 'chats', auth.currentUser.displayName+to), {chat: [{from: auth.currentUser.displayName,to:to, message: message}]})
          await setDoc(doc(db, 'chats', to+auth.currentUser.displayName), {chat: [{from: auth.currentUser.displayName,to:to, message: message}]})
          
        }else{
          console.log('No match')
        }
      }
      catch (err){
        console.log(err)
      }
      setMessage('')
      setUploading(false)
      navigation.navigate('Homepage')
    }
   return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar/>
      <AnimatedLoader
      visible={uploading}
      source={require('../assets/login.json')}
      
      animationStyle={styles.lottie}
      speed={1}>
      </AnimatedLoader> 
      <Image style={styles.img} source={{uri :item.url}}/>
      <View style={{width: '100%' , height: 100, padding: 15}}>
        <Text style={{marginBottom: 5, fontSize: 26, fontWeight: 'bold'}}>{item.item}</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'orange'}}> {item.price}$</Text>
        <Text style={{ fontSize: 14}}>{item.description}</Text>
      </View>
      <View style={{width: '100%' , height: 100, padding: 15, display: 'flex', flexDirection: 'row'}}>
          <Image  style={[styles.profilePic, {marginRight: 10}]} source={{uri: item.profileUrl}}/>
          <View>
            <Text style={{fontWeight: 'bold'}}>{item.owner}</Text>
            <Text>{listings.length} Listing(s)</Text>
          </View>
      </View>
      <View style={{width: '100%' , height: 100, padding: 15, display: 'flex', flexDirection: 'column', alignItems:'center', position: 'absolute', bottom: 20}}>
          <TextInput value={message} onChangeText={(txt)=> setMessage(txt)} style={{backgroundColor:'white', width: '80%', height: '60%', borderRadius: 20, borderWidth: 1,borderColor: 'orange', marginBottom: 10, paddingStart: 10}}></TextInput>
          <Pressable style={[styles.button, {width: '80%' , borderRadius: 50}]}  onPress={()=> sendMessage(item.owner)}>
            <Text style={{ color: 'white'}} > Contact to Seller </Text>
          </Pressable>
      </View>
     
    </View>
     
  )
}

const styles = StyleSheet.create({
 profilePic: {
  width: 50,
  height: 50,
  borderRadius: 50
 } ,
 img: {
  width: '100%',
  height: 250,
 },
 lottie: {
  width: '100%',
  height:'100%'
 }, 
 button: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 4,
  elevation: 3,
  backgroundColor: 'orange',
},
})