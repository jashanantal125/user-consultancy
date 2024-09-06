import { StyleSheet } from 'react-native';


export const horoStyles = StyleSheet.create({

    mainContainer: {
        
        alignItems: 'center',
        justifyContent: 'center',
    },
   
    container: {
       
        backgroundColor: 'whitesmoke',
        display: 'flex',
       
       
    },

    searchContainer: {

    },

   iconContainer: {
        flex:1,
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-between',
        marginBottom: 20
   },

  

   iconText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
   },

   bannerContainer: {
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
   },

   bannerImage: {
    alignContent: 'center',
    width: 400,
    height: 200,
    borderWidth: 0,
    borderRadius: 15,
   },

   scrollContainer: {
    
    paddingHorizontal: 15,
    width: 400,
    height: 230,
    
   },

   astrologersText: {
    padding: 10,
    fontSize: 16,
   },

   scrollActualContainer: {
    padding: 100,
   },

    drawerItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  
  drawerItemText: {
    textAlign: 'center',
    fontSize: 16,
    width: 80,
  },
  
})