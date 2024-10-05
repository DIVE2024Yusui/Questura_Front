import React, { useState } from "react";
import {
  View,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MbtiQuestions, { Answers } from "./components/MbtiQuestions";
import { createUserProfile } from "../api/firestore";
import { uploadImageToFirebase } from "../api/firebaseStorage";
import { auth, signInWithEmailAndPassword } from "../api/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
    if (!validateMbti()) return;
    setLoading(true);

    const mbtiResult = calculateResult();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const profileImageUrl = await uploadImageToFirebase(
        profileImage as string,
        email
      );

      await createUserProfile(uid, {
        nickname,
        email,
        mbtiResult,
        nationality,
        profileImage: profileImageUrl,
      });

      router.replace({ pathname: "/signUp/completed", params: { mbtiResult } });
    } catch (error) {
      console.error("Error saving user profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={styles.headerTitle}>유형 검사</Text>
          <Text style={styles.subTitle}>
            자신에게 맞는 답변을 선택해 주세요
          </Text>
        </View>
        <MbtiQuestions answers={answers} setAnswers={setAnswers} />
        {errors.mbti && <Text style={styles.error}>{errors.mbti}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>제출하기</Text>
        </TouchableOpacity>

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
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: {
    color: "#FFF",
    fontSize: 18,
    marginTop: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  answerButton: {
    backgroundColor: "#FF7043",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  answerButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    marginTop: 40,
  },
  subTitle: {
    fontSize: 20,
    color: "#8A8A8A",
  },
});
