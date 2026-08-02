import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { fetchCampsites } from "../features/campsites/campsitesSlice";
import { fetchComments } from "../features/comments/commentsSlice";
import { fetchPartners } from "../features/partners/partnersSlice";
import { fetchPromotions } from "../features/promotions/promotionsSlice";
import { CAMPSITES } from "../shared/campsites";
import AboutScreen from "./AboutScreen";
import ContactUsScreen from "./ContactUsScreen";
import DirectoryScreen from "./DirectoryScreen";
import HomeScreen from "./HomeScreen";
import ReservationScreen from "./ReservationScreen";
import FavoriteScreen from "./FavoriteScreen"; 
import LoginScreen from './LoginScreen';

const Main = () => {
  const router = useRouter();
  const [activeScreen, setActiveScreen] = useState("Home");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCampsites());
    dispatch(fetchPromotions());
    dispatch(fetchPartners());
    dispatch(fetchComments());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Campsite Directory</Text>
      </View>
      <View style={styles.topBar}>
        <Pressable
          style={[
            styles.button,
            activeScreen === "Home" && styles.activeButton,
          ]}
          onPress={() => setActiveScreen("Home")}
        >
          <Text style={styles.buttonText}>Home</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            activeScreen === "Directory" && styles.activeButton,
          ]}
          onPress={() => setActiveScreen("Directory")}
        >
          <Text style={styles.buttonText}>Directory</Text>
        </Pressable>
      </View>
      <View style={styles.secondaryBar}>
        <Pressable
          style={[
            styles.button,
            activeScreen === "About" && styles.activeButton,
          ]}
          onPress={() => setActiveScreen("About")}
        >
          <Text style={styles.buttonText}>About</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            activeScreen === "Contact" && styles.activeButton,
          ]}
          onPress={() => setActiveScreen("Contact")}
        >
          <Text style={styles.buttonText}>Contact Us</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            activeScreen === "Reservation" && styles.activeButton,
          ]}
          onPress={() => setActiveScreen("Reservation")}
        >
          <Text style={styles.buttonText}>Reserve Campsite</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            activeScreen === "Login" && styles.activeButton,
          ]}
          onPress={() => setActiveScreen("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        {activeScreen === "Home" ? (
          <HomeScreen />
        ) : activeScreen === "Directory" ? (
          <DirectoryScreen
            campsites={CAMPSITES}
            onPress={(campsiteId) => router.push(`/campsite/${campsiteId}`)}
          />
        ) : activeScreen === "About" ? (
          <AboutScreen />
        ) : activeScreen === "Reservation" ? (
          <ReservationScreen />
        ) : activeScreen === "Login" ? (
          <LoginScreen />
        ) : (
          <ContactUsScreen />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    backgroundColor: "#5637DD",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  topBar: {
    flexDirection: "row",
    backgroundColor: "#6a58dd",
    paddingHorizontal: 10,
  },
  secondaryBar: {
    flexDirection: "row",
    backgroundColor: "#4d3ecc",
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
});

export default Main;