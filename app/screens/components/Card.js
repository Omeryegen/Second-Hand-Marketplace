import { StyleSheet, Text, TouchableOpacity, ImageBackground} from 'react-native'
import React from 'react'

export default function Card({navigation, route, item}) {
    const handleSingle = (item)=>{
        navigation.navigate('Single', {item: item})
      }
     
return (
    <TouchableOpacity onPress={()=> handleSingle(item)}   style={styles.box} key={item.itemId} >
        <ImageBackground borderTopLeftRadius={15} borderTopRightRadius={15} resizeMode='cover' style={styles.img} source={{uri: item.url}}/>
        <Text style={[styles.text, {color: 'black'}]}>{item.item}</Text>
        <Text style={styles.text} >{item.price}$</Text>
    </TouchableOpacity>
    )
     
  
}

const styles = StyleSheet.create({
 
    showcase: {
      flex: 1,
      display: "flex",
      alignItems: "center", 
    },
    box: {
      width: '100%',
      height: 250,
      display: 'flex',
      backgroundColor: "#fff",
      marginBottom: 20,
      borderRadius: 15
    },
    img: {
      width: "100%",
      height: 180,
      marginBottom: 5,
    },
   
    text: {
      padding: 5,
      fontWeight: 'bold',
      color: "orange"
    }
  })