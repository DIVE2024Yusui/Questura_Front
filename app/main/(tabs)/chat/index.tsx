import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../api/firebase"; // Firebase 설정 파일

export default function ChatListPage() {
  const [chatRooms, setChatRooms] = useState([]);
  const router = useRouter();

  // Firestore에서 채팅방 리스트를 불러오는 함수
  const fetchChatRooms = async () => {
    try {
      const chatRoomsSnapshot = await getDocs(collection(firestore, "groups"));
      const rooms = chatRoomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatRooms(rooms); // 채팅방 리스트를 상태로 저장
    } catch (error) {
      console.error("채팅방을 불러오는 중 오류:", error);
    }
  };

  useEffect(() => {
    fetchChatRooms(); // 컴포넌트 마운트 시 채팅방 리스트 불러오기
  }, []);

  // 각 채팅방의 멤버 이름을 출력하는 함수
  const renderMemberNames = (members) => {
    return members.map((member) => member.nickname).join(", ");
  };

  // 채팅방 리스트 렌더링
  return (
    <View style={styles.container}>
      <Text style={styles.header}>채팅리스트</Text>
      {chatRooms.length === 0 ? (
        <Text>채팅방이 없습니다.</Text>
      ) : (
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.roomItem}
              onPress={() =>
                router.push({
                  pathname: `/group/chat`,
                  params: { roomCode: item.roomCode },
                })
              }
            >
              <View style={styles.roomInfo}>
                <Text style={styles.roomMembers}>
                  {renderMemberNames(item.members).slice(0, 20)}...
                </Text>
                <Text style={styles.lastMessage}>
                  {item.lastMessage || "메시지가 없습니다."}
                </Text>
              </View>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA", // 배경색 설정
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
  },
  roomItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  roomInfo: {
    flex: 1,
  },
  roomMembers: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: "#777",
  },
  unreadBadge: {
    backgroundColor: "#F0836D",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  unreadCount: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
