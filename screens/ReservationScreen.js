import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Animated,
    Button,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import Loading from "../components/LoadingComponent";
import { SCREEN_LOADING_DELAY_MS } from "../shared/loadingDelay";
import { useScreenEnterAnimation } from "../shared/useScreenEnterAnimation";

import DateTimePicker, {
    DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

const PURPLE = "#5637DD";
const YEAR_OPTIONS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() + i,
);

const ReservationScreen = () => {
  const navigation = useNavigation();
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [campers, setCampers] = useState(1);
  const [hikeIn, setHikeIn] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reservationNotification, setReservationNotification] = useState(null);
  const { playEnterAnimation, enterStyle } = useScreenEnterAnimation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setIsScreenLoading(true);
      const timerId = setTimeout(() => {
        setIsScreenLoading(false);
        playEnterAnimation();
      }, SCREEN_LOADING_DELAY_MS);

      return () => clearTimeout(timerId);
    }, [playEnterAnimation]),
  );

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: "date",
        display: "calendar",
        positiveButton: { label: "OK" },
        negativeButton: { label: "CANCEL" },
        onChange: (event, selectedDate) => {
          if (event.type === "set" && selectedDate) {
            setDate(selectedDate);
          }
        },
      });
      return;
    }

    if (Platform.OS === "web") {
      setShowDatePicker((prev) => !prev);
      return;
    }

    setShowDatePicker(true);
  };

  const setWebDatePart = (part, value) => {
    const numericValue = Number(value);
    const year = part === "year" ? numericValue : date.getFullYear();
    const month = part === "month" ? numericValue : date.getMonth() + 1;
    const day = part === "day" ? numericValue : date.getDate();
    const daysInMonth = new Date(year, month, 0).getDate();
    const safeDay = Math.min(day, daysInMonth);

    setDate(new Date(year, month - 1, safeDay));
  };

  const handleReservation = () => {
    setReservationNotification({
      title: "Your Campsite Reservation Search",
      subtitle: `Search for ${formattedDate} requested`,
    });
  };

  const closeReservationSummary = () => {
    setReservationNotification(null);
    setCampers(1);
    setHikeIn(false);
    setDate(new Date());
    setShowDatePicker(false);
  };

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  if (isScreenLoading) {
    return <Loading />;
  }

  return (
    <Animated.View style={[styles.screenAnimated, enterStyle]}>
      <ScrollView contentContainerStyle={styles.container}>
        {reservationNotification && (
          <View style={styles.notificationOverlay} pointerEvents="none">
            <View style={styles.notificationCard}>
              <Text style={styles.notificationTitle}>
                {reservationNotification.title}
              </Text>
              <Text style={styles.notificationText}>
                {reservationNotification.subtitle}
              </Text>
            </View>
          </View>
        )}

        {reservationNotification && <View style={styles.notificationSpacer} />}

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Number of Campers:</Text>
          <Picker
            style={styles.picker}
            mode="dropdown"
            selectedValue={campers}
            onValueChange={(itemValue) => setCampers(itemValue)}
          >
            <Picker.Item label="1" value={1} />
            <Picker.Item label="2" value={2} />
            <Picker.Item label="3" value={3} />
            <Picker.Item label="4" value={4} />
            <Picker.Item label="5" value={5} />
            <Picker.Item label="6" value={6} />
          </Picker>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Hike In?</Text>
          <Switch
            style={styles.switchControl}
            value={hikeIn}
            trackColor={{ true: PURPLE, false: "#c7c7c7" }}
            onValueChange={(value) => setHikeIn(value)}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Date</Text>

          <Button
            onPress={openDatePicker}
            title={formattedDate}
            color={PURPLE}
            accessibilityLabel="Tap me to select a reservation date"
          />
        </View>

        {showDatePicker && Platform.OS !== "web" && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                setDate(selectedDate);
              }
              setShowDatePicker(false);
            }}
          />
        )}

        {showDatePicker && Platform.OS === "web" && (
          <View style={styles.webCalendarWrap}>
            <Picker
              style={styles.webPicker}
              selectedValue={date.getMonth() + 1}
              onValueChange={(value) => setWebDatePart("month", value)}
            >
              <Picker.Item label="01" value={1} />
              <Picker.Item label="02" value={2} />
              <Picker.Item label="03" value={3} />
              <Picker.Item label="04" value={4} />
              <Picker.Item label="05" value={5} />
              <Picker.Item label="06" value={6} />
              <Picker.Item label="07" value={7} />
              <Picker.Item label="08" value={8} />
              <Picker.Item label="09" value={9} />
              <Picker.Item label="10" value={10} />
              <Picker.Item label="11" value={11} />
              <Picker.Item label="12" value={12} />
            </Picker>

            <Picker
              style={styles.webPicker}
              selectedValue={date.getDate()}
              onValueChange={(value) => setWebDatePart("day", value)}
            >
              {Array.from(
                {
                  length: new Date(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    0,
                  ).getDate(),
                },
                (_, i) => i + 1,
              ).map((day) => (
                <Picker.Item
                  key={day}
                  label={String(day).padStart(2, "0")}
                  value={day}
                />
              ))}
            </Picker>

            <Picker
              style={styles.webPicker}
              selectedValue={date.getFullYear()}
              onValueChange={(value) => setWebDatePart("year", value)}
            >
              {YEAR_OPTIONS.map((year) => (
                <Picker.Item key={year} label={String(year)} value={year} />
              ))}
            </Picker>
          </View>
        )}

        <View style={styles.formRow}>
          <View style={styles.searchButtonWrap}>
            <Button
              onPress={() => handleReservation()}
              title="SEARCH AVAILABILITY"
              color={PURPLE}
              accessibilityLabel="Tap me to search for available campsites to reserve"
            />
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenAnimated: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingBottom: 24,
  },
  notificationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
    paddingTop: 2,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    alignSelf: "stretch",
  },
  notificationSpacer: {
    height: 52,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 3,
  },
  notificationText: {
    fontSize: 13,
    color: "#444",
  },
  formRow: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 18,
    marginVertical: 14,
  },
  formLabel: {
    fontSize: 16,
    color: "#121212",
    flex: 1,
  },
  picker: {
    width: 112,
    color: "#121212",
  },
  switchControl: {
    transform: [{ scaleX: 1.02 }, { scaleY: 1.02 }],
  },
  searchButtonWrap: {
    width: 200,
    alignSelf: "center",
  },
  webCalendarWrap: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginTop: -8,
    marginBottom: 12,
  },
  webPicker: {
    flex: 1,
    color: "#121212",
  },
});

export default ReservationScreen;
