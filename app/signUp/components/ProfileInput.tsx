import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface ProfileInputProps {
  nickname: string;
  setNickname: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  nationality: string;
  setNationality: (value: string) => void;
}

export default function ProfileInput({
  nickname,
  setNickname,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  nationality,
  setNationality,
}: ProfileInputProps) {
  return (
    <View>
      <Text style={styles.label}>닉네임</Text>
      <TextInput
        placeholder="닉네임"
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
      />
      <Text style={styles.label}>이메일</Text>
      <TextInput
        placeholder="이메일"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        placeholder="비밀번호"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput
        placeholder="비밀번호 확인"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Text style={styles.label}>국적</Text>
      <TextInput
        placeholder="국적"
        style={styles.input}
        value={nationality}
        onChangeText={setNationality}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
