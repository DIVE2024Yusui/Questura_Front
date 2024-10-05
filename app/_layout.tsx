import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync(); // SplashScreen 유지

export default function RootLayout() {
  const [loaded] = useFonts({
    // Pretendard 폰트 추가
    PretendardBlack: require("../assets/fonts/Pretendard-Black.otf"),
    PretendardBold: require("../assets/fonts/Pretendard-Bold.otf"),
    PretendardExtraBold: require("../assets/fonts/Pretendard-ExtraBold.otf"),
    PretendardExtraLight: require("../assets/fonts/Pretendard-ExtraLight.otf"),
    PretendardLight: require("../assets/fonts/Pretendard-Light.otf"),
    PretendardMedium: require("../assets/fonts/Pretendard-Medium.otf"),
    PretendardRegular: require("../assets/fonts/Pretendard-Regular.otf"),
    PretendardSemiBold: require("../assets/fonts/Pretendard-SemiBold.otf"),
    PretendardThin: require("../assets/fonts/Pretendard-Thin.otf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // 폰트가 로드되면 스플래시 화면을 숨김
    }
  }, [loaded]);

  if (!loaded) {
    return null; // 폰트 로드 중일 때는 아무것도 렌더링하지 않음
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="main"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="signUp/mbti" options={{ headerShown: false }} />
        <Stack.Screen name="signUp/profile" options={{ headerShown: false }} />
        <Stack.Screen
          name="signUp/completed"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="group/waiting"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="group/partyWaiting"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
