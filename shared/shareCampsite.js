import * as Linking from "expo-linking";
import { Alert, Share } from "react-native";

export const shareCampsite = async (campsite) => {
  if (!campsite) {
    return;
  }

  const campsiteUrl = Linking.createURL(`campsite/${campsite.id}`);
  const message = `${campsite.name}\n\n${campsite.description}\n\nView campsite: ${campsiteUrl}`;

  try {
    await Share.share({
      title: campsite.name,
      message,
      url: campsiteUrl,
    });
  } catch (error) {
    Alert.alert("Share failed", "Unable to open sharing right now.");
    console.log("Campsite share failed", error);
  }
};
