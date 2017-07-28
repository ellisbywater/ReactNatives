import React, { Component } from 'react'
import { View, Animated, PanResponder, Dimensions } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = 0.15 * SCREEN_WIDTH

class Deck extends Component {
    constructor(props){
        super(props);
        const position = new Animated.ValueXY()
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture)=>{
                position.setValue({ x: gesture.dx, y: gesture.dy})
            },
            onPanResponderRelease: (event, gesture)=>{
                if(gesture.dx > SWIPE_THRESHOLD){
                    this.forceSwipe('right')
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left')
                }
                this.resetPosition()
            }
        });

        this.state= {panResponder, position}
    }
    
    forceSwipe(direction){
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
        Animated.timing(this.state.position, {
            toValue: { x, y: 0},
            duration: 200
        }).start(()=> this.onSwipeComplete(direction))
    }

    onSwipeComplete(){
        const { onSwipeLeft, onSwipeRight } = this.props
        direction === 'right' ? onSwipeRight() : onSwipeLeft()
    }

    resetPosition(){
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0}
        }).start()
    }

    getCardStyle(){
        const { position }  = this.state
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
            outputRange: ['-120deg', '0deg', '120deg']
        })
        return {
            ...position.getLayout(),
            transform: [{rotate}]
        }
    }

    renderCards(){
        return this.props.data.map((item, index) =>{
            if(index === 0){
                return (
                    <Animated.View
                     key={item.id}
                     style={this.getCardStyle()}
                    {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }
            return this.props.renderCard(item)
        })
    }
    render(){
        return (
            <View>
                {this.renderCards()}
            </View>
        )
    }
}

export default Deck