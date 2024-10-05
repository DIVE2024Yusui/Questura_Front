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

// 이미지 import
import yesCheck from "../../../../assets/images/yesCheck.png";
import noCheck from "../../../../assets/images/noCheck.png";
import { getCurrentUserUid } from "@/app/api/auth";
import { getUserProfile } from "@/app/api/firestore";

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
      // 예시: 사용자의 정보를 Firebase 또는 다른 저장소에서 불러오기
      const user = await getUserProfile(); // getUserProfile 함수를 통해 사용자 정보 불러오기
      const generatedCode = await createGroup({
        id: user.uid,
        mbti: user.mbtiResult,
      }); // 사용자 정보를 넘겨 그룹 생성
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
      {/* 그룹 매칭 토글 버튼 */}
      <View style={{ marginTop: 50 }} />
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>그룹 매칭</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isGroupMatched ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isGroupMatched}
        />
      </View>

      {/* 그룹 매칭이 활성화되면 퀘스트 달성 화면 표시 */}
      {isGroupMatched ? (
        <View style={styles.questContainer}>
          <Text style={styles.title}>퀘스트 달성 개수</Text>

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
            <Text style={styles.questText}>🎬 영화 보기</Text>
            <Text style={styles.questStatus}>인증하기</Text>
          </View>

          <View style={styles.questItem}>
            <Text style={styles.questText}>🍗 치킨 시키기</Text>
            <Text style={styles.questStatus}>인증하기</Text>
          </View>

          <View style={styles.completedQuestItem}>
            <Text style={styles.questText}>🎬 영화 보기</Text>
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
      ) : (
        <>
          {/* 그룹 매칭이 비활성화된 경우 */}
          <Text style={styles.notMatchedText}>
            그룹 매칭이 활성화되지 않았습니다.
          </Text>
          {/* 그룹 생성 및 참가 옵션 */}
          <Button title="파티 큐에 참가" onPress={handleJoinQueue} />
          <Button title="새 그룹 생성" onPress={handleCreateGroup} />
          <TextInput
            style={styles.input}
            placeholder="방 코드 입력"
            value={roomCode}
            onChangeText={setRoomCode}
          />
          <Button title="그룹 참가" onPress={handleJoinGroup} />
        </>
      )}
    </View>
  );
}

// 스타일링 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
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
  },
  questStatus: {
    color: "#BDBDBD",
    fontFamily: "PretendardRegular",
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
