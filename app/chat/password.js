import { StyleSheet } from 'react-native';

export const passwordStyles = StyleSheet.create({

    Container: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
       
    },

    scrollContainer: {
        marginBottom: 10,
    },

    sliderContainer: {
        width: 100,
        height: 40,
    },

   button: {
        width: 100,
        height: 35,
        backgroundColor: '#FF1D58',
        borderWidth: 0.5,
        borderRadius: 20,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginTop: 5,
        flexDirection: 'row',
       
   },

   textInButton: {
    color: 'white',
    
   },

   buttonIcon: {
   
   }

  
})