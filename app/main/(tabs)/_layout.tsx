import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

// 이미지 import
import homeIcon from "../../image/home.png";
import nonHomeIcon from "../../image/unhome.png";
import chatIcon from "../../image/chat.png";
import nonChatIcon from "../../image/unchat.png";
import shopIcon from "../../image/shop.png";
import nonShopIcon from "../../image/unshop.png";
import profileIcon from "../../image/profile.png";
import nonProfileIcon from "../../image/unprofile.png";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2B2B2B", // 활성화된 탭의 텍스트 색상
        tabBarInactiveTintColor: "#CACACA", // 비활성화된 탭의 텍스트 색상
        headerShown: false, // 헤더 숨김
        tabBarStyle: {
          paddingHorizontal: 30, // 바텀바 좌우 공백 추가
          height: 90, // 바텀바 높이 조정
        },
        tabBarItemStyle: {
          marginHorizontal: 10, // 아이콘 간 간격 조정
        },
        tabBarLabelStyle: {
          fontSize: 14, // 텍스트 크기 증가
          fontFamily: "PretendardRegular", // PretendardRegular 폰트 적용
        },
      }}
    >
      {/* 메인 화면 */}
      <Tabs.Screen
        name="home/index"
        options={{
          title: "메인",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={focused ? homeIcon : nonHomeIcon}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      {/* 채팅 화면 */}
      <Tabs.Screen
        name="chat/index"
        options={{
          title: "채팅",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={focused ? chatIcon : nonChatIcon}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      {/* 상점 화면 */}
      <Tabs.Screen
        name="shop/index"
        options={{
          title: "상점",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={focused ? shopIcon : nonShopIcon}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      {/* 프로필 화면 */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "프로필",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={focused ? profileIcon : nonProfileIcon}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
