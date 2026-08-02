import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CheckBox, Icon, Input } from "react-native-elements";
import { getUserInfo, setUserInfo } from "../shared/userInfoStorage";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen = () => {
  const router = useRouter();
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [activeTab, setActiveTab] = useState("Login");

  // Shared form fields & registration states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("front");
  const [isRegistering, setIsRegistering] = useState(false);

  const profileImageSource = imageUri
    ? { uri: imageUri }
    : require("../assets/images/logo.png");

  const trimmedUsername = username.trim();
  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const isRegisterFormReady =
    trimmedUsername.length >= 3 &&
    !/\s/.test(trimmedUsername) &&
    password.length >= 8 &&
    confirmPassword === password &&
    Boolean(trimmedFirstName) &&
    Boolean(trimmedLastName) &&
    EMAIL_PATTERN.test(normalizedEmail);
  const isRegisterDisabled = isRegistering || !isRegisterFormReady;

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userinfo = await getUserInfo();
        if (!userinfo?.remember) {
          return;
        }
        setUsername(userinfo.username ?? "");
        setPassword(userinfo.password ?? "");
        setRemember(true);
      } catch (error) {
        console.log("Could not load user info", error);
      }
    };
    loadUserInfo();
  }, []);

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      Alert.alert("Missing information", "Please enter your username and password.");
      return;
    }

    try {
      const storedUserInfo = await getUserInfo();
      if (!storedUserInfo) {
        Alert.alert("Account not found", "Please register before logging in.");
        return;
      }

      if (
        storedUserInfo.username !== trimmedUsername ||
        storedUserInfo.password !== password
      ) {
        Alert.alert("Login failed", "Username or password is incorrect.");
        return;
      }

      await setUserInfo({
        ...storedUserInfo,
        remember,
      });

      Alert.alert("Login successful", `Welcome, ${storedUserInfo.firstName}!`);
      router.replace("/");
    } catch (error) {
      Alert.alert("Login failed", "Unable to log in right now.");
      console.log("Could not log in", error);
    }
  };

  const validateForm = () => {
    if (
      !trimmedUsername ||
      !password ||
      !confirmPassword ||
      !trimmedFirstName ||
      !trimmedLastName ||
      !normalizedEmail
    ) {
      Alert.alert("Missing information", "Please complete all fields.");
      return false;
    }

    if (trimmedUsername.length < 3 || /\s/.test(trimmedUsername)) {
      Alert.alert(
        "Invalid username",
        "Username must be at least 3 characters and cannot contain spaces."
      );
      return false;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak password",
        "Password must be at least 8 characters long."
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please confirm your password.");
      return false;
    }

    return true;
  };

  const processImage = async (imgUri) => {
    try {
      const processedImage = await ImageManipulator.manipulateAsync(
        imgUri,
        [{ resize: { width: 400, height: 400 } }],
        { format: ImageManipulator.SaveFormat.PNG }
      );
      console.log("Processed image:", processedImage);
      setImageUri(processedImage.uri);
    } catch (error) {
      console.log("Error processing image:", error);
      Alert.alert("Image Error", "Could not process image.");
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult = cameraPermission?.granted
        ? cameraPermission
        : await requestCameraPermission();

      if (!permissionResult?.granted) {
        Alert.alert(
          "Permission required",
          "Camera permission is required to take a profile photo."
        );
        return;
      }

      setCameraReady(false);
      setShowCamera(true);
    } catch (error) {
      Alert.alert("Camera error", "Unable to open the camera.");
      console.log("Camera permission error", error);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !cameraReady) {
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      processImage(photo.uri);
      setShowCamera(false);
    } catch (error) {
      Alert.alert("Camera error", "Unable to take a photo.");
      console.log("Camera capture error", error);
    }
  };

  const getImageFromGallery = async () => {
    try {
      const permissionsResult =
        Platform.OS === "web"
          ? { granted: true }
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionsResult.granted) {
        Alert.alert(
          "Permission required",
          "Media library permission is required to choose a profile photo."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets?.length) {
        processImage(pickerResult.assets[0].uri);
        setShowCamera(false);
      }
    } catch (error) {
      Alert.alert("Image picker error", "Unable to select an image.");
      console.log("Image picker error", error);
    }
  };

  const saveRegistration = async () => {
    const trimmedUsername = username.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const registrationData = {
      username: trimmedUsername,
      password,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: normalizedEmail,
      remember,
      imageUri,
    };

    await setUserInfo(registrationData);
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);

    try {
      await saveRegistration();
      setPassword("");
      setConfirmPassword("");
      Alert.alert(
        "Registration complete",
        "Your account has been saved. Please log in to continue."
      );
      setActiveTab("Login");
    } catch (error) {
      Alert.alert("Registration failed", "Unable to save your account.");
      console.log("Registration save failed", error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "Login" ? (
          <View style={styles.formArea}>
            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              containerStyle={styles.formInput}
              leftIconContainerStyle={styles.formIcon}
              inputStyle={styles.inputText}
              placeholderTextColor="#9a9a9a"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              leftIcon={{ type: "font-awesome", name: "key" }}
              containerStyle={styles.formInput}
              leftIconContainerStyle={styles.formIcon}
              inputStyle={styles.inputText}
              placeholderTextColor="#9a9a9a"
            />
            <CheckBox
              title="Remember Me"
              checked={remember}
              onPress={() => setRemember(!remember)}
              containerStyle={styles.formCheckbox}
              uncheckedColor="#c7c7c7"
              checkedColor="#5637DD"
            />
            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Icon
                name="login"
                type="material-community"
                color="#fff"
                size={16}
                containerStyle={styles.loginIcon}
              />
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
            <Pressable
              style={styles.registerBox}
              onPress={() => setActiveTab("Register")}
            >
              <Icon
                name="user-plus"
                type="font-awesome"
                color="#1738e8"
                size={16}
                containerStyle={styles.registerIcon}
              />
              <Text style={styles.registerText}>Register</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.formArea}>
            <View style={styles.avatarRow}>
              <Image source={profileImageSource} style={styles.avatar} />
              <View style={styles.imageButtons}>
                <Pressable style={styles.imageButton} onPress={openCamera}>
                  <Text style={styles.imageButtonText}>Camera</Text>
                </Pressable>
                <Pressable style={styles.imageButton} onPress={getImageFromGallery}>
                  <Text style={styles.imageButtonText}>Gallery</Text>
                </Pressable>
              </View>
            </View>

            {showCamera && (
              <View style={styles.cameraPanel}>
                <CameraView
                  ref={cameraRef}
                  style={styles.cameraPreview}
                  facing={cameraFacing}
                  mode="picture"
                  onCameraReady={() => setCameraReady(true)}
                  onMountError={(event) => {
                    Alert.alert("Camera error", event.message);
                    setShowCamera(false);
                  }}
                />
                <View style={styles.cameraActions}>
                  <Pressable
                    style={styles.cameraActionButton}
                    onPress={() =>
                      setCameraFacing((current) =>
                        current === "front" ? "back" : "front"
                      )
                    }
                  >
                    <Icon
                      name="camera-reverse"
                      type="material-community"
                      color="#fff"
                      size={18}
                    />
                    <Text style={styles.cameraActionText}>Flip</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.cameraActionButton,
                      styles.captureButton,
                      !cameraReady && styles.disabledButton,
                    ]}
                    onPress={takePhoto}
                    disabled={!cameraReady}
                  >
                    <Icon name="camera" type="font-awesome" color="#fff" size={16} />
                    <Text style={styles.cameraActionText}>Capture</Text>
                  </Pressable>
                  <Pressable
                    style={styles.cameraActionButton}
                    onPress={() => setShowCamera(false)}
                  >
                    <Icon name="close" type="material" color="#fff" size={18} />
                    <Text style={styles.cameraActionText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="username"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              containerStyle={styles.formInput}
              leftIconContainerStyle={styles.formIcon}
              inputStyle={styles.inputText}
              placeholderTextColor="#9a9a9a"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCorrect={false}
              textContentType="newPassword"
              autoCapitalize="none"
              leftIcon={{ type: "font-awesome", name: "key" }}
              containerStyle={styles.formInput}
              leftIconContainerStyle={styles.formIcon}
              inputStyle={styles.inputText}
              placeholderTextColor="#9a9a9a"
            />
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCorrect={false}
              textContentType="newPassword"
              autoCapitalize="none"
              leftIcon={{ type: "font-awesome", name: "key" }}
              containerStyle={styles.formInput}
              leftIconContainerStyle={styles.formIcon}
              inputStyle={styles.inputText}
              placeholderTextColor="#9a9a9a"
            />
            <Input
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              textContentType="givenName"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              containerStyle={styles.formInput}
              leftIconContainerStyle={styles.formIcon}
              inputStyle={styles.inputText}
              placeholderTextColor="#9a9a9a"
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              textContentType="familyName"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              containerStyle={styles.formInput}
              leftIconContainerStyle={styles.formIcon}
              inputStyle={styles.inputText}
              placeholderTextColor="#9a9a9a"
            />
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              leftIcon={{ type: "font-awesome", name: "envelope-o" }}
              containerStyle={styles.formInput}
              leftIconContainerStyle={styles.formIcon}
              inputStyle={styles.inputText}
              placeholderTextColor="#9a9a9a"
            />
            <CheckBox
              title="Remember Me"
              checked={remember}
              onPress={() => setRemember(!remember)}
              containerStyle={styles.formCheckbox}
              uncheckedColor="#c7c7c7"
              checkedColor="#5637DD"
            />
            <Pressable
              style={[
                styles.registerButton,
                isRegisterDisabled && styles.disabledButton,
              ]}
              onPress={handleRegister}
              disabled={isRegisterDisabled}
            >
              <Icon
                name="user-plus"
                type="font-awesome"
                color="#fff"
                size={16}
                containerStyle={styles.registerIcon}
              />
              <Text style={styles.registerButtonText}>
                {isRegistering ? "Saving..." : "Register"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <View style={styles.tabBar}>
        <Pressable
          style={activeTab === "Login" ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab("Login")}
        >
          <Icon
            name="login"
            type="material-community"
            color={activeTab === "Login" ? "#fff" : "#8b84a8"}
            size={16}
          />
          <Text
            style={
              activeTab === "Login" ? styles.activeTabText : styles.inactiveTabText
            }
          >
            Login
          </Text>
        </Pressable>
        <Pressable
          style={activeTab === "Register" ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab("Register")}
        >
          <Icon
            name="user-plus"
            type="font-awesome"
            color={activeTab === "Register" ? "#fff" : "#8b84a8"}
            size={16}
          />
          <Text
            style={
              activeTab === "Register"
                ? styles.activeTabText
                : styles.inactiveTabText
            }
          >
            Register
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
  },
  formArea: {
    flex: 1,
    paddingTop: 6,
  },
  formIcon: {
    marginRight: 6,
  },
  formInput: {
    paddingHorizontal: 2,
    paddingVertical: 0,
    marginBottom: -2,
  },
  inputText: {
    fontSize: 13,
    paddingVertical: 4,
  },
  formCheckbox: {
    marginVertical: 4,
    backgroundColor: "transparent",
    alignSelf: "center",
    padding: 0,
  },
  loginButton: {
    backgroundColor: "#5637DD",
    marginHorizontal: 24,
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loginIcon: {
    marginRight: 6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  registerBox: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  registerIcon: {
    marginRight: 6,
  },
  registerText: {
    color: "#1738e8",
    fontSize: 13,
    fontWeight: "500",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  imageButtons: {
    flexDirection: "row",
    gap: 14,
  },
  imageButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 3,
    minWidth: 74,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  cameraPanel: {
    marginBottom: 12,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#1f1f29",
  },
  cameraPreview: {
    width: "100%",
    aspectRatio: 1,
  },
  cameraActions: {
    flexDirection: "row",
    padding: 8,
    gap: 8,
    backgroundColor: "#1f1f29",
  },
  cameraActionButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 4,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  captureButton: {
    backgroundColor: "#5637DD",
  },
  disabledButton: {
    opacity: 0.55,
  },
  cameraActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#5637DD",
    marginHorizontal: 24,
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  tabBar: {
    flexDirection: "row",
    height: 48,
  },
  inactiveTab: {
    flex: 1,
    backgroundColor: "#cfc6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveTabText: {
    marginTop: 2,
    color: "#8b84a8",
    fontSize: 12,
  },
  activeTab: {
    flex: 1,
    backgroundColor: "#5a39db",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabText: {
    marginTop: 2,
    color: "#fff",
    fontSize: 12,
  },
});

export default LoginScreen;