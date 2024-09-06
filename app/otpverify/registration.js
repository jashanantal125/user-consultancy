import { StyleSheet } from 'react-native';


export const otpVerifyStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'whitesmoke',
        display: 'flex',
    },

    otpView: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 35,
        position: 'relative',
        top: '20%',
    },

    input: {
        width: 50,
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,
        marginLeft: 10,
    },

    otpSentText:{
        color: 'black',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: '40%',
        left: '10%',
    },

    button:{
        width: '85%',
        height: 35,
        backgroundColor: '#FF1D58',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: 'white',
        position: 'relative',
        top: '50%%',
        left: '7%',
    },

    buttonText: {
        color: 'white',
    },

    resendText:{
        position: 'relative',
        top: '60%',
        left: '7%',
        color: "black"
    },

    resendButton: {
        position: 'relative',
        top: '60%',
        left: '7%',
       
    }



})