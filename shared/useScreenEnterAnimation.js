import { useCallback, useMemo } from "react";
import { Animated, Easing } from "react-native";

export const useScreenEnterAnimation = (config = {}) => {
  const {
    duration = 320,
    fromX = 0,
    fromY = 16,
    easing = Easing.out(Easing.cubic),
  } = config;

  const enterAnimation = useMemo(() => new Animated.Value(0), []);

  const playEnterAnimation = useCallback(() => {
    enterAnimation.setValue(0);

    Animated.timing(enterAnimation, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver: true,
    }).start();
  }, [duration, easing, enterAnimation]);

  const enterStyle = useMemo(
    () => ({
      opacity: enterAnimation,
      transform: [
        {
          translateX: enterAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [fromX, 0],
          }),
        },
        {
          translateY: enterAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [fromY, 0],
          }),
        },
      ],
    }),
    [enterAnimation, fromX, fromY],
  );

  return { playEnterAnimation, enterStyle };
};
