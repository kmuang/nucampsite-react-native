import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card } from "react-native-elements";
import Loading from "../components/LoadingComponent";
import { SCREEN_LOADING_DELAY_MS } from "../shared/loadingDelay";
import { PARTNERS } from "../shared/partners";
import { useScreenEnterAnimation } from "../shared/useScreenEnterAnimation";

const Mission = () => {
  return (
    <Card>
      <Card.Title>Our Mission</Card.Title>
      <Text style={styles.text}>
        We present a curated database of the best campsites in the vast woods
        and backcountry of the World Wide Web Wilderness. We increase access to
        adventure for the public while promoting safe and respectful use of
        resources. The expert wilderness trekkers on our staff personally verify
        each campsite to make sure that they are up to our standards. We also
        present a platform for campers to share reviews on campsites they have
        visited with each other.
      </Text>
    </Card>
  );
};

const RenderPartner = ({ item }) => {
  const [hasImageError, setHasImageError] = useState(false);
  const imageSource =
    typeof item.image === "string" ? { uri: item.image } : item.image;

  return (
    <View style={styles.partnerRow}>
      {!hasImageError && imageSource ? (
        <Image
          source={imageSource}
          style={styles.partnerImage}
          onError={() => setHasImageError(true)}
        />
      ) : (
        <View style={styles.partnerImageFallback}>
          <Text style={styles.partnerImageFallbackText}>
            {(item.name || "?").charAt(0)}
          </Text>
        </View>
      )}
      <View style={styles.partnerTextWrap}>
        <Text style={styles.partnerTitle}>{item.name}</Text>
        <Text style={styles.partnerDescription}>{item.description}</Text>
      </View>
    </View>
  );
};

const AboutScreen = () => {
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const { playEnterAnimation, enterStyle } = useScreenEnterAnimation({
    fromY: -80,
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
        }, 300);
      }, SCREEN_LOADING_DELAY_MS);

      return () => {
        clearTimeout(timerId);

        if (animationDelayTimerId) {
          clearTimeout(animationDelayTimerId);
        }
      };
    }, [playEnterAnimation]),
  );

  if (isScreenLoading) {
    return <Loading />;
  }

  return (
    <Animated.View style={[styles.screenAnimated, enterStyle]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Mission />
        <Card>
          <Card.Title>Community Partners</Card.Title>
          {PARTNERS.map((item) => (
            <RenderPartner key={item.id} item={item} />
          ))}
        </Card>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenAnimated: {
    flex: 1,
  },
  container: {
    paddingBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 6,
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  partnerImage: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginRight: 14,
    resizeMode: "contain",
  },
  partnerImageFallback: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  partnerImageFallbackText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4b4b4b",
  },
  partnerTextWrap: {
    flex: 1,
  },
  partnerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  partnerDescription: {
    fontSize: 15,
    color: "#777",
    lineHeight: 20,
  },
});

export default AboutScreen;
