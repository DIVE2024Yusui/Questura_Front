import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase"; // Firebase 초기화 파일에서 auth 가져오기

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/main");
    } catch (error) {
      console.error("로그인 에러: ", error);
      alert("로그인 실패: 이메일 또는 비밀번호가 잘못되었습니다.");
    }
  };

  const handleSignUp = () => {
    router.push("/signUp");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>사용자님의 정보를 입력해 주세요</Text>

        {/* 닉네임 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChangeText={setEmail}
            autoFocus={true}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* 비밀번호 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* 회원가입 버튼 */}
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpText}>회원가입하기</Text>
        </TouchableOpacity>

        {/* 제출하기 버튼 */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: keyboardVisible ? "#E3E5EB" : "#2B2B2B" },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>제출하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1, // 키보드가 올라와도 스크롤 가능하도록 설정
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  signUpText: {
    color: "#8A8A8A",
    textAlign: "center",
    marginVertical: 15,
  },
  loginButton: {
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
    marginBottom: 30, // 자연스럽게 하단에 배치되도록 변경
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
