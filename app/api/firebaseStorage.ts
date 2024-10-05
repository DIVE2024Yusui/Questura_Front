import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase Storage에 이미지 업로드 후 URL 반환
export const uploadImageToFirebase = async (
  imageUri: string,
  email: string
): Promise<string> => {
  const storage = getStorage();

  // Firebase Storage 참조 생성 (프로필 이미지 폴더에 업로드)
  const storageRef = ref(storage, `profile_images/${email}.jpg`);

  // 이미지 URI에서 Blob 객체 생성
  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error("이미지를 로드하는 중 오류가 발생했습니다."));
    };
    xhr.responseType = "blob";
    xhr.open("GET", imageUri, true);
    xhr.send(null);
  });

  // Firebase Storage에 Blob 업로드
  await uploadBytes(storageRef, blob);

  // 업로드된 이미지의 다운로드 URL 가져오기
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};
