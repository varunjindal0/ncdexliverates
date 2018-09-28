import React from 'react';
import { StyleSheet, ActivityIndicator, Text, View, ScrollView, Button, TouchableHighlight, TouchableOpacity , RefreshControl, FlatList, TouchableNativeFeedback, AppState} from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import SplashScreen from 'react-native-splash-screen';
import MissingCaFetch from './MissingCaFetch';

const cheerio = require('react-native-cheerio');

class ChangeDisplayButton extends React.Component {
    constructor(props){
      super(props);
      this.state={toggleDisplayChangeFlag: this.props.a}
    }
    render(){
      value = this.props.Entry;
      return (
            <TouchableHighlight style={{paddingLeft: 9}} onPress={()=>this.setState({toggleDisplayChangeFlag: !this.state.toggleDisplayChangeFlag}) } underlayColor= 'transparent'>
              <View style={[styles.button, {backgroundColor: (value[7])>=0 ? '#5ae224':'#c10141'}]}>
                <Text style={styles.buttonText}>{this.state.toggleDisplayChangeFlag ? ((value[7])>0 ? '+'+(value[7]) : value[7]) : (value[8]>=0 ? '+'+value[8]+'%' : value[8]+'%')}</Text>
              </View>
              {/* ((value[5]-value[2])>0) ? '#5ae224':'#c10141' */}
             </TouchableHighlight>
          )
    }
  }

  export default class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {stocks: [], commodity: [], selectedStock: [], selectedCommodityIndex: null, refreshing: false}
    }

    loadLiveFeed(){
        MissingCaFetch.fetch(html=>{
            console.log("I am in this magical function>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            const $= cheerio.load(html);
            var info = $('.ItemColor').text().trim().replace(/\s\s+/g, ',')
            var dataArray = info.split(",");
            var temp=[];
            var tempdata=[]
            for(index=0; index<dataArray.length; index++){
            temp[index%15] = dataArray[index];
            if(index%15 == 14){
                tempdata.push(temp);
                temp= [null];
            }
            }
            var info2 = $('.altItemcolor').text().trim().replace(/\s\s+/g, ',')
            var dataArray2 = info2.split(",");
            var temp=[];
            var tempdata2=[]
            for(index=0; index<dataArray2.length; index++){
            temp[index%15] = dataArray2[index];
            if(index%15 == 14){
                tempdata2.push(temp);
                temp = [null];
                }
            }
         
            var dataArray =[];
            for(i=0 ; i<(tempdata.length+tempdata2.length); i++){
              if(i%2===0){
                dataArray[i]= tempdata[i/2];
              } else {
                dataArray[i] = tempdata2[parseInt(i/2)]
              }
            }      
            console.log("**********************************--------------------------------------------");
            //dataArray.forEach(elem=>{console.log(elem)});   

          this.setState({commodity: dataArray})
          // console.log(index);
           console.log(this.state.commodity.length)
          // console.log(this.state.commodity)



          //************************************************************************************************************************ */

          var info2 = $('.altItemcolor').text().trim().replace(/\s\s+/g, ',')
          var dataArray2 = info2.split(",");
          var temp=[];
          var tempdata=[]
          for(index=0; index<dataArray2.length; index++){
           temp[index%15] = dataArray2[index];
           if(index%15 == 14){
             tempdata.push(temp);
             temp= [null];
           }
          }
          // tempdata.forEach(elem=>{
          //   console.log(elem[0]);
          // })
        })
    }    

    handleEntryPress(index){
        console.log("Entry number this is pressed: "+ index)
        this.setState({selectedStock: this.state.commodity[index], selectedCommodityIndex: index})
    }

    onSwipeDown(gestureState) {
        console.log('You swiped down!');
        this.setState({selectedCommodityIndex: null, selectedStock: []})
    }

    // _onRefresh = ()=>{
    //     this.setState({refreshing: true});
    //     this._onPressButton();
    //   }

    recurringLoading = ()=>{
      if(AppState.currentState==='active'){
        console.log(" Yeah I am being called!!!!!!!!!!--------------------------------------------------")
        this.loadLiveFeed();
      }
    }

    componentDidMount(){
      SplashScreen.hide();
        this.loadLiveFeed();
        console.log("State of the app is: ------------------------->"+AppState.currentState);
        setInterval(this.recurringLoading, 60000)
    }

    render() {
        const config = {
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
        };
       // console.log(this.state);
        let bool = this.state.commodity.length;
        return (
          <View style={styles.container}>
        
              {
                
                function(){
                    
                   if(bool){
                 return ( 
                     <View style={styles.stockBasket}>
                     <ScrollView>
                    {
                   this.state.commodity.map(function(value,index){
               //   console.log("--------------------------------------------------------------------------------------------------- : "+index + " "+value[0]);
                  return (
                        <TouchableNativeFeedback useForeground={true} onPress={()=>this.handleEntryPress(index)} key={index} underlayColor= '#293242'>
                        <View style={(index!=this.state.selectedCommodityIndex)?styles.stockEntry:styles.selectedStockEntry}>
                         <View>
                          <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 6, fontSize: 15}}>
                            {value[0] + " "}
                          </Text>
                          <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 6}}>{value[1]}</Text>
                          </View>
                            
    
                            <View style={styles.stockEntryRightPart} >
                            
                              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                                {Number(value[6]).toFixed(2)}
                              </Text>
                              
                              {/* <TouchableHighlight style={{paddingLeft: 9}} a='1' onPress={()=> console.log("IT SHOULD TOOGLE %AGE CHANGE AND ABSOLUTE CHANGE"+this.props.backgroundColor)} underlayColor= 'transparent'>
                                <View style={[styles.button, {backgroundColor: (value[5]-value[2])>=0 ? '#5ae224':'#c10141'}]}>
                                  <Text style={styles.buttonText}>{(value[5]-value[2]).toFixed(2)>0 ? '+'+(value[5]-value[2]).toFixed(2):(value[5]-value[2]).toFixed(2)}</Text>
                                </View>
                                
                              </TouchableHighlight> */}
                              <ChangeDisplayButton a='1' Entry={value} />
                            
                            </View>  
                            </View>  
                      </TouchableNativeFeedback>
                      
                  )
                  
                    
                }.bind(this))
                
                
              }
               </ScrollView>
            </View>
                )
               } else {
                 return (
                      <View style={ {flex: 1, backgroundColor: '#02091A', justifyContent: 'center', alignItems: 'center'} }>
                        <Text style={{color: '#fff'}}>Loading... Please wait!</Text>
                        <ActivityIndicator size="large" color="#00ff00" />
                      </View>  
                     )  
               }
              }.bind(this)()
              
              }
             
            {/* <View> */}
            
    
              {
    
                    
                function(){
                  if(this.state.selectedStock.length){
                    return (
                      <GestureRecognizer
                        // onSwipe={(direction, state) => this.onSwipe(direction, state)}
                        onSwipeDown={(state) => this.onSwipeDown(state)}
                        config={config}
                        style={{
                          flex: 2,
                        }}
                        >
                       {/* <Text> {this.state.selectedStock[0]}</Text> */}
                      <View style={styles.selectedStockInfo}>
                        {/* <View style={styles.infoAreaSingleRow}><View style={styles.infoAreaSingleItem}><Text> {this.state.selectedStock[0]}</Text></View></View> */}
                          <View style={{borderBottomWidth: 1, alignItems: 'center', borderTopWidth: 2, borderTopColor: 'rgb(183, 168, 168)', borderBottomColor: 'rgb(183, 168, 168)'}}>
                            <Icon name="angle-down" backgroundColor= '#fff' size={30} color="#f9f4f4" />
                            <Text style={{textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18}}>{this.state.selectedStock[0]}</Text>
                            <Text style={{textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[1]}</Text>
                          </View>
                          <View style={styles.infoAreaSingleRow} >
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1', paddingLeft: 6}}>OPEN</Text>
                                <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[2]}</Text>
                              </View>
    
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1'}}>SPOT PRICE</Text>
                                <Text style={{color: '#fff', fontWeight: 'bold', marginRight: 6}}>{this.state.selectedStock[10]}</Text>
                              </View>
                              
                          </View>
    
                          <View style={styles.infoAreaSingleRow} >
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1', paddingLeft: 6}}>HIGH</Text>
                                <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[3]}</Text>
                              </View>
    
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1'}}>SPOT DT.</Text>
                                <Text adjustsFontSizeToFit={true} style={{fontSize: 10, width: 60, color: '#fff', fontWeight: 'bold', marginRight: 6 }}>{this.state.selectedStock[11]}</Text>
                              </View>
                              
                          </View>
    
                          <View style={styles.infoAreaSingleRow} >
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1', paddingLeft: 6}}>LOW</Text>
                                <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[4]}</Text>
                              </View>
    
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1'}}>BEST BUY</Text>
                                <Text style={{color: '#fff', fontWeight: 'bold', marginRight: 6}}>{this.state.selectedStock[12]}</Text>
                              </View>
                              
                          </View>
    
                          <View style={styles.infoAreaSingleRow} >
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1', paddingLeft: 6}}>CLOSE</Text>
                                <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[5]}</Text>
                              </View>
    
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1'}}>BEST SELL</Text>
                                <Text style={{color: '#fff', fontWeight: 'bold', marginRight: 6}}>{this.state.selectedStock[13]}</Text>
                              </View>
                              
                          </View>
                          <View style={styles.infoAreaSingleRow} >
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1', paddingLeft: 6}}>AV TP.</Text>
                                <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[9]}</Text>
                              </View>
    
                              <View style={styles.infoAreaSingleItem}>
                                <Text style={{color: '#c8cbd1'}}>OPEN INT.</Text>
                                <Text style={{color: '#fff', fontWeight: 'bold', marginRight: 6}}>{this.state.selectedStock[14]}</Text>
                              </View>
                              
                          </View>
                     </View>
                     </GestureRecognizer>  
                ) 
                }else {
                  return <Text>----</Text>
                }
                  
              }.bind(this)()
    
    
              }
    
               
            </View>
          //  </View>
        );
      }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#02091A',
      // marginTop: 20,
    },
    stockBasket: {
      flex: 3,
     backgroundColor: '#02091A',
      // backgroundColor: '#fff',

      // Color: '#fff'
     // borderWidth: 5
      },
    stockEntry: {
      flexDirection: 'row',
      height: 60,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: 'rgb(183, 168, 168)',
      marginTop: 4,
      // borderWidth: 5
    },
    selectedStockEntry: {
      flexDirection: 'row',
      height: 60,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: 'rgb(183, 168, 168)',
      // marginTop: 4,
      backgroundColor: '#293242'
    },
    selectedStockInfo: {
      flex: 2,
      backgroundColor: '#293242',
     // backgroundColor: '#EEEFF6',
    },
    stockEntryRightPart: {
      flexDirection: 'row',
      alignItems: 'center',
      
    },
    button: {
      width: 70,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: '#5ae224',
      marginRight: 6,
      borderRadius: 5
    },
    buttonText: {
      padding: 2,
      color: 'white',
      fontSize: 18,
      alignItems: 'center',
      justifyContent: 'center'
    },
    infoAreaSingleRow: {
       flex: 1,
       flexDirection: 'row',
     //  justifyContent: 'space-between',
      //  height: 20,
      //  borderWidth: 2,
       borderBottomWidth: 1,
       borderBottomColor: 'rgb(183, 168, 168)'
      //  alignItems: 'center'
    },
    infoAreaSingleItem: {
       flex: 1,
       flexDirection: 'row',
      //  borderRightWidth: 1,
       justifyContent: 'space-between',
       alignItems: 'center'
    }
  });