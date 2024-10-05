import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { firestore } from "./firebase"; // Firebase 설정 파일

// 그룹 생성 함수
// 그룹 생성 함수
export const createGroup = async (user: { id: string; mbti: string }) => {
  try {
    // user 객체에 id와 mbti가 정의되어 있는지 확인
    if (!user || !user.id || !user.mbti) {
      throw new Error(
        "Invalid user data. Both 'id' and 'mbti' must be defined."
      );
    }

    const newGroup = {
      roomCode: generateRoomCode(),
      members: [user], // 그룹 생성자를 바로 멤버로 포함
      maxMembers: 6,
    };

    const docRef = await addDoc(collection(firestore, "groups"), newGroup);
    return newGroup.roomCode;
  } catch (error) {
    console.error("Error creating group: ", error.message || error);
    throw error;
  }
};

// 큐 참가 함수 (개인 및 그룹)
export const joinPartyQueue = async (userOrGroup: any) => {
  try {
    await addDoc(collection(firestore, "partyQueue"), {
      participants: userOrGroup,
      timestamp: serverTimestamp(),
      matched: false,
    });
    return true;
  } catch (error) {
    console.error("파티 큐 참가 오류:", error);
    throw error;
  }
};

// 그룹 참가 함수
export const joinGroup = async (roomCode: string) => {
  try {
    const groupsRef = collection(firestore, "groups");
    const q = query(groupsRef, where("roomCode", "==", roomCode));
    const groupSnapshot = await getDocs(q);

    if (!groupSnapshot.empty) {
      const group = groupSnapshot.docs[0];
      const updatedMembers = [
        ...group.data().members,
        { id: generateUserId(), mbti: "INTJ" },
      ];
      await updateDoc(group.ref, { members: updatedMembers });
      return true;
    } else {
      throw new Error("Group not found");
    }
  } catch (error) {
    console.error("Error joining group: ", error);
    throw error;
  }
};

// 그룹 멤버 가져오기 함수
export const subscribeToGroupMembers = (
  roomCode: string,
  callback: (members: any[]) => void
) => {
  const q = query(
    collection(firestore, "groups"),
    where("roomCode", "==", roomCode)
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const group = snapshot.docs[0]?.data();
    if (group) {
      callback(group.members);
    }
  });
  return unsubscribe;
};

// 파티 매칭 함수
export const matchParty = async () => {
  try {
    const queueRef = collection(firestore, "partyQueue");
    const q = query(
      queueRef,
      where("matched", "==", false),
      orderBy("timestamp", "asc")
    );
    const queueSnapshot = await getDocs(q);

    if (!queueSnapshot.empty) {
      let matchedParticipants: any[] = [];

      queueSnapshot.forEach((doc) => {
        const data = doc.data();
        matchedParticipants.push(...data.participants);

        if (matchedParticipants.length >= 6) {
          createOrJoinParty(matchedParticipants);
          updateDoc(doc.ref, { matched: true }); // 매칭 완료 상태로 변경
        }
      });
    } else {
      console.log("매칭 가능한 큐 항목이 없습니다.");
    }
  } catch (error) {
    console.error("파티 매칭 오류:", error);
    throw error;
  }
};

// 파티 생성 또는 참가 함수
export const createOrJoinParty = async (participants: any[]) => {
  try {
    const partiesRef = collection(firestore, "parties");
    const q = query(
      partiesRef,
      where("isFull", "==", false),
      orderBy("timestamp", "asc")
    );
    const partySnapshot = await getDocs(q);

    if (!partySnapshot.empty) {
      const partyDoc = partySnapshot.docs[0];
      const partyData = partyDoc.data();
      const updatedParticipants = [...partyData.participants, ...participants];
      const isFull = updatedParticipants.length >= 6;

      await updateDoc(partyDoc.ref, {
        participants: updatedParticipants,
        isFull: isFull,
      });

      return partyDoc.id;
    } else {
      const newParty = {
        participants: participants,
        isFull: participants.length >= 6,
        timestamp: serverTimestamp(),
      };
      const docRef = await addDoc(collection(firestore, "parties"), newParty);
      return docRef.id;
    }
  } catch (error) {
    console.error("파티 생성/참가 오류:", error);
    throw error;
  }
};

// 방 코드 생성 함수
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 사용자 ID 생성 함수
const generateUserId = () => {
  return Math.random().toString(36).substring(2, 10);
};
