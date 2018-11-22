import React from 'react';
import { Alert, StyleSheet, ActivityIndicator, Text, View, ScrollView, Button, TouchableHighlight, TouchableOpacity , TouchableNativeFeedback, AppState, NetInfo} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
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

  class CommodityEntry extends React.PureComponent {
    constructor(props){
      super(props);
      // state: Color of this entry
      this.state={isSelected: false}
    }
    handleEntryPress2=(index)=>{
      this.setState({isSelected: true})
    }
    // componentWillMount(){
    //   console.log("what the hell is this: "+ this.props.selectedCommodityIndex + this.props.index);
    //   console.log("I am in componentDidMount of CommodityEntry: "+ this.props.selectedCommodityIndex===this.props.index)
    //   this.setState({isSelected: this.props.selectedCommodityIndex===this.props.index?true:false})
    // }
    render(){
      console.log(this.props.selectedCommodityIndex===this.props.index + " :: " + this.state.isSelected);
      console.log("Index of entry Selected is: "+this.props.index + " Index of selectedCommodity: "+this.props.selectedCommodityIndex);
      return (
        //  <View style={(this.props.index!=this.props.selectedCommodityIndex)?styles.stockEntry:styles.selectedStockEntry}>
            <TouchableHighlight useForeground={true} onPress={()=>{this.props.handleEntryPress(this.props.index)}} underlayColor= '#293242'>
            {/* <View style={(this.props.index!=this.props.selectedCommodityIndex)?styles.stockEntry:styles.selectedStockEntry}> */}
            <View style={!this.props.isSelected?styles.stockEntry:styles.selectedStockEntry}>
              <View>
              <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 6, fontSize: 15}}>
                {this.props.value[0] + " "}
              </Text>
              <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 6}}>{this.props.value[1]}</Text>
              </View>
                

                <View style={styles.stockEntryRightPart} >
                
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                    {Number(this.props.value[6]).toFixed(2)}
                  </Text>
                  <ChangeDisplayButton a='1' Entry={this.props.value} />
                
                </View>  
                </View>  
                </TouchableHighlight>
      )
    }
  }

  export default class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {selectedCommodityInfoArray: [], appState: AppState.currentState, internetStatus: true, stocks: [], commodity: [], selectedStock: [], selectedCommodityIndex: null, refreshing: false}
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
            // console.log(dataArray[1].length);
            // // adding a flag at the end of each row of this 2:Dimensional data array which indicates if this entry is selected one or not
            // dataArray.map(elem=>{
            //   elem[15]= false;
            // })


          this.setState({commodity: dataArray})
          var buff=[]
          for(i=0;i<this.state.commodity.length;i++){
            buff[i]= false;
          }
          this.setState({selectedCommodityInfoArray: buff})
          // console.log(index);
         //  console.log(this.state.commodity.length)
          // console.log(this.state.commodity)



          //************************************************************************************************************************ */

          // var info2 = $('.altItemcolor').text().trim().replace(/\s\s+/g, ',')
          // var dataArray2 = info2.split(",");
          // var temp=[];
          // var tempdata=[]
          // for(index=0; index<dataArray2.length; index++){
          //  temp[index%15] = dataArray2[index];
          //  if(index%15 == 14){
          //    tempdata.push(temp);
          //    temp= [null];
          //  }
          // }

          //************************************************************* */
          // tempdata.forEach(elem=>{
          //   console.log(elem[0]);
          // })
          console.log("---------------------------------------------------------------------------------------------")
        })
        
    }    

    handleEntryPress=(index)=>{
      
       // console.log("Entry number this is pressed: "+ index + this.state.commodity[index]);
      
       this.setState({selectedStock: this.state.commodity[index], selectedCommodityIndex: index})
        // this.setState({isSelected: true})
      //  this.setState({selectedStock: this.state.commodity[index]});
        // -------->
        this.setState({selectedCommodityIndex: index});
        // var temp = [];
        // for(i=0;i<this.state.selectedCommodityInfoArray.length;i++){
        //   if(i===index){
        //     temp[index]=true;
        //   }else {
        //     temp[i] = false ;
        //   }
        // }
        
       // this.setState({selectedCommodityInfoArray: temp})

     // Alert.alert("Entry number this is pressed:" + index + this.state.commodity[index]);
    }

    onSwipeDown(gestureState) {
        // console.log('You swiped down!');
        this.setState({selectedCommodityIndex: null, selectedStock: []})
    }

    // _onRefresh = ()=>{
    //     this.setState({refreshing: true});
    //     this._onPressButton();
    //   }

    recurringLoading = ()=>{
      console.log("I am recurringLoading ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
      if(this.state.appState==='active' && this.state.internetStatus){
     //   console.log(" Yeah I am being called!!!!!!!!!!--------------------------------------------------")
        console.log("Our appState is :"+ this.state.appState + "^^^^^" + "internetStatus is: " +this.state.internetStatus);
        this.loadLiveFeed();
      }
    }

    handleConnectivityChange = (connectionInfo)=>{
   //   console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      if(connectionInfo.type != "none"){
       // console.log("------------------" + connectionInfo.type)
        this.setState({internetStatus: true});
        this.recurringLoading();
      }else {
        this.setState({internetStatus: false});
      }
    }

    _handleAppStateChange = (nextAppState)=>{
      console.log("_handleAppStateChange is called");
      this.setState({appState: nextAppState});
      console.log(this.state.appState)
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        // console.log('App has come to the foreground!')
        this.recurringLoading();
      }
    }

    componentDidMount(){
      SplashScreen.hide();
      AppState.addEventListener('change', this._handleAppStateChange);
      NetInfo.addEventListener(
        'connectionChange',
        this.handleConnectivityChange
      );
      NetInfo.isConnected.fetch().then(isConnected => {
        console.log('First, is ' + (isConnected ? 'online' : 'offline'));
        if(isConnected){
          this.setState({internetStatus: true});
        }else {
          this.setState({internetStatus: false});
        }
      });
        // this.loadLiveFeed();
      //  console.log("State of the app is: ------------------------->"+AppState.currentState);
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
                      //   <TouchableHighlight useForeground={true} onPress={()=>this.handleEntryPress(index)} key={index} underlayColor= '#293242'>
                      //   <View style={(index!=this.state.selectedCommodityIndex)?styles.stockEntry:styles.selectedStockEntry}>
                      //    <View>
                      //     <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 6, fontSize: 15}}>
                      //       {value[0] + " "}
                      //     </Text>
                      //     <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 6}}>{value[1]}</Text>
                      //     </View>
                            
    
                      //       <View style={styles.stockEntryRightPart} >
                            
                      //         <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                      //           {Number(value[6]).toFixed(2)}
                      //         </Text>
                      //         <ChangeDisplayButton a='1' Entry={value} />
                            
                      //       </View>  
                      //       </View>  
                      // </TouchableHighlight>
                      // <TouchableHighlight useForeground={true} onPress={()=>this.handleEntryPress(index)} key={index} underlayColor= '#293242'>


                      //  <CommodityEntry  value={value} isSelected={this.state.selectedCommodityInfoArray[index] } selectedCommodityIndex={this.state.selectedCommodityIndex} handleEntryPress={this.handleEntryPress} index={index} key={index}/>
                        <CommodityEntry  value={value} isSelected={this.state.selectedCommodityIndex==index?true:false } handleEntryPress={this.handleEntryPress} index={index} key={index}/>

                        // </TouchableHighlight>
                  )
                  
                    
                }.bind(this))
              
              }
               </ScrollView>
            </View>
                )
               } else {
                 if(this.state.internetStatus){
                  return (
                    <View style={ {flex: 1, backgroundColor: '#02091A', justifyContent: 'center', alignItems: 'center'} }>
                      <Text style={{color: '#fff'}}>Loading... Please wait!</Text>
                      <ActivityIndicator size="large" color="#00ff00" />
                    </View>  
                   ) 
                 }else {
                   return(
                    <View style={ {flex: 1, backgroundColor: '#02091A', justifyContent: 'center', alignItems: 'center'} }>
                     <Text style={{color: '#fff', fontSize: 18}}>No or Bad Internet!</Text>
                     <Text style={{color: '#fff'}}>Please check your Connection and try again!</Text>
                  </View> 
                   )
                  
                 }
                  
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