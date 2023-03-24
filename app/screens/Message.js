import { FlatList, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, {  useEffect } from 'react'
import { auth } from '../../firebase'
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {  doc, setDoc, getDoc, arrayUnion, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useState } from 'react'

export default function Message({route}) {
    const[chat, setChat] = useState(route.params.chat)
    const[message, setMessage] = useState('')
    const chatId =  auth.currentUser.displayName + (auth.currentUser.displayName === chat[0].to ? chat[0].from : chat[0].to) 
  

    const getSingleChat = async()=>{
        const docRef = doc(db, "chats", chatId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        
            setChat(docSnap.data().chat)
        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }
    const sendMessage = async(to)=>{
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
            await updateDoc(refTwo, {chat: arrayUnion({from: auth.currentUser.displayName,to:to,  message: message})});
            setMessage('')
            getSingleChat()
          }else if(checkOne.exists() && !checkTwo.exists()){
            const refOne = doc(db, "chats", checkOne.id);
            await setDoc(doc(db, 'chats', to + auth.currentUser.displayName), {chat: [{from: auth.currentUser.displayName,to: to,message: message}]})
            await updateDoc(refOne, {chat: arrayUnion({from: auth.currentUser.displayName,to:to,  message: message})});
            setMessage('')
            getSingleChat()
          }else if(!checkOne.exists() && checkTwo.exists()){
            const refTwo = doc(db, "chats", checkTwo.id);
            await setDoc(doc(db, 'chats', auth.currentUser.displayName + to), {chat: [{from: auth.currentUser.displayName,to:to, message: message}]})
            await updateDoc(refTwo, {chat: arrayUnion({from: auth.currentUser.displayName,to:to,  message: message})});
            setMessage('')
            getSingleChat() 
          }else if(!checkOne.exists() && !checkTwo.exists()){
            await setDoc(doc(db, 'chats', auth.currentUser.displayName+to), {chat: [{from: auth.currentUser.displayName,to:to, message: message}]})
            await setDoc(doc(db, 'chats', to+auth.currentUser.displayName), {chat: [{from: auth.currentUser.displayName,to:to, message: message}]})
            setMessage('')
            getSingleChat()
          }else{
            console.log('No match')
          }
        }
        catch (err){
          console.log(err)
        }
        setMessage('')
      }
      
      useEffect(()=>{
        getSingleChat()
      },[])
  
  return (
    <View style={{flex: 1, backgroundColor:'#E5E0FF'}}>
      <View style={{height: '92%', padding: 10}}>
        <FlatList data={chat}  contentContainerStyle={{paddingVertical: 20}} renderItem={({item})=>{
            return (
                <Text style={{alignSelf: item.from === auth.currentUser.displayName ? 'flex-end' : 'flex-start', backgroundColor: item.from === auth.currentUser.displayName ?  'orange': '#655DBB',fontSize:18,marginBottom:5, paddingHorizontal: 25,paddingVertical:10, borderRadius: 50, color:'white' }}>{item.message}</Text>
            )
        }} />
        
      </View>
        <View style={{backgroundColor:'white', flexDirection: 'row',width: '100%',alignSelf:'center', position: 'absolute', bottom: 1, padding: 4, height: 50, borderWidth: 1, borderColor:'gray'}}>
            <TextInput value={message} onChangeText={(txt)=> setMessage(txt)}  style={{width: '90%'}} />
            <TouchableOpacity onPress={()=> sendMessage(auth.currentUser.displayName === chat[0].to ? chat[0].from : chat[0].to)}  style={{ width:'10%', borderLeftWidth: 0,  justifyContent:'center', alignItems:'center'}}>
                <FontAwesomeIcon color='orange' size={28} icon={faMessage}/>
            </TouchableOpacity>
        </View>
    </View>
  )
}

