import {  createContext, useState } from "react";
import {auth, db} from './firebase'
import { getDocs, collection } from "firebase/firestore";
import { signOut } from 'firebase/auth';
export const Context = createContext()



export default function Provider ({children}){
    const[rotation, setRotation] = useState('Homepage')
    const[all, setAll] = useState([]);
    const[chats, setChats] = useState([])
    const chatValid = (id)=>{
        let valid = ""
        for(let i=0; i < auth.currentUser.displayName.length; i++){
            valid += id[i]
          }
          if(valid === auth.currentUser.displayName){
            return true
          }else{
            false
          }
        }
      
    const getChats = async() =>{
        const querySnapshot = await getDocs(collection(db, "chats"));
        let arr = []
        querySnapshot.forEach((res) => {
          if(chatValid(res.id)){
            arr.push(res.data())
          }
        });
        setChats(arr)
      }
   
   
    const changeRotation = (rotat) =>{
        setRotation(rotat)
    }

    const fetchAllItems = async() =>{
        const querySnapshot = await getDocs(collection(db, "items"));
        if(querySnapshot.docs === []){
            return
        }else{
            let arr = []
             querySnapshot.forEach(  (doc) => {

                let newData =doc.data()
                arr.push(newData)       
            }); 
            setAll(arr)
        }
     };
     const logOff = () =>{
        signOut(auth)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

     
    return (
        <Context.Provider
        value={{
            all, 
            fetchAllItems,
            logOff,
            changeRotation,
            rotation,
            getChats,
            chats
            
        }}
        >
            {children}
        </Context.Provider>
    )
}