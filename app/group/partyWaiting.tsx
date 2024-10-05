import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { onSnapshot, query, collection, where } from "firebase/firestore";
import { firestore } from "../api/firebase"; // Firebase 설정 파일

export default function PartyMatchingWaitingPage() {
  const router = useRouter();
  const [isMatched, setIsMatched] = useState(false);
  const [partyId, setPartyId] = useState(null);

  // 파티 매칭 상태를 실시간 감시하는 함수
  const subscribeToPartyQueue = () => {
    const q = query(
      collection(firestore, "partyQueue"),
      where("matched", "==", false) // 매칭되지 않은 큐만 감시
    );

    // Firestore에서 실시간으로 큐 상태 감시
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.length >= 6) {
          // 파티가 완성되면
          setIsMatched(true);
          setPartyId(doc.id); // 파티 ID 저장
        }
      });
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = subscribeToPartyQueue();
    return () => unsubscribe(); // 컴포넌트가 언마운트되면 구독 해제
  }, []);

  useEffect(() => {
    if (isMatched && partyId) {
      // 파티 매칭이 완료되면 파티 페이지로 이동
      router.replace(`/party/matched?partyId=${partyId}`);
    }
  }, [isMatched, partyId]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>파티 매칭을 기다리고 있습니다...</Text>
      <ActivityIndicator size="large" color="#4CAF50" />
      {isMatched && (
        <Text style={styles.matchedText}>파티가 매칭되었습니다!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  matchedText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 20,
  },
});
