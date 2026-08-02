import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    Animated,
    Easing,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/LoadingComponent";
import { removeFavorite } from "../features/favoritesSlice";
import { CAMPSITES } from "../shared/campsites";
import { SCREEN_LOADING_DELAY_MS } from "../shared/loadingDelay";
import { useScreenEnterAnimation } from "../shared/useScreenEnterAnimation";

const FavoriteRow = ({ campsite, onDeleteRequest, onOpen }) => {
  const router = useRouter();
  const swipeableRef = useRef(null);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [showDeleteAction, setShowDeleteAction] = useState(false);

  const handleDelete = () => {
    onDeleteRequest(campsite, () => {
      swipeableRef.current?.close();
      setShowDeleteAction(false);
      setIsDeleteHovered(false);
    });
  };

  const favoriteContent = (
    <Pressable
      onPress={() => router.push(`/campsite/${campsite.id}`)}
      style={styles.favoriteCard}
    >
      <Image source={campsite.image} style={styles.favoriteImage} />
      <View style={styles.favoriteBody}>
        <Text style={styles.favoriteTitle}>{campsite.name}</Text>
        <Text style={styles.favoriteDescription}>{campsite.description}</Text>
      </View>
      {Platform.OS === "web" ? (
        showDeleteAction ? (
          <Pressable
            onPress={handleDelete}
            onHoverIn={() => setIsDeleteHovered(true)}
            onHoverOut={() => setIsDeleteHovered(false)}
            style={[
              styles.inlineDeleteButton,
              isDeleteHovered && styles.inlineDeleteButtonHovered,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Delete favorite campsite ${campsite.name}`}
          >
            <Text
              style={[
                styles.inlineDeleteButtonText,
                isDeleteHovered && styles.inlineDeleteButtonTextHovered,
              ]}
            >
              Delete
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPressIn={() => setShowDeleteAction(true)}
            onPress={() => setShowDeleteAction(true)}
            onHoverIn={() => setShowDeleteAction(true)}
            style={styles.moreActionButton}
            accessibilityRole="button"
            accessibilityLabel={`Show delete action for ${campsite.name}`}
          >
            <View style={styles.moreDotsColumn}>
              <View style={styles.moreDot} />
              <View style={styles.moreDot} />
              <View style={styles.moreDot} />
            </View>
          </Pressable>
        )
      ) : null}
    </Pressable>
  );

  if (Platform.OS === "web") {
    return favoriteContent;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      onSwipeableWillOpen={onOpen}
      overshootRight={false}
      renderRightActions={() => (
        <Pressable
          onPress={handleDelete}
          style={styles.deleteAction}
          accessibilityRole="button"
          accessibilityLabel={`Delete favorite campsite ${campsite.name}`}
        >
          <Text style={styles.deleteActionText}>Delete</Text>
        </Pressable>
      )}
    >
      {favoriteContent}
    </Swipeable>
  );
};

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.favorites);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { playEnterAnimation, enterStyle } = useScreenEnterAnimation({
    fromX: 260,
    fromY: 0,
    duration: 560,
    easing: Easing.out(Easing.exp),
  });

  const favoriteCampsites = CAMPSITES.filter((campsite) =>
    favoriteIds.includes(campsite.id),
  );

  const requestDeleteFavorite = (campsite, onCloseSwipe) => {
    setPendingDelete({ campsite, onCloseSwipe });
  };

  const cancelDeleteFavorite = () => {
    pendingDelete?.onCloseSwipe?.();
    setPendingDelete(null);
  };

  const confirmDeleteFavorite = () => {
    if (!pendingDelete) {
      return;
    }

    dispatch(removeFavorite(pendingDelete.campsite.id));
    pendingDelete.onCloseSwipe?.();
    setPendingDelete(null);
  };

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

  if (isScreenLoading) {
    return <Loading />;
  }

  if (!favoriteCampsites.length) {
    return (
      <Animated.View style={[styles.container, enterStyle]}>
        <Text style={styles.title}>Favorite Campsites</Text>
        <Text style={styles.message}>No favorite campsites yet.</Text>
      </Animated.View>
    );
  }

  return (
    <>
      <Animated.View style={[styles.screenAnimated, enterStyle]}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={favoriteCampsites}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <FavoriteRow
              campsite={item}
              onDeleteRequest={requestDeleteFavorite}
              onOpen={() => {}}
            />
          )}
        />
      </Animated.View>
      <Modal
        animationType="fade"
        transparent
        visible={Boolean(pendingDelete)}
        onRequestClose={cancelDeleteFavorite}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Favorite?</Text>
            <Text style={styles.modalMessage}>
              {pendingDelete
                ? `Are you sure you wish to delete the favorite campsite ${pendingDelete.campsite.name}?`
                : ""}
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={cancelDeleteFavorite}
                style={styles.modalButton}
              >
                <Text style={styles.modalCancelText}>CANCEL</Text>
              </Pressable>
              <Pressable
                onPress={confirmDeleteFavorite}
                style={styles.modalButton}
              >
                <Text style={styles.modalOkText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  screenAnimated: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  listContent: {
    backgroundColor: "#fff",
  },
  favoriteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: "hidden",
  },
  favoriteImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  favoriteBody: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 6,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  favoriteDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 78,
  },
  deleteAction: {
    width: 108,
    backgroundColor: "#c40000",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteActionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  inlineDeleteButton: {
    backgroundColor: "#c40000",
    marginLeft: 12,
    marginRight: -16,
    marginVertical: -14,
    minWidth: 108,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  inlineDeleteButtonHovered: {
    backgroundColor: "#fff",
  },
  inlineDeleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  inlineDeleteButtonTextHovered: {
    color: "#c40000",
  },
  moreActionButton: {
    width: 42,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  moreDotsColumn: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  moreDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#8b8b8b",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(128, 128, 128, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 24,
  },
  modalButton: {
    paddingVertical: 8,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4c85c5",
  },
  modalOkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4c85c5",
  },
});

export default FavoritesScreen;
