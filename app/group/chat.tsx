import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { sendMessage, subscribeToMessages } from "../api/firestore"; // 채팅 관련 API 함수

export default function ChatRoomPage() {
  const { roomCode } = useLocalSearchParams(); // URL에서 roomCode 받아오기
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userNickname] = useState("YourNickname"); // 사용자 닉네임 (예시)

  useEffect(() => {
    if (!roomCode) return;

    // 채팅 메시지 구독
    const unsubscribe = subscribeToMessages(roomCode, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, [roomCode]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage(roomCode, userNickname, newMessage); // 메시지 전송
      setNewMessage(""); // 입력 필드 초기화
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS에서는 padding, Android에서는 height 사용
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // 키보드 높이에 맞게 조정
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.nickname}>{item.nickname}:</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="메시지 입력"
        />
        <Button title="전송" onPress={handleSendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  nickname: {
    fontWeight: "bold",
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
