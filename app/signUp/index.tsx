import React, { useState } from "react";
import {
  View,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // 이미지 선택 라이브러리
import ProfileInput from "./components/ProfileInput";
import MbtiQuestions, { Answers } from "./components/MbtiQuestions";
import { createUserProfile } from "../api/firestore";
import { uploadImageToFirebase } from "../api/firebaseStorage"; // 이미지 업로드 함수
import { auth } from "../api/firebase"; // Firebase Auth 가져오기
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Authentication 함수 가져오기

export default function SignUp() {
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가
  const [errors, setErrors] = useState<any>({}); // 입력 오류 상태 추가
  const router = useRouter();

  // 유효성 검사 함수
  const validateInputs = () => {
    const newErrors: any = {};

    if (!nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    }
    if (!email.includes("@")) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
    }
    if (password.length < 6) {
      newErrors.password = "비밀번호는 6자리 이상이어야 합니다.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    if (!profileImage) {
      newErrors.profileImage = "프로필 사진을 선택해주세요.";
    }
    if (!nationality.trim()) {
      newErrors.nationality = "국적을 입력해주세요.";
    }

    // 모든 MBTI 질문이 응답되었는지 확인
    Object.keys(answers).forEach((key) => {
      if (!answers[key]) {
        newErrors.mbti = "모든 MBTI 질문에 응답해주세요.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 오류가 없으면 true 반환
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
    if (!validateInputs()) return; // 유효성 검사 통과하지 않으면 중지

    const mbtiResult = calculateResult();
    setLoading(true); // 로딩 시작

    try {
      // 1. Firebase Auth로 사용자 생성 및 uid 가져오기
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 2. Firebase Storage에 이미지 업로드 (이메일을 파일 이름으로 사용)
      const profileImageUrl = await uploadImageToFirebase(
        profileImage as string,
        email
      );

      // 3. Firestore에 사용자 정보 저장 (이미지 URL 포함)
      await createUserProfile(uid, {
        nickname,
        email,
        mbtiResult,
        nationality,
        profileImage: profileImageUrl, // 이미지 URL 저장
        uid,
      });

      router.replace({ pathname: "/signup/result", params: { mbtiResult } });
    } catch (error) {
      console.error("Error saving user profile: ", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 프로필 이미지 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>회원가입</Text>
        <ProfileInput
          nickname={nickname}
          setNickname={setNickname}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          nationality={nationality}
          setNationality={setNationality}
        />
        {errors.nickname && <Text style={styles.error}>{errors.nickname}</Text>}
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword}</Text>
        )}
        {errors.nationality && (
          <Text style={styles.error}>{errors.nationality}</Text>
        )}

        <View style={styles.imagePickerContainer}>
          <Text style={styles.label}>프로필 사진</Text>
          <Button title="사진 선택" onPress={pickImage} />
          {profileImage && (
            <Image source={{ uri: profileImage }} style={styles.image} />
          )}
        </View>
        {errors.profileImage && (
          <Text style={styles.error}>{errors.profileImage}</Text>
        )}

        <MbtiQuestions answers={answers} setAnswers={setAnswers} />
        {errors.mbti && <Text style={styles.error}>{errors.mbti}</Text>}

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <Button title="결과 제출" onPress={handleSubmit} color="#4CAF50" />
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
  imagePickerContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
