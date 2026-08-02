import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, Icon } from "react-native-elements";
import Loading from "../components/LoadingComponent";
import { SCREEN_LOADING_DELAY_MS } from "../shared/loadingDelay";
import { useScreenEnterAnimation } from "../shared/useScreenEnterAnimation";

const ADMIN_EMAIL = "campsites@nucamp.co";

const ContactUsScreen = () => {
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [isEmailButtonHovered, setIsEmailButtonHovered] = useState(false);
  const { playEnterAnimation, enterStyle } = useScreenEnterAnimation({
    fromY: -90,
    duration: 520,
  });

  useFocusEffect(
    useCallback(() => {
      setIsScreenLoading(true);
      let animationDelayTimerId;

      const timerId = setTimeout(() => {
        setIsScreenLoading(false);

        animationDelayTimerId = setTimeout(() => {
          playEnterAnimation();
        }, 160);
      }, SCREEN_LOADING_DELAY_MS);

      return () => {
        clearTimeout(timerId);

        if (animationDelayTimerId) {
          clearTimeout(animationDelayTimerId);
        }
      };
    }, [playEnterAnimation]),
  );

  const sendEmail = async () => {
    const mailtoUrl = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(
      "NuCamp Contact Request",
    )}`;

    const supported = await Linking.canOpenURL(mailtoUrl);
    if (!supported) {
      Alert.alert(
        "Email unavailable",
        "No email app is available on this device.",
      );
      return;
    }

    await Linking.openURL(mailtoUrl);
  };

  if (isScreenLoading) {
    return <Loading />;
  }

  return (
    <Animated.View style={[styles.screenAnimated, enterStyle]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card
          containerStyle={styles.cardContainer}
          wrapperStyle={styles.cardWrapper}
        >
          <Card.Title titleStyle={styles.cardTitle}>
            Contact Information
          </Card.Title>
          <Text style={styles.text}>1 Nucamp Way</Text>
          <Text style={styles.text}>Seattle, WA 98001</Text>
          <Text style={styles.text}>U.S.A.</Text>
          <Text style={styles.text}>Phone: 1-206-555-1234</Text>
          <Text style={styles.text}>Email: campsites@nucamp.co</Text>
          <View style={styles.buttonWrap}>
            <Pressable
              style={[
                styles.emailButton,
                isEmailButtonHovered && styles.emailButtonHovered,
              ]}
              onPress={sendEmail}
              onHoverIn={() => setIsEmailButtonHovered(true)}
              onHoverOut={() => setIsEmailButtonHovered(false)}
            >
              <Icon
                name="envelope-o"
                type="font-awesome"
                color="#fff"
                size={18}
                containerStyle={styles.emailIcon}
              />
              <Text style={styles.emailButtonText}>Send Email</Text>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenAnimated: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 28,
  },
  cardContainer: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 2,
    padding: 0,
  },
  cardWrapper: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 26,
  },
  cardTitle: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    marginBottom: 2,
  },
  buttonWrap: {
    alignItems: "center",
    marginTop: 30,
  },
  emailButton: {
    backgroundColor: "#5637DD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    minWidth: 250,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  emailButtonHovered: {
    backgroundColor: "#6f52ee",
  },
  emailIcon: {
    marginRight: 10,
  },
  emailButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

export default ContactUsScreen;
