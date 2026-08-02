import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Animated,
    Easing,
    FlatList,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Loading from "../components/LoadingComponent";
import { SCREEN_LOADING_DELAY_MS } from "../shared/loadingDelay";
import { useScreenEnterAnimation } from "../shared/useScreenEnterAnimation";

const DirectoryScreen = ({ campsites = [], onPress }) => {
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [hoveredCampsiteId, setHoveredCampsiteId] = useState(null);
  const { playEnterAnimation, enterStyle } = useScreenEnterAnimation({
    fromX: 260,
    fromY: 0,
    duration: 560,
    easing: Easing.out(Easing.exp),
  });

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

  const renderDirectoryItem = ({ item: campsite }) => {
    const isHovered = hoveredCampsiteId === campsite.id;

    return (
      <Pressable
        onPress={() => onPress?.(campsite.id)}
        style={styles.cardPressable}
        onHoverIn={() => setHoveredCampsiteId(campsite.id)}
        onHoverOut={() => setHoveredCampsiteId(null)}
      >
        <ImageBackground source={campsite.image} style={styles.card}>
          <View style={[styles.overlay, isHovered && styles.hoverOverlay]} />
          <View style={styles.cardContent}>
            <Text style={styles.title}>{campsite.name}</Text>
            <Text style={styles.subtitle}>{campsite.description}</Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  if (isScreenLoading) {
    return <Loading />;
  }

  return (
    <Animated.View style={[styles.screenAnimated, enterStyle]}>
      <FlatList
        data={campsites}
        renderItem={renderDirectoryItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenAnimated: {
    flex: 1,
  },
  cardShell: {
    backgroundColor: "#fff",
  },
  cardPressable: {
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  hoverOverlay: {
    backgroundColor: "rgba(128, 128, 128, 0.45)",
  },
  cardContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#f1f1f1",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 22,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default DirectoryScreen;
