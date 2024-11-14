import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';


export const mainPageStyles = StyleSheet.create({

    mainContainer: {
       flex: 1,
    },

    container: {
        flex: 35,
        backgroundColor: 'white',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    

    secondContainer: {
        flex: 65,
        backgroundColor: '#E5E4E2',
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        
    },

    loginText: {
        fontSize: 26,
        fontWeight: 'bold',
        top: '20%',
        fontFamily: 'serif'
    },


    title: {
        fontSize: 28,
        fontWeight: '400',
        top: '10%',
    },

    firstChat: {
        fontSize: 16,
    },

    firstChatContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: '75%',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        height: '5%',
        zIndex: 1,
        position: 'absolute',
        top: '32.5%',
        left: '12%',
        
    },

    phoneContainer: {
        backgroundColor: 'white',
        width: '75%',
        height: '6%',
        position: 'relative',
        bottom: '8%',
        // borderColor: '1E90FF',
        // borderWidth: 0.5,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        width: '75%',
        height: '6%',
        backgroundColor: 'black',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: 'red',
        position: 'relative',
        bottom: '5%'
        
    },

    textInButton: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },

    whiteArrow: {
        width: '7%',
        position: 'relative',
        height: '4%',
        bottom: '10%',
        left: '32%',
    },

    bottomContain: {
        height: '10%',
        position: 'absolute',
        display: 'flex-end',
        flexDirection: 'row',
        top: '80%',
        width: '20%',
        left: '15%',
        alignContent: 'center',
        alignItems: 'center',
    },

    lowerImage: {
        top: '0%'
    },

    numberHeading: {
        alignContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },

    firstText2: {
        alignContent: 'center',
        textAlign: 'center',
        fontSize: 14,
        color: 'white',
    },

    secondText2: {
        width: 110,
        alignContent: 'center',
        textAlign: 'center',
        fontSize: 14,
        color: 'white',
    },

    thirdText2: {
        alignContent: 'center',
        textAlign: 'center',
        fontSize: 14,
        color: 'white',
    },

    line: {
        height: '100%',
        width: 1,
        backgroundColor: 'white',
        marginHorizontal: 15,
    },
    flag: {
        width: 40,
        height: 35,
        borderRadius: 10,
    },

    formButton: {
        opacity: 0,
    },

    crew: {
        width: '50%',
        height: "30%"


    },

})