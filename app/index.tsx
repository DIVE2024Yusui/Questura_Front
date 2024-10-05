import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        안녕하세요! Questura에 오신 것을 환영합니다!
      </Text>
      <Text style={styles.subtitle}>로그인 또는 회원가입을 진행하세요.</Text>

      <View style={styles.buttonContainer}>
        {/* 로그인 버튼 추가 */}
        <Button
          title="로그인"
          onPress={() => router.push("/login")} // 로그인 페이지로 이동
        />
        <Button
          title="회원가입"
          onPress={() => router.push("/signUp/profile")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});
