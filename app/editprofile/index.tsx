import React, { useState, useEffect } from 'react';
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Form, FormItem, Picker } from 'react-native-form-component';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { editProfileStyles } from './editprofile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const man = require('../../assets/images/man.png');
import useStore from '../store';

export default function EditProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [pob, setPob] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [current, setCurrent] = useState('');
  const [profileName, setProfileName] = useState('Jashan Antal'); 
  const sid = useStore((state) => state.sid);

  useEffect(() => {
    getUser();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDob(date.toLocaleDateString());
    hideDatePicker();
  };

  

  const getUser = async () => {
    // var d = {
    //   "usr": "9877361109",
    //   "pwd": "Abcd@1234"
    // };
    const res = await fetch(`http://65.0.52.105:8006/api/resource/User/pandit@gmail.com?sid=${sid}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': localStorage.setItem('token')
        },
        
    });
    const data = await res.json();
    // console.log(data.data)
    setFirstName(data.data.first_name)
    setLastName(data.data.last_name)
    setGender(data.data.gender)
    setDob(data.data.birth_date)
    setPob(data.data.city)
    setCurrent(data.data.location)
    setProfileName(data.data.full_name)
  }

  const updateUser = async () => {
    const updatedData = {
     first_name : firstName,
     last_name : lastName,
     gender : gender,
     birth_date : dob,
     city : pob,
     location: current,
     full_name: profileName 
    };

    const res = await fetch(`http://65.0.52.105:8006/api/resource/User/pandit@gmail.com?sid=${sid}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': localStorage.setItem('token')
        },
        body: JSON.stringify(updatedData)
    });
    const data = await res.json();
    // console.log(data.data)
    Alert.alert('Details updated succesfully!')
     
    // } else {
    //   Alert.alert('Error', 'There was an error updating your details. Please try again.');
    // }

    // if (data.message === 'success') {
    //   Alert.alert('Success', 'Your details have been updated!');
    // }
    
  }


  // const buttonPressed = () => {
  //   console.log('button pressed!')
  // }
  






  return (
    <ScrollView>
      <View style={editProfileStyles.profileContainer}>
        <Image source={man} style={editProfileStyles.profileImage} />
        <Text style={editProfileStyles.profileName}>{profileName} </Text>
      </View>
      <View style={editProfileStyles.formContainer}>
        <Form buttonStyle={editProfileStyles.button} onButtonPress={updateUser} >
          <FormItem
            label="First Name"
            isRequired
            value={firstName}
            onChangeText={setFirstName}
            asterik
            errorBorderColor="#FF1D58"
          />
          <FormItem
            label="Last Name"
            isRequired
            value={lastName}
            onChangeText={setLastName}
            asterik
            errorBorderColor="#FF1D58"
          />
          {/* <Picker
            items={[
              { label: 'Male', value: 1 },
              { label: 'Female', value: 2 },
            ]}
            label="Gender"
            selectedValue={gender}
            onSelection={(item) => setGender(item.value)}
            asterik
          /> */}
          <FormItem
            label="Gender"
            isRequired
            value={gender}
            onChangeText={setGender}
            asterik
            errorBorderColor="#FF1D58"
          />
          <TouchableOpacity onPress={showDatePicker}>
            <FormItem
              label="Date of birth"
              isRequired
              value={dob}
              onPressIn={showDatePicker}
              asterik
              editable={false}
              errorBorderColor="#FF1D58"
            />
          </TouchableOpacity>
          <FormItem
            label="Place of birth"
            isRequired
            value={pob}
            onChangeText={setPob}
            asterik
      
            errorBorderColor="#FF1D58"
          />
           <FormItem
            label="Current Address"
            isRequired
            value={current}
            onChangeText={setCurrent}
            asterik
            errorBorderColor="#FF1D58"
          />

        </Form>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </ScrollView>
  );
}
