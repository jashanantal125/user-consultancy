import { StyleSheet } from "react-native";

export const afterLoginStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        position: 'relative',
        bottom: '50%',
    },

    title: {
        fontSize: 28,
        color: 'black',
        fontFamily: 'Arial',
        fontWeight: 'bold',
    },

    title2: {
        fontSize: 28,
        color: '#FF1D58',
        fontFamily: 'Arial',
        fontWeight: 'bold',
    },

    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    button:{
        width: 250,
        height: 35,
        backgroundColor: '#FF1D58',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderRadius: 20,
        borderColor: 'white',
        position: 'relative',
        top: '140%',
    },

    exploreText: {
        position: 'relative',
        top: '145%',
        opacity: 0.5,
    },

    buttonText: {
        color: 'white'
    },

})