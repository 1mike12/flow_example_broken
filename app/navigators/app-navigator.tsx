/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"
import {DefaultTheme, NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {navigationRef} from "./navigation-utilities"
import {HomeScreen} from "../screens/HomeScreen";

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type NavigatorParamList = {
   home: undefined,
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
/*
This navigator uses the native APIs UINavigationController on iOS and Fragment on Android so that navigation built with
createNativeStackNavigator will behave exactly the same and have the same performance characteristics as apps built natively
on top of those APIs. It also offers basic Web support using react-native-web.
 */
const Stack = createNativeStackNavigator<NavigatorParamList>()
const AppStack = () => {
   return (
      <Stack.Navigator
         screenOptions={{
            headerShown: false,
         }}
         initialRouteName="home"
      >
         <Stack.Screen name="home" component={HomeScreen}/>
      </Stack.Navigator>
   )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {
}

export const AppNavigator = (props: NavigationProps) => {
   // const colorScheme = useColorScheme()
   return (
      <NavigationContainer
         ref={navigationRef}
         theme={DefaultTheme}
         {...props}
      >
         <AppStack/>
      </NavigationContainer>
   )
}

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["home"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)