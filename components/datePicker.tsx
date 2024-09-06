import DateTimePicker from 'react-native-ui-datepicker';
import dayjs, { Dayjs } from 'dayjs';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

export default function DatePick() {
  const [date, setDate] = useState<Dayjs>(dayjs());

  return (
    <View style={styles.container}>
      <DateTimePicker
        mode="single"
        date={date.toDate()}
        onChange={(params) => {
          if (params.date) {
            setDate(dayjs(params.date));
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
