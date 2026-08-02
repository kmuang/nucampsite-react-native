import { useRouter } from "expo-router";
import DirectoryScreen from "../../screens/DirectoryScreen";
import { CAMPSITES } from "../../shared/campsites";

export default function Directory() {
  const router = useRouter();

  return (
    <DirectoryScreen
      campsites={CAMPSITES}
      onPress={(campsiteId) => router.push(`/campsite/${campsiteId}`)}
    />
  );
}
