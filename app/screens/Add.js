
import {  useState, useContext, useEffect } from 'react';
import { Context } from '../../Context';
import { StyleSheet, View, TextInput, Button,TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import {storage} from '../../firebase';
import { collection } from 'firebase/firestore';
import {db} from '../../firebase'
import {ref, uploadBytes } from 'firebase/storage'
import uuid from 'react-native-uuid'
import { addDoc, updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../../firebase';
import { useIsFocused } from '@react-navigation/native';
import AnimatedLoader from "react-native-animated-loader";
export const Add = ({navigation}) => {
    const { fetchAllItems, changeRotation} = useContext(Context)
    const [category, setCategory] = useState('Technology');
    const[image, setImage] = useState(null)
    const[uploading, setUploading] = useState(false)
    const[description, setDescription] = useState("")
    const[item, setItem] = useState("");
    const[price, setPrice] = useState("");
    const cancel = ()=>{
        setImage(null)
        setItem("")
        setPrice("")
        setCategory('Technology')
        setDescription("")
        changeRotation('Homepage')
        navigation.replace('Homepage')
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
            setImage(result.assets[0].uri); 
        }else{
            console.log('canceled')
        }
         
    };
    
    const addItem = async() =>{
        setUploading(true)
         try {
            let uid = uuid.v4()
            const storageRef = ref(storage, uid)
             const docRef = await addDoc(collection(db, "items"), {
                 ownerEmail: auth.currentUser.email,
                 owner: auth.currentUser.displayName,
                 itemId: uid,
                 item: item,
                 price: price,
                 category: category,
                 description: description,
                 profileUrl: auth.currentUser.photoURL,
                 url: ""
             });
             const updateRef = doc(db, "items", docRef.id);
             const response = await fetch(image);
             const blob = await response.blob()
             await uploadBytes(storageRef, blob)
             const url = await getDownloadURL(storageRef)
             await updateDoc(updateRef, {url: url} )
             
             setCategory('Technology')
             setImage(null)
             setItem('')
             setPrice('')
             setDescription('')
             fetchAllItems()
             changeRotation('Homepage')
             navigation.replace('Homepage');
           } catch (e) {
             console.error("Error adding document: ", e);
           }
           setUploading(false)
      };
 
    
    useEffect(()=>{
        if(!auth.currentUser){
            navigation.replace('Login')
        }
        changeRotation('Add')
    }, [useIsFocused()])
   
    return (
        <View  style={styles.body}>
            <AnimatedLoader
                visible={uploading}
                source={require('../assets/lottie.json')}
                overlayColor="orange"
                animationStyle={styles.lottie}
                speed={1}>
            </AnimatedLoader>
            <View style={styles.marginView}></View>
            <View style={styles.marginView}>
                <TouchableOpacity style={styles.camera} onPress={pickImage}>
                    {image !== null ? image && <Image source={{uri: image}} style={{width: 70 , height: 70}}/> : <FontAwesomeIcon color='white' icon={faCamera}/>} 
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TextInput onChangeText={newText => setItem(newText)} style={styles.input} placeholderTextColor='white' placeholder='Title' />
                <View  style={styles.marginView}></View>
                <TextInput onChangeText={text => setPrice(text)}   style={[styles.input, {width: 100}]} placeholderTextColor='white'  placeholder='Price'/>
                <View  style={styles.marginView}></View>
                <View style={[styles.input, {width: 200, padding: 0}]}>
                <Picker  onValueChange={(val) => setCategory(val)}   selectedValue={category}>
                    <Picker.Item  label="Technology" value="Technology" />
                    <Picker.Item label="Clothing" value="Clothing" />     
                    <Picker.Item label="Sport" value="Sport" />     
                    <Picker.Item label="Furniture" value="Furniture" />     
                    <Picker.Item label="Gaming" value="Gaming" />     
                    <Picker.Item label="Decoration" value="Decoration" />     
                    <Picker.Item label="Books" value="Books" />     
                </Picker>
                </View>
                <View  style={styles.marginView}></View>
                <TextInput onChangeText={(val) => setDescription(val)}  style={[styles.input]} placeholderTextColor='white'  placeholder='Description'/>
            </View>
            <View style={styles.marginView}></View>
            <View style={styles.buttonContainer}>
                <Button onPress={addItem}  color="orange" title='Add'/>
                <View  style={styles.marginView}></View>
                <Button onPress={cancel}  color="orange" title='Cancel'/>
            </View>
            
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
buttonContainer: {
    width: "100%",
    marginBottom: 10,
    padding: 10
},
input: {
    borderRadius: 20,
    padding: (3, 10),
    backgroundColor: '#D8D8D8',
},
lottie: {
    width: 100,
    height: 100,
  },
camera: {
    width: 70,
    height: 70,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#D8D8D8',
    borderRadius: 5
}
});