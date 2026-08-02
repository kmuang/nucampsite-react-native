import {
    Stack,
    useFocusEffect,
    useLocalSearchParams,
    useRouter,
} from "expo-router";
import { useCallback, useMemo } from "react";
import {
    Animated,
    Easing,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import RenderCampsite from "../../../features/campsites/RenderCampsite";
import { CAMPSITES } from "../../../shared/campsites";

const FEEDBACK_COMMENTS = [
  {
    id: "feedback-1",
    text: "A wonderful place to reconnect with nature.",
    rating: 5,
    author: "Jordan Runn",
    date: "2019-08-04T20:11Z",
  },
  {
    id: "feedback-2",
    text: "The stars at night were a revelation!",
    rating: 4,
    author: "Ann Dabramov",
    date: "2018-07-23T19:44Z",
  },
  {
    id: "feedback-3",
    text: "What a magnificent view!",
    rating: 5,
    author: "Tinus Lorvaldes",
    date: "2018-10-25T16:30Z",
  },
  {
    id: "feedback-4",
    text: "The campground was beautiful, but the bugs could bite sometimes.",
    rating: 4,
    author: "Brennen Ech",
    date: "2017-06-17T03:33Z",
  },
];

export default function CampsiteDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const campsiteId = Number(params.id);
  const campsite = CAMPSITES.find((item) => item.id === campsiteId);
  const cardAnimations = useMemo(
    () => [new Animated.Value(0), new Animated.Value(0)],
    [],
  );

  useFocusEffect(
    useCallback(() => {
      cardAnimations.forEach((animationValue) => {
        animationValue.setValue(0);
      });

      Animated.sequence([
        Animated.delay(180),
        Animated.stagger(
          130,
          cardAnimations.map((animationValue) =>
            Animated.timing(animationValue, {
              toValue: 1,
              duration: 560,
              easing: Easing.out(Easing.exp),
              useNativeDriver: true,
            }),
          ),
        ),
      ]).start();
    }, [cardAnimations]),
  );

  if (!campsite) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Campsite not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: campsite.name,
          headerLeft: () => (
            <Pressable onPress={() => router.push("/explore")}>
              <Text style={styles.headerBackButton}>←</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView>
        <Animated.View
          style={[
            styles.cardAnimated,
            {
              opacity: cardAnimations[0],
              transform: [
                {
                  translateY: cardAnimations[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-120, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <RenderCampsite campsite={campsite} />
        </Animated.View>

        <Animated.View
          style={[
            styles.commentsCard,
            {
              opacity: cardAnimations[1],
              transform: [
                {
                  translateY: cardAnimations[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [90, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.commentsTitle}>Comments</Text>
          {FEEDBACK_COMMENTS.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentRating}>
                {"⭐".repeat(comment.rating)}
              </Text>
              {comment.author && comment.date ? (
                <Text style={styles.commentAuthor}>
                  -- {comment.author}, {comment.date}
                </Text>
              ) : null}
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  headerBackButton: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 16,
  },
  errorText: {
    color: "#333",
    fontSize: 18,
    margin: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 18,
    color: "#333",
  },
  cardAnimated: {
    marginBottom: 8,
  },
  commentsCard: {
    marginHorizontal: 12,
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 18,
    paddingHorizontal: 12,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
  },
  commentItem: {
    marginHorizontal: 8,
    marginBottom: 16,
  },
  commentText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 6,
  },
  commentRating: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontWeight: "600",
  },
  commentAuthor: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
    lineHeight: 18,
  },
});
