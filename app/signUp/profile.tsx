import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // 이미지 선택 라이브러리

export default function ProfilePage() {
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 입력 값이 바뀔 때마다 버튼 활성화 상태 확인
  useEffect(() => {
    if (
      nickname &&
      email &&
      password &&
      confirmPassword &&
      nationality &&
      profileImage
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [nickname, email, password, confirmPassword, nationality, profileImage]);

  const handleNext = () => {
    if (validateInputs()) {
      router.push({
        pathname: "/signUp/mbti",
        params: { nickname, email, password, nationality, profileImage },
      });
    }
  };

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // 키보드가 올라오면 화면이 올라가도록 설정
      keyboardVerticalOffset={80} // iOS에서 키보드가 겹치는 문제를 피하기 위해 설정
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>프로필 입력</Text>
        <Text style={styles.subHeader}>사용자님의 정보를 입력해 주세요</Text>

        <View style={styles.imagePickerContainer}>
          <TouchableOpacity onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>사진 추가</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.profileImage && (
            <Text style={styles.error}>{errors.profileImage}</Text>
          )}
        </View>

        {/* 닉네임 입력 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            onChangeText={setNickname}
          />
          {errors.nickname && (
            <Text style={styles.error}>{errors.nickname}</Text>
          )}
        </View>

        {/* 이메일 입력 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        </View>

        {/* 국적 입력 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>국적</Text>
          <TextInput
            style={styles.input}
            placeholder="국적을 입력해 주세요"
            value={nationality}
            onChangeText={setNationality}
          />
          {errors.nationality && (
            <Text style={styles.error}>{errors.nationality}</Text>
          )}
        </View>

        {/* 비밀번호 입력 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
        </View>

        {/* 비밀번호 확인 입력 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 다시 입력해 주세요"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}
        </View>
      </ScrollView>

      {/* 제출 버튼을 하단에 배치 */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: isDisabled ? "#E3E5EB" : "#2B2B2B" },
        ]}
        onPress={handleNext}
        disabled={isDisabled} // 조건에 따라 버튼을 비활성화
      >
        <Text style={styles.submitButtonText}>제출하기</Text>
      </TouchableOpacity>
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
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    marginTop: 50,
    textAlign: "left",
    alignSelf: "flex-start",
    fontFamily: "Pretendard-Medium", // Pretendard 폰트 적용
  },
  subHeader: {
    fontSize: 14,
    color: "#8A8A8A",
    marginBottom: 20,
    textAlign: "left",
    alignSelf: "flex-start",
    fontFamily: "Pretendard-Medium", // Pretendard 폰트 적용
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#8A8A8A",
    fontFamily: "Pretendard-Medium", // Pretendard 폰트 적용
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
    fontFamily: "Pretendard-Medium", // Pretendard 폰트 적용
  },
  input: {
    borderWidth: 1,
    borderColor: "#D6D6D6", // 테두리 색상 변경
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 16, // 높이를 약간 늘리기 위해 패딩 증가
    fontSize: 16,
    width: "100%",
    fontFamily: "Pretendard-Medium", // Pretendard 폰트 적용
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    fontFamily: "Pretendard-Medium", // Pretendard 폰트 적용
  },
  submitButton: {
    paddingVertical: 20,
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 30,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Pretendard-Medium", // Pretendard 폰트 적용
  },
});
