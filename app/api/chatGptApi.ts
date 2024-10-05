// chatGptApi.ts

export const ChatGPTAPI = async (prompt: string) => {
  const API_KEY = "YOUR_OPENAI_API_KEY"; // OpenAI API 키

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`, // API 키를 헤더에 포함
      },
      body: JSON.stringify({
        model: "text-davinci-003", // GPT-3.5 모델 사용
        prompt: prompt, // 전달할 프롬프트
        max_tokens: 100, // 최대 응답 토큰 수
      }),
    });

    const data = await response.json(); // API의 JSON 응답 처리

    if (response.ok) {
      return data.choices[0].text.trim(); // ChatGPT 응답 반환
    } else {
      throw new Error(data.error.message || "ChatGPT 호출 실패");
    }
  } catch (error) {
    console.error("ChatGPT API 호출 오류:", error);
    throw new Error("ChatGPT API 호출 중 오류가 발생했습니다.");
  }
};
