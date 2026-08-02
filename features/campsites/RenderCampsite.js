import { useRef, useState } from "react";
import {
    Alert,
    ImageBackground,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../favoritesSlice";
import { shareCampsite } from "../../shared/shareCampsite";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mgogajjg";

const RenderCampsite = ({ campsite }) => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites);
  const cardRef = useRef(null);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const playRubberBand = () => {
    cardRef.current?.animate("rubberBand", 1000);
  };

  const resetFeedbackForm = () => {
    setRating(5);
    setAuthor("");
    setComment("");
  };

  const handleFeedbackCommentsPress = () => {
    setIsFeedbackModalVisible(true);
  };

  const closeFeedbackModal = () => {
    if (isSubmittingFeedback) {
      return;
    }

    setIsFeedbackModalVisible(false);
    resetFeedbackForm();
  };

  const handleSubmitFeedback = async () => {
    if (!comment.trim()) {
      Alert.alert(
        "Missing Comment",
        "Please enter a comment before submitting.",
      );
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const payload = {
        author: author.trim() || "Anonymous",
        comment: comment.trim(),
        rating,
        campsiteId: campsite.id,
        campsiteName: campsite.name,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      Alert.alert("Feedback Submitted", "Thank you. Your comment was sent.");
      setIsFeedbackModalVisible(false);
      resetFeedbackForm();
    } catch (_error) {
      Alert.alert(
        "Submission Failed",
        "Could not send your feedback right now. Please try again.",
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (campsite) {
    const favorite = favoriteIds.includes(campsite.id);

    return (
      <Animatable.View ref={cardRef} style={[styles.card]}>
        <Pressable onPress={playRubberBand}>
          <ImageBackground source={campsite.image} style={styles.image}>
            <View style={styles.imageOverlay}>
              <Text style={styles.imageTitle}>{campsite.name}</Text>
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.description}>{campsite.description}</Text>
          <View style={styles.actionsRow}>
            <Pressable
              style={[
                styles.heartBadge,
                favorite ? styles.heartBadgeActive : styles.heartBadgeInactive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Toggle favorite campsite"
              onPress={() => {
                if (favorite) {
                  dispatch(removeFavorite(campsite.id));
                  return;
                }

                dispatch(addFavorite(campsite.id));
              }}
            >
              <Text style={styles.heartText}>{favorite ? "❤️" : "🤍"}</Text>
            </Pressable>
            <Pressable
              style={styles.penBadge}
              accessibilityRole="button"
              accessibilityLabel="Open feedback comments"
              onPress={handleFeedbackCommentsPress}
            >
              <Icon name="pencil" type="font-awesome" size={18} color="#fff" />
            </Pressable>
            <Pressable
              style={styles.shareBadge}
              accessibilityRole="button"
              accessibilityLabel={`Share ${campsite.name}`}
              onPress={() => shareCampsite(campsite)}
            >
              <Icon name="share" type="material" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent
          visible={isFeedbackModalVisible}
          onRequestClose={closeFeedbackModal}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.ratingLabel}>Rating: {rating}/5</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <Pressable
                    key={starValue}
                    onPress={() => setRating(starValue)}
                    style={styles.starPressable}
                    accessibilityRole="button"
                    accessibilityLabel={`Set rating to ${starValue} stars`}
                  >
                    <Icon
                      name={starValue <= rating ? "star" : "star-o"}
                      type="font-awesome"
                      size={36}
                      color="#f2c200"
                    />
                  </Pressable>
                ))}
              </View>

              <View style={styles.inputRow}>
                <Icon
                  name="person-outline"
                  type="ionicon"
                  size={22}
                  color="#444"
                />
                <TextInput
                  style={styles.textInput}
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="Author"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputRow}>
                <Icon
                  name="chatbubble-outline"
                  type="ionicon"
                  size={22}
                  color="#444"
                />
                <TextInput
                  style={styles.textInput}
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Comment"
                  placeholderTextColor="#999"
                />
              </View>

              <Pressable
                style={styles.submitButton}
                onPress={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmittingFeedback ? "SUBMITTING..." : "SUBMIT"}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.cancelButton,
                  isSubmittingFeedback && styles.buttonDisabled,
                ]}
                onPress={closeFeedbackModal}
                disabled={isSubmittingFeedback}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </Animatable.View>
    );
  }

  return <View />;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 220,
    justifyContent: "center",
  },
  imageOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  imageTitle: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
  },
  descriptionWrapper: {
    padding: 20,
    alignItems: "center",
  },
  description: {
    color: "#333",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  heartBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  penBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5637dd",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  shareBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d84e0",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  heartBadgeActive: {
    backgroundColor: "#ff5a5f",
  },
  heartBadgeInactive: {
    backgroundColor: "#f2f2f2",
  },
  heartText: {
    fontSize: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  ratingLabel: {
    color: "#f2c200",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 14,
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 14,
  },
  starPressable: {
    marginHorizontal: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#c7cfdb",
    marginBottom: 14,
    paddingBottom: 6,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    color: "#333",
    paddingVertical: 4,
  },
  submitButton: {
    backgroundColor: "#5637dd",
    borderRadius: 3,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
    elevation: 2,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#8f8f8f",
    borderRadius: 3,
    paddingVertical: 10,
    alignItems: "center",
    elevation: 2,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default RenderCampsite;
