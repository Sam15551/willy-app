import React from "react";
import { Text,View,StyleSheet,TouchableOpacity, Alert, } from "react-native";
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import db from '../config';

export default class BookTransactionScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            hasCameraPermissions:null,
            scanned:false,
            scannedBookId:"",
            scannedStudentId:"",
            buttonState:"normal",
            transactionMessage:"",
        }
    }

    initiateBookIssue = async()=>{
        db.collection("books").doc(this.state.scannedBookId).update({
            bookAvailability:false
        })
        db.collection("students").doc(this.state.scannedStudentId).update({
            numberOfBookIssued:firebase.firestore.FieldValue.increment(1)
        })
        db.collection("transactions").add({
            studentId:this.state.scannedStudentId,
            bookId:this.state.scannedBookId,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"issue"
        })
        Alert.Alert("bookIssued")
        this.setState({
            scannedBookId:"",
            scannedStudentId:"",
        })
    }

    initiateBookReturn = async()=>{
        db.collection("books").doc(this.state.scannedBookId).update({
            bookAvailability:true
        })
        db.collection("students").doc(this.state.scannedStudentId).update({
            numberOfBookIssued:firebase.firestore.FieldValue.increment(-1)
        })
        db.collection("transactions").add({
            studentId:this.state.scannedStudentId,
            bookId:this.state.scannedBookId,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"return"
        })
        Alert.Alert("bookReturned")
        this.setState({
            scannedBookId:"",
            scannedStudentId:"",
        })
    }

    getCameraPermissions=async(Id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA)
           this.setState({
               hasCameraPermissions:status==="granted",
               buttonState:Id,
               scanned:false,

           })
        }

    handleBarCodeScanned=async({data})=>{
        const{buttonState}=this.state
        if(buttonState==="BookId"){
        this.setState({
            scanned:true,
            scannedBookId:data,
            
            buttonState:'normal'
        })
        }
        else if(buttonState==="StudentId"){
            this.setState({
                scanned:true,
                scannedStudentId:data,
                
                buttonState:'normal'
            })
            }
    }   

    handleTransaction=()=>{
        var transactionMessage
        db.collection("books").doc(this.state.scannedBookId).get()
        .then((doc)=>{
           // console.log(doc.data())
           var book = doc.data()
           if(book.bookAvailability){
               this.initiateBookIssue()
               transactionMessage = "bookIssued"
           }
           else{
               this.initiateBookReturn()
               transactionMessage = "bookReturned"
           }
        })
        this.setState({
            transactionMessage:transactionMessage
        })
    }
        
    render(){
        const hasCameraPermissions=this.state.hasCameraPermissions
        const scanned = this.state.scanned
        const buttonState = this.state.buttonState
        if(buttonState==='clicked' && hasCameraPermissions){
            return(
                <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned}></BarCodeScanner>
            )

        }
        return(
                <View style={styles.container}>
                    <View>
                        <Image source={require("../assets/booklogo.jpg")} style={{width:200,height:200}}></Image>
                        <Text style={{textAlign:'center',fontSize:30}}>Willy</Text>
                    </View>
                 <View style={styles.inputView}> 
                     <TextInput style={styles.inputBox} placeholder="book id"/>
                     <TouchableOpacity style={styles.scanButton}>
                         <Text style={styles.buttonText}>scan</Text>
                     </TouchableOpacity>
                 </View>
                 <View style={styles.inputView}> 
                     <TextInput style={styles.inputBox} placeholder="student id"/>
                     <TouchableOpacity style={styles.scanButton}>
                         <Text tyle={styles.buttonText}>scan</Text>
                     </TouchableOpacity>
                 </View>       
                 <TouchableOpacity style={{backgroundColor:'black',width:100,height:50}} onPress={async()=>{this.handleTransaction()}}>
                     <Text style={{color:'white',padding:10,textAlign:'center',fontSize:20,justifyContent:'center'}}>Submit</Text>
                 </TouchableOpacity> 
                </View>
                  
        );
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    scanButton:{
        backgroundColor:'black',
        width:50,
        borderWidth:1.5,
    },
    buttonText:{
        color:'white',
        fontSize:15,
        textDecorationLine:'underline',
    },
    inputView:{
        flexDirection:'row',
        margin:20,
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        fontSize:20,
    }
})