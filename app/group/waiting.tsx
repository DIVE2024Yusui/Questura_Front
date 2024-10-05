import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { subscribeToGroupMembers, matchParty } from "../api/groupApi";
import { useLocalSearchParams } from "expo-router"; // Expo Router의 useLocalSearchParams 사용

interface Member {
  id: string;
  mbti: string;
}

export default function GroupWaitingPage() {
  const { roomCode } = useLocalSearchParams(); // useLocalSearchParams로 roomCode 가져오기

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToGroupMembers(
      roomCode as string,
      (groupMembers) => {
        setMembers(groupMembers);
      }
    );
    return () => unsubscribe();
  }, [roomCode]);

  const handleStartMatching = () => {
    matchParty(); // 파티 매칭 시작
  };

  return (
    <View style={styles.container}>
      <Text>그룹 코드: {roomCode}</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.mbti} - {item.id}
          </Text>
        )}
      />
      <Button title="파티 매칭 시작" onPress={handleStartMatching} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
