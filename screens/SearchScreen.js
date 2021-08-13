import React from "react";
import { Text,View,StyleSheet } from "react-native";

export default class SearchScreen extends React.Component{
    render(){
        return(
                <View style={styles.container}><Text>search</Text></View>
        );
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})