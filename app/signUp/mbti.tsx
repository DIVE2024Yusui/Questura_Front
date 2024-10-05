import React, { useState } from "react";
import {
  View,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MbtiQuestions, { Answers } from "./components/MbtiQuestions";
import { createUserProfile } from "../api/firestore";
import { uploadImageToFirebase } from "../api/firebaseStorage";
import { auth, signInWithEmailAndPassword } from "../api/firebase"; // Firebase Authentication
import { createUserWithEmailAndPassword } from "firebase/auth"; // 함수 가져오기

export default function MbtiPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const { nickname, email, password, nationality, profileImage } =
    useLocalSearchParams();

  // 유효성 검사 함수
  const validateMbti = () => {
    const newErrors: any = {};
    Object.keys(answers).forEach((key) => {
      if (!answers[key]) {
        newErrors.mbti = "모든 MBTI 질문에 응답해주세요.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // MBTI 결과 계산 함수
  const calculateResult = (): string => {
    let E = 0,
      I = 0,
      S = 0,
      N = 0,
      T = 0,
      F = 0,
      J = 0,
      P = 0;

    Object.keys(answers).forEach((key) => {
      const answer = answers[parseInt(key)];
      const category = key;
      if (category === "EvsI") answer === "A" ? E++ : I++;
    });

    return `${E > I ? "E" : "I"}${S > N ? "S" : "N"}${T > F ? "T" : "F"}${
      J > P ? "J" : "P"
    }`;
  };

  const handleSubmit = async () => {
    if (!validateMbti()) return; // 유효성 검사 통과하지 않으면 중지
    setLoading(true);

    const mbtiResult = calculateResult();

    try {
      // 1. Firebase Auth로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 2. Firebase Storage에 이미지 업로드
      const profileImageUrl = await uploadImageToFirebase(
        profileImage as string,
        email
      );

      // 3. Firestore에 사용자 정보 저장
      await createUserProfile(uid, {
        nickname,
        email,
        mbtiResult,
        nationality,
        profileImage: profileImageUrl,
      });

      // 4. 회원가입 완료 페이지로 이동
      router.replace({ pathname: "/signUp/completed", params: { mbtiResult } });
    } catch (error) {
      console.error("Error saving user profile: ", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>MBTI 검사</Text>
        <MbtiQuestions answers={answers} setAnswers={setAnswers} />
        {errors.mbti && <Text style={styles.error}>{errors.mbti}</Text>}

        <Button title="결과 제출" onPress={handleSubmit} color="#4CAF50" />

        {/* 로딩 화면 */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>회원가입 중...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명한 레이어
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // 상위 레이어로 보이게 하기
  },
  loadingText: {
    color: "#FFF",
    fontSize: 18,
    marginTop: 10,
  },
});
