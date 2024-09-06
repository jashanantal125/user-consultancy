import { StyleSheet } from 'react-native';


export const editProfileStyles = StyleSheet.create({
    profileContainer: {
        backgroundColor: '#FF1D58',
        padding: 20,
        alignItems: 'center',
      },
      profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
      },
      profileName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      editButton: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
      },
      editText: {
        marginRight: 8,
        fontSize: 15,
        fontWeight: '600',
        color: '#FF1D58',
      },

      formContainer:{
        padding: 20,
      },

      button:{
      backgroundColor: '#FF1D58'
      }
});