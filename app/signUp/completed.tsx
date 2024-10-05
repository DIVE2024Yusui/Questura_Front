import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function CompletedPage() {
  const router = useRouter();

  const handleGoToMain = () => {
    router.replace("/main");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>회원가입이 완료되었습니다!</Text>
      <Text style={styles.subText}>
        축하합니다. 이제 메인 화면으로 이동할 수 있습니다.
      </Text>

      <Button title="메인으로 이동" onPress={handleGoToMain} color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
});
