import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    Animated,
    Easing,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Card } from "react-native-elements";
import Loading from "../components/LoadingComponent";
import { CAMPSITES } from "../shared/campsites";
import { SCREEN_LOADING_DELAY_MS } from "../shared/loadingDelay";
import { PARTNERS } from "../shared/partners";
import { PROMOTIONS } from "../shared/promotions";

const FeaturedItem = ({ item }) => {
  if (item) {
    return (
      <Animatable.View
        animation="rubberBand"
        duration={1000}
        iterationCount={1}
      >
        <Card containerStyle={{ padding: 0 }}>
          <ImageBackground source={item.image} style={styles.featuredImage}>
            <View style={{ justifyContent: "center", flex: 1 }}>
              <Text
                style={{ color: "white", textAlign: "center", fontSize: 20 }}
              >
                {item.name}
              </Text>
            </View>
          </ImageBackground>
          <Text style={{ margin: 20 }}>{item.description}</Text>
        </Card>
      </Animatable.View>
    );
  }

  return <View />;
};

const HomeScreen = () => {
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const cardAnimations = useMemo(
    () => [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
    [],
  );

  const runEnterAnimation = useCallback(() => {
    cardAnimations.forEach((animationValue) => {
      animationValue.setValue(0);
    });

    Animated.stagger(
      120,
      cardAnimations.map((animationValue) =>
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [cardAnimations]);

  useFocusEffect(
    useCallback(() => {
      setIsScreenLoading(true);

      const timerId = setTimeout(() => {
        setIsScreenLoading(false);
        runEnterAnimation();
      }, SCREEN_LOADING_DELAY_MS);

      return () => clearTimeout(timerId);
    }, [runEnterAnimation]),
  );

  const featCampsite = CAMPSITES.find((item) => item.featured);
  const featPromotion = PROMOTIONS.find((item) => item.featured);
  const featPartner = PARTNERS.find((item) => item.featured);

  const cardEnterStyle = (index) => ({
    opacity: cardAnimations[index],
    transform: [
      {
        translateY: cardAnimations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  });

  if (isScreenLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
        <Loading />
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView>
      <View>
        <Animated.View style={cardEnterStyle(0)}>
          <FeaturedItem item={featCampsite} />
        </Animated.View>
        <Animated.View style={cardEnterStyle(1)}>
          <FeaturedItem item={featPromotion} />
        </Animated.View>
        <Animated.View style={cardEnterStyle(2)}>
          <FeaturedItem item={featPartner} />
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
  featuredImage: {
    width: "100%",
    height: 220,
    justifyContent: "center",
  },
});

export default HomeScreen;
