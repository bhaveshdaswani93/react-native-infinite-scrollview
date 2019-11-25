import React, { Component } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback,TouchableHighlight, View, Text, ScrollView, StyleSheet, Dimensions, Picker, Image } from "react-native";

const { width,height } = Dimensions.get("window");

const ITEM_SIZE = 60;
const BUFFER_ITEMS = 5;
const DISPLAY_ITEMS = Math.round(height/ITEM_SIZE);


export default class App extends Component{
    constructor(props){
        super(props);
        const dataModel = Array(100).fill().map((item,index) => {
            return {
                id:index.toString(),
                key:index.toString(),
                data:index,
                position: index*ITEM_SIZE
            }
        })
        this.state={
            renderModel: dataModel.slice(0,DISPLAY_ITEMS+5),
            dataModel: dataModel,
            bodyHeight: 400
        }
        this._rowsCache={};
    }

    componentDidMount(){
    }

    updateRenderModel(contentOffset) {
      var listItemHeight = ITEM_SIZE;
      // Use contentOffset to calculate first visible dataItem as y-position / height of item
      var firstVisibleItem = Math.max(0, Math.floor(contentOffset.y / listItemHeight));
      var renderModelSize = BUFFER_ITEMS * 2 + DISPLAY_ITEMS;
      var nextPosition = 0;
      var newRenderModel = this.state.renderModel;
      // Calculate first y-position
      if(firstVisibleItem >= BUFFER_ITEMS){
        nextPosition = (firstVisibleItem - BUFFER_ITEMS) * listItemHeight;
        // Subset of dataModel to be rendered.
        var dataItems = this.state.dataModel.slice(firstVisibleItem - BUFFER_ITEMS, firstVisibleItem + renderModelSize - BUFFER_ITEMS);
        newRenderModel = dataItems.map((dataItem, index) => {
          return {
            key: dataItem.id,
            data: dataItem.data,
            position: nextPosition + index * listItemHeight
          }
        });
      }else{
        nextPosition = 0;
      }
      
      // update renderModel, as well as bodyHeight of scroll area to encompass the largest y value
      var state = {
        renderModel: newRenderModel,
        bodyHeight : Math.min(nextPosition + renderModelSize * listItemHeight,this.state.dataModel.length*listItemHeight)
      };
      this.setState(state);
    }

    onScroll(e) {
      this.updateRenderModel(e.nativeEvent.contentOffset);
    }

    render() {
      var items = this.state.renderModel.map((renderItem,index) => {
        const itemStyle = {
          position       : 'absolute',
          height         : ITEM_SIZE,
          left           : 0,
          top            : renderItem.position,
          backgroundColor:"yellow",
          justifyContent:"center",
          alignItems:"center",
          width:width,
          padding:5,
          flexDirection:"row"
        };
        if(this._rowsCache[renderItem.key]){
            return this._rowsCache[renderItem.key];
        }else{
            let row = (
                <View key={renderItem.key} style={itemStyle}>
                    <LazyImage source={{uri:"http://pic.tsmp4.net/api/erciyuan/img.php"}}  />
                    <Text style={styles.item}>{renderItem.data}</Text>
                </View>
            )
            this._rowsCache[renderItem.key] = row;
            return row;
        }
      });
      return (
        <View style={styles.container}>
          <ScrollView  ref="scrollView" style={{flex: 1}} scrollEventThrottle={1} onScroll={this.onScroll.bind(this)}>
            <View style={{height: this.state.bodyHeight, width: width}}>
              {items}
            </View>
          </ScrollView>
        </View>
      );
    }
}

class LazyImage extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:false
        }
    }

    async componentDidMount(){
        this.setState({
            loading:true
        })
        await Image.prefetch(this.props.source.uri);
        this.setState({
            loading:false
        })
    }

    render(){
        if(this.state.loading){
            return (
                <View style={styles.image}></View>
            )
        }else{
            return (
                <Image source={this.props.source} style={styles.image}/>
            )
        }
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1
    },
    image:{
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor:"purple"
    }
})

