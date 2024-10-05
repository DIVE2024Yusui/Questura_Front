import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Switch,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { joinPartyQueue, createGroup, joinGroup } from "../../../api/groupApi"; // groupApi.ts에서 제공하는 함수
import { auth } from "@/app/api/firebase";

// 이미지 import
import yesCheck from "../../../../assets/images/yesCheck.png";
import noCheck from "../../../../assets/images/noCheck.png";
import { getCurrentUserUid } from "@/app/api/auth";
import { getUserProfile } from "@/app/api/firestore";
import avatar from "../../../../assets/images/avatar.png"; // 추가된 아바타 이미지 import

// 사용자 ID 생성 함수
const generateUserId = () => {
  return Math.random().toString(36).substring(2, 10); // 랜덤 사용자 ID 생성
};

// 컴포넌트 시작
export default function GroupTogglePage() {
  const [isGroupMatched, setIsGroupMatched] = useState(false); // 그룹 매칭 토글 상태
  const [roomCode, setRoomCode] = useState(""); // 방 코드 입력 상태
  const [inGroup, setInGroup] = useState(false); // 그룹 참가 여부 상태
  const { roomCode: paramRoomCode } = useLocalSearchParams(); // URL 파라미터에서 roomCode 가져오기

  // 그룹 매칭 토글 상태 변경 함수
  const toggleSwitch = () => {
    setIsGroupMatched((previousState) => !previousState);
  };

  // 파티 큐 참가 함수
  const handleJoinQueue = async () => {
    try {
      await joinPartyQueue({ id: generateUserId(), mbti: "INTJ" }); // 임의로 사용자 정보 설정
      Alert.alert("큐 참가 성공", "파티 매칭을 기다립니다.");
      router.replace("/group/partyWaiting"); // 그룹 대기 페이지로 이동
    } catch (error) {
      console.error("큐 참가 오류:", error);
      Alert.alert("큐 참가 실패", "큐에 참가할 수 없습니다.");
    }
  };

  // 그룹 생성 함수
  const handleCreateGroup = async () => {
    try {
      // Firebase Auth에서 현재 로그인된 사용자 가져오기
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("로그인된 사용자가 없습니다.");
      }

      // 사용자의 추가 정보를 getUserProfile() 함수에서 불러오기
      const userProfile = await getUserProfile(currentUser.uid); // 사용자의 uid를 기반으로 추가 정보를 불러오기

      // 그룹 생성
      const generatedCode = await createGroup({
        id: currentUser.uid, // Firebase Auth에서 가져온 uid
        mbti: userProfile.mbtiResult, // 사용자 프로필에서 mbti 값 가져오기
      });

      // 성공 메시지 및 그룹 참가 상태 변경
      Alert.alert("그룹 생성 완료", `그룹 코드: ${generatedCode}`);
      setInGroup(true); // 그룹 참가 상태로 변경
      router.replace(`/group/waiting?roomCode=${generatedCode}`); // 그룹 대기 페이지로 이동
    } catch (error) {
      console.error("그룹 생성 오류:", error);
      Alert.alert("그룹 생성 실패", "그룹을 생성할 수 없습니다.");
    }
  };

  // 그룹 참가 함수
  const handleJoinGroup = async () => {
    try {
      await joinGroup(roomCode || paramRoomCode); // 그룹 참가 API 호출
      Alert.alert("그룹 참가 완료", "그룹에 성공적으로 참가했습니다.");
      setInGroup(true); // 그룹 참가 상태로 변경
      router.replace(`/group/waiting?roomCode=${roomCode}`); // 그룹 대기 페이지로 이동
    } catch (error) {
      console.error("그룹 참가 오류:", error);
      Alert.alert("그룹 참가 실패", "그룹에 참가할 수 없습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.questContainer}>
        <Image source={avatar} style={styles.avatar} />
        <View style={styles.checkContainer}>
          <View style={styles.checkItem}>
            <Image source={yesCheck} style={styles.checkIcon} />
          </View>
          <View style={styles.checkItem}>
            <Image source={noCheck} style={styles.checkIcon} />
          </View>
          <View style={styles.checkItem}>
            <Image source={noCheck} style={styles.checkIcon} />
          </View>
        </View>

        <View style={styles.questItem}>
          <Text style={styles.questText}>⭐️ 야경 보기</Text>
          <Text style={styles.questStatus}>인증하기</Text>
        </View>

        <View style={styles.questItem}>
          <Text style={styles.questText}>🍗 치킨 먹기</Text>
          <Text style={styles.questStatus}>인증하기</Text>
        </View>

        <View style={styles.completedQuestItem}>
          <Text style={styles.questText}>🔥 찜질방 가기</Text>
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>달성</Text>
          </View>
        </View>

        {/* 채팅하기 버튼 */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => Alert.alert("채팅 화면으로 이동합니다.")}
        >
          <Text style={styles.chatText}>🔥 채팅하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 스타일링 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 225, // 이미지 크기 설정
    height: 280,
    marginBottom: 20, // 간격 추가
    marginHorizontal: "auto",
    marginTop: 70,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 18,
    fontFamily: "PretendardRegular",
  },
  questContainer: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "PretendardMedium",
  },
  checkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  checkItem: {
    marginHorizontal: 10,
  },
  checkIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  questItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  questText: {
    fontFamily: "PretendardMedium",
    fontSize: 18,
  },
  questStatus: {
    color: "#BDBDBD",
    fontFamily: "PretendardRegular",
    fontSize: 15,
  },
  completedQuestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FCE4E4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#F0836D",
    borderWidth: 1,
  },
  completedBadge: {
    backgroundColor: "#F0836D",
    padding: 5,
    borderRadius: 5,
  },
  completedText: {
    color: "#FFFFFF",
    fontFamily: "PretendardBold",
  },
  chatButton: {
    backgroundColor: "#2B2B2B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  chatText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "PretendardBold",
  },
  notMatchedText: {
    fontFamily: "PretendardRegular",
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});
