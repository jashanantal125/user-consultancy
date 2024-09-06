import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { IconButton } from 'react-native-paper';
import { horoStyles } from './horo';
import DailyHoroDetails from '@/components/dailyhorodetails';
import useStore from '../store';

const ariesIcon = require("../../assets/images/ari.png");
const taurusIcon = require("../../assets/images/taurus.png");
// ... (other icons)

export default function Dailyhoroscope() {
  const [selectedSign, setSelectedSign] = useState('Aquarius');
  const [horoData, setHoroData] = useState<any[]>([]);
  const sid = useStore((state) => state.sid);

  const handlepress = (selectedButton: string) => {
    setSelectedSign(selectedButton);
  };

  useEffect(() => {
    getHoroData();
  }, []);

  const getHoroData = async () => {
    const res = await fetch(`http://65.0.52.105:8006/api/resource/horoscope?fields=["*"]&sid=${sid}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: "same-origin",
    });

    const data = await res.json();
    // console.log(data);
    setHoroData(data.data);
  };

  return (
    <View style={horoStyles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} style={horoStyles.container}>
        <View style={horoStyles.iconContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {horoData.map((row) => (
              <TouchableOpacity key={row.zodiac_sign} style={horoStyles.drawerItem} onPress={() => handlepress(row.zodiac_sign)}>
                <IconButton
                  icon={ariesIcon} // Change this to dynamic icon based on row.zodiac_sign
                  iconColor='white'
                  containerColor='#FF1D58'
                  mode='outlined'
                  size={40}
                />
                <Text style={horoStyles.drawerItemText}>{row.zodiac_sign}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <DailyHoroDetails sign={selectedSign} horoData={horoData} />
      </ScrollView>
    </View>
  );
}

  {/* <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('taurus')}>
              <IconButton
                icon={taurusIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Taurus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('gemini')}>
              <IconButton
                icon={geminiIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Gemini</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('cancer')}>
              <IconButton
                icon={cancerIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Cancer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('leo')}>
              <IconButton
                icon={leoIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Leo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('virgo')}>
              <IconButton
                icon={virgoIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Virgo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('libra')}>
              <IconButton
                icon={libraIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Libra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('scorpio')}>
              <IconButton
                icon={scorpioIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Scorpio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('sagittarius')}>
              <IconButton
                icon={sagittariusIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Sagittarius</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('capricorn')}>
              <IconButton
                icon={capricornIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Capricorn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('aquarius')}>
              <IconButton
                icon={aquariusIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Aquarius</Text>
            </TouchableOpacity>
            <TouchableOpacity style={horoStyles.drawerItem} onPress={() => handlepress('pisces')}>
              <IconButton
                icon={piscesIcon}
                iconColor='white'
                containerColor='#FF1D58'
                mode='outlined'
                size={40}
              />
              <Text style={horoStyles.drawerItemText}>Pisces</Text>
            </TouchableOpacity> */}