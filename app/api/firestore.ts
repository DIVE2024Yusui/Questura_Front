import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { getCurrentUserUid } from "./auth";

// 사용자 프로필 생성 함수
export const createUserProfile = async (uid: string, data: any) => {
  try {
    // Firestore에서 'users' 컬렉션에 uid를 문서 ID로 사용하여 프로필 생성
    await setDoc(doc(firestore, "users", uid), { ...data });
    console.log("프로필 생성 완료");
  } catch (error) {
    throw new Error("프로필 생성 실패: " + error.message);
  }
};

// 사용자 프로필 조회 함수
export const getUserProfile = async () => {
  const uid = await getCurrentUserUid();
  try {
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("프로필을 찾을 수 없습니다.");
    }
  } catch (error) {
    throw new Error("프로필 조회 실패: " + error.message);
  }
};

// 사용자 프로필 업데이트 함수
export const updateUserProfile = async (uid: string, data: any) => {
  try {
    const docRef = doc(firestore, "users", uid);
    await updateDoc(docRef, data);
  } catch (error) {
    throw new Error("프로필 업데이트 실패: " + error.message);
  }
};

// 사용자 프로필 삭제 함수
export const deleteUserProfile = async (uid: string) => {
  try {
    const docRef = doc(firestore, "users", uid);
    await deleteDoc(docRef);
  } catch (error) {
    throw new Error("프로필 삭제 실패: " + error.message);
  }
};

export const sendMessage = async (roomCode, userNickname, message) => {
  try {
    await addDoc(collection(firestore, `groups/${roomCode}/chats`), {
      nickname: userNickname,
      message,
      timestamp: serverTimestamp(), // 서버 시간으로 타임스탬프 저장
    });
  } catch (error) {
    console.error("메시지 전송 오류:", error);
    throw new Error("메시지를 전송할 수 없습니다.");
  }
};

export const subscribeToMessages = (roomCode, callback) => {
  const q = query(
    collection(firestore, `groups/${roomCode}/chats`),
    orderBy("timestamp", "asc") // 타임스탬프 기준으로 정렬
  );

  // Firestore의 onSnapshot을 사용하여 실시간 구독
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages); // 새로운 메시지 배열을 콜백으로 전달
  });

  return unsubscribe; // 컴포넌트 언마운트 시 구독 해제
};
