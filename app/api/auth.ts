import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
// Firebase Auth 객체 가져오기

// 로그인 함수
export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error("로그인 실패: " + error.message);
  }
};

// 회원가입 함수
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error("회원가입 실패: " + error.message);
  }
};

// 로그아웃 함수
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("로그아웃 실패: " + error.message);
  }
};
export const getCurrentUserUid = async () => {
  const user = auth.currentUser; // 현재 로그인된 사용자 정보 가져오기
  if (user) {
    return user.uid; // UID 반환
  } else {
    throw new Error("로그인된 사용자가 없습니다.");
  }
};
