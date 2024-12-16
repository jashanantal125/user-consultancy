import React, { useState } from "react";
import { View, Text, Modal, Platform, Button } from "react-native";
import {
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";

export const CustomDateTimePicker = ({
  visible,
  onClose,
  onDateChange,
  initialDate,
  minDate,
  maxDate,
  mode = "date", // 'date', 'time', or 'datetime'
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [dateMode, setDateMode] = useState(mode); // 'date', 'time', or 'datetime'

  const handleDateChange = (newDate) => {
    if (newDate >= minDate && newDate <= maxDate) {
      setSelectedDate(newDate);
      onDateChange(newDate); // Callback to parent
    }
  };

  const handleTimeChange = (time) => {
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(time.hour);
    updatedDate.setMinutes(time.minute);
    updatedDate.setSeconds(0); // Ensure seconds are reset to zero
    setSelectedDate(updatedDate);
    onDateChange(updatedDate); // Callback to parent
  };

  const openDatePicker = () => {
    if (Platform.OS === "ios") {
      onClose(); // Close modal for iOS and use internal DatePicker
    } else {
      DatePickerAndroid.open({
        date: selectedDate,
        minDate: minDate,
        maxDate: maxDate,
      }).then((res) => {
        if (res.action !== DatePickerAndroid.dismissedAction) {
          setSelectedDate(res.date);
          onDateChange(res.date); // Callback to parent
        }
      });
    }
  };

  const openTimePicker = () => {
    if (Platform.OS === "ios") {
      onClose(); // Close modal for iOS and use internal TimePicker
    } else {
      TimePickerAndroid.open({
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
      }).then((res) => {
        if (res.action !== TimePickerAndroid.dismissedAction) {
          handleTimeChange({ hour: res.hour, minute: res.minute });
        }
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: 300,
            height: 400,
          }}
        >
          {/* iOS Date and Time Picker */}
          {Platform.OS === "ios" && (
            <View>
              {dateMode === "date" && (
                <DatePickerIOS
                  date={selectedDate}
                  onDateChange={handleDateChange}
                  mode="date"
                  minimumDate={minDate}
                  maximumDate={maxDate}
                />
              )}
              {dateMode === "time" && (
                <View>
                  <TimePickerIOS
                    mode="time"
                    date={selectedDate}
                    onDateChange={handleTimeChange}
                  />
                </View>
              )}
              {dateMode === "datetime" && (
                <View>
                  <DatePickerIOS
                    date={selectedDate}
                    onDateChange={handleDateChange}
                    mode="date"
                    minimumDate={minDate}
                    maximumDate={maxDate}
                  />
                  <PaperButton onPress={openTimePicker}>
                    Select Time
                  </PaperButton>
                </View>
              )}
            </View>
          )}

          {/* Android Date and Time Picker */}
          {Platform.OS === "android" && (
            <View>
              {dateMode === "date" && (
                <PaperButton onPress={openDatePicker}>Select Date</PaperButton>
              )}
              {dateMode === "time" && (
                <PaperButton onPress={openTimePicker}>Select Time</PaperButton>
              )}
              {dateMode === "datetime" && (
                <View>
                  <PaperButton onPress={openDatePicker}>
                    Select Date
                  </PaperButton>
                  <PaperButton onPress={openTimePicker}>
                    Select Time
                  </PaperButton>
                </View>
              )}
            </View>
          )}

          <Text style={{ marginTop: 20 }}>
            Selected{" "}
            {dateMode === "datetime"
              ? "Date and Time"
              : dateMode === "time"
              ? "Time"
              : "Date"}
            : {selectedDate.toLocaleString()}
          </Text>

          <Button onPress={onClose}>Close</Button>
        </View>
      </View>
    </Modal>
  );
};
