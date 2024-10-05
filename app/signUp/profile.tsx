import React, { useState } from "react";
import {
  View,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // 이미지 선택 라이브러리
import ProfileInput from "./components/ProfileInput";

export default function ProfilePage() {
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [nationality, setNationality] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
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

  const handleNext = () => {
    if (validateInputs()) {
      // 프로필 정보를 MBTI 페이지로 전달
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>프로필 입력</Text>
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

        <Button title="다음" onPress={handleNext} color="#4CAF50" />
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
