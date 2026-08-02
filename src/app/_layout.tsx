import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import {
    DrawerContentScrollView,
    DrawerItemList,
    type DrawerContentComponentProps,
} from "expo-router/build/react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import {
    Image,
    Pressable,
    StatusBar,
    Text,
    View,
    useColorScheme,
} from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

const DRAWER_BG = "#CCC4F1";
const DRAWER_HEADER_BG = "#4F32D7";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: DRAWER_BG }}>
      <DrawerContentScrollView
        {...props}
        style={{ flex: 1, backgroundColor: DRAWER_BG }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 0,
          paddingBottom: 0,
          paddingHorizontal: 0,
          backgroundColor: DRAWER_BG,
        }}
        contentInsetAdjustmentBehavior="never"
      >
        <View
          style={{
            backgroundColor: DRAWER_HEADER_BG,
            width: "100%",
            minHeight: 148 + insets.top,
            paddingTop: insets.top,
            margin: 0,
            paddingHorizontal: 30,
            paddingBottom: 46,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 12,
          }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 52, height: 52 }}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: "700",
              lineHeight: 28,
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            NuCamp
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: DRAWER_BG }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={DRAWER_HEADER_BG}
        translucent={false}
      />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={({ navigation, route }) => ({
            drawerStyle: {
              backgroundColor: DRAWER_BG,
              width: 360,
              borderRightWidth: 0,
              shadowColor: "transparent",
              shadowOpacity: 0,
              elevation: 0,
            },
            drawerContentStyle: { backgroundColor: DRAWER_BG },
            drawerContentContainerStyle: { backgroundColor: DRAWER_BG },
            drawerActiveTintColor: "#2D84E0",
            drawerInactiveTintColor: "#4B4563",
            drawerActiveBackgroundColor: "#C2D2FF",
            drawerInactiveBackgroundColor: DRAWER_BG,
            drawerItemStyle: {
              paddingHorizontal: 10,
              borderRadius: 0,
              marginHorizontal: 0,
              marginVertical: 0,
              minHeight: 64,
            },
            drawerLabelStyle: { marginLeft: 8, fontSize: 17 },
            headerStyle: { backgroundColor: "#5637DD" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "600", marginLeft: 6 },
            headerLeftContainerStyle: { paddingRight: 6 },
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 16 }}
                accessibilityRole="button"
                accessibilityLabel="Open navigation"
              >
                {route.name === "explore" ? (
                  <Icon
                    name="format-list-bulleted"
                    type="material"
                    size={24}
                    color="#fff"
                  />
                ) : route.name === "about" ? (
                  <Icon name="info" type="material" size={24} color="#fff" />
                ) : route.name === "contact" ? (
                  <Icon
                    name="contact-phone"
                    type="material"
                    size={24}
                    color="#fff"
                  />
                ) : route.name === "favorites" ? (
                  <Icon
                    name="favorite"
                    type="material"
                    size={24}
                    color="#fff"
                  />
                ) : route.name === "reservation" ? (
                  <Icon
                    name="tree"
                    type="font-awesome"
                    size={24}
                    color="#fff"
                  />
                ) : route.name === "login" ? (
                  <Icon
                    name="login"
                    type="material-community"
                    size={24}
                    color="#fff"
                  />
                ) : route.name === "register" ? (
                  <Icon
                    name="user-plus"
                    type="font-awesome"
                    size={24}
                    color="#fff"
                  />
                ) : (
                  <Icon
                    name="home-variant"
                    type="material-community"
                    size={24}
                    color="#fff"
                  />
                )}
              </Pressable>
            ),
          })}
        >
          <Drawer.Screen
            name="login"
            options={{
              title: "Login",
              drawerLabel: "Login",
              drawerIcon: ({ color, size }) => (
                <Icon
                  name="login"
                  type="material-community"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="register"
            options={{
              title: "Register",
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="index"
            options={{
              title: "Home",
              drawerLabel: "Home",
              drawerIcon: ({ color, size, focused }) => (
                <Icon
                  name={focused ? "home-variant" : "home-variant-outline"}
                  type="material-community"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="explore"
            options={{
              title: "Campsite Directory",
              drawerLabel: "Campsite Directory",
              drawerIcon: ({ color, size, focused }) => (
                <Icon
                  name={focused ? "format-list-bulleted" : "view-list"}
                  type="material"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="reservation"
            options={{
              title: "Reserve Campsite",
              drawerLabel: "Reserve Campsite",
              drawerIcon: ({ color, size }) => (
                <Icon
                  name="tree"
                  type="font-awesome"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="favorites"
            options={{
              title: "Favorite Campsites",
              drawerLabel: "Favorite Campsites",
              drawerIcon: ({ color, size }) => (
                <Icon
                  name="favorite"
                  type="material"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="about"
            options={{
              title: "About",
              drawerLabel: "About",
              drawerIcon: ({ color, size, focused }) => (
                <Icon
                  name={focused ? "info" : "info-outline"}
                  type="material"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="contact"
            options={{
              title: "Contact Us",
              drawerLabel: "Contact Us",
              drawerIcon: ({ color, size, focused }) => (
                <Icon
                  name={focused ? "contact-phone" : "contact-mail"}
                  type="material"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="campsite/[id]"
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer>
      </ThemeProvider>
    </Provider>
  );
}
