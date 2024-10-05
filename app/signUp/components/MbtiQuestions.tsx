import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export interface Answers {
  [key: number]: "A" | "B";
}

interface MbtiQuestionsProps {
  answers: Answers;
  setAnswers: (value: Answers) => void;
}

// 질문 리스트
const questions = [
  {
    question:
      "Q1. 당신이 성경에 나오는 제자라면, 예수님과 함께 많은 사람들 앞에서 가르치는 것이 더 편안한가요, 아니면 소수의 제자들과 깊은 대화를 나누는 것이 더 편안한가요?",
    options: ["많은 사람들 앞에서 가르치는 것", "소수의 제자들과 대화하는 것"],
    category: "EvsI",
  },
  {
    question:
      "Q2. 모세처럼 이스라엘 백성을 이끌며 그들에게 직접 메시지를 전하는 것을 선호하시나요, 아니면 예레미야처럼 하느님의 말씀을 듣고 혼자 깊이 묵상하며 그 뜻을 고민하는 것이 더 편안한가요?",
    options: ["사람들에게 직접 메시지를 전하는 것", "혼자 깊이 묵상하는 것"],
    category: "EvsI",
  },
  {
    question:
      "Q3. 사람들과 긴 대화를 나눈 후, 다윗처럼 기분이 충전되나요, 아니면 엘리야처럼 혼자 있는 시간이 더 필요하다고 느끼시나요?",
    options: ["대화 후 더 충전되는 느낌", "혼자 있을 때 더 충전되는 느낌"],
    category: "EvsI",
  },
  {
    question:
      "Q4. 현실적인 문제를 해결할 때, 요셉처럼 꿈과 같은 상징을 구체적인 현실 계획으로 변환하는 것이 더 편하신가요, 아니면 예레미야처럼 하느님의 비전을 따라 먼 미래의 큰 흐름을 예측하는 것이 더 자연스러운가요?",
    options: ["구체적인 계획을 세우는 것", "미래의 큰 흐름을 보는 것"],
    category: "SvsN",
  },
  {
    question:
      "Q5. 다윗처럼 지금 눈앞의 상황에서 하느님의 뜻을 찾는 것을 선호하시나요, 아니면 이사야처럼 하느님의 더 큰 계획과 예언을 통해 그분의 뜻을 이해하는 것을 더 선호하시나요?",
    options: ["현재의 상황에서 답을 찾는 것", "미래의 계획과 예언을 보는 것"],
    category: "SvsN",
  },
  {
    question:
      "Q6. 문제를 해결할 때, 솔로몬처럼 실제 사례와 경험에 의존하는 편인가요, 아니면 아모스처럼 직관적으로 더 큰 의미와 영적 메시지를 찾는 것이 더 자연스러운가요?",
    options: ["실제 경험에 의존하는 것", "직관적 의미를 찾는 것"],
    category: "SvsN",
  },
  {
    question:
      "Q7. 솔로몬처럼 지혜와 논리를 바탕으로 판단을 내리는 것이 더 편하신가요, 아니면 사도 바울처럼 사람들의 감정과 관계를 고려하여 결정을 내리는 것이 더 자연스러운가요?",
    options: ["논리와 지혜에 근거한 판단", "사람들의 감정을 고려한 결정"],
    category: "TvsF",
  },
  {
    question:
      "Q8. 베드로처럼 급박한 상황에서 먼저 상황을 분석하고 논리적으로 판단하는 것을 선호하시나요, 아니면 다윗처럼 감정에 따라 행동하고 사람들의 마음을 움직이는 것을 선호하시나요?",
    options: ["논리적으로 분석하는 것", "감정에 따라 행동하는 것"],
    category: "TvsF",
  },
  {
    question:
      "Q9. 어려운 결정을 할 때, 니고데모처럼 논리적인 분석을 통해 결정을 내리는 것이 더 편안한가요, 아니면 에스더처럼 타인의 감정을 고려하고 관계를 중요시하며 결정을 내리는 것이 더 자연스러운가요?",
    options: ["논리적인 분석", "관계와 감정 고려"],
    category: "TvsF",
  },
  {
    question:
      "Q10. 여호수아처럼 하느님의 명령에 따라 계획을 세우고 철저하게 실행하는 것을 선호하시나요, 아니면 사사 삼손처럼 상황에 맞게 즉흥적으로 행동하는 것을 선호하시나요?",
    options: ["철저한 계획을 세우는 것", "상황에 따라 유연하게 행동하는 것"],
    category: "JvsP",
  },
  {
    question:
      "Q11. 노아처럼 방주를 지을 때, 계획을 세우고 그 계획을 차근차근 실행하는 것이 더 자연스러운가요, 아니면 다윗처럼 예상치 못한 상황에 맞춰 융통성 있게 대응하는 것이 더 편한가요?",
    options: [
      "계획을 차근차근 실행하는 것",
      "상황에 맞춰 유연하게 대응하는 것",
    ],
    category: "JvsP",
  },
  {
    question:
      "Q12. 당신이 여호수아처럼 가나안 땅을 정복한다면, 치밀하게 전쟁 계획을 세우는 것이 더 자연스러운가요, 아니면 모세처럼 상황에 따라 하느님의 뜻에 맞게 유연하게 대처하는 것이 더 자연스러운가요?",
    options: ["전쟁 계획을 세우는 것", "상황에 맞게 유연하게 대처하는 것"],
    category: "JvsP",
  },
];

export default function MbtiQuestions({
  answers,
  setAnswers,
}: MbtiQuestionsProps) {
  const handleAnswer = (questionIndex: number, answer: "A" | "B") => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  return (
    <View>
      {questions.map((q, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.question}>{q.question}</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                answers[index] === "A" && styles.selectedButton,
              ]}
              onPress={() => handleAnswer(index, "A")}
            >
              <Text
                style={[
                  styles.optionText,
                  answers[index] === "A" && styles.selectedText,
                ]}
              >
                {q.options[0]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                answers[index] === "B" && styles.selectedButton,
              ]}
              onPress={() => handleAnswer(index, "B")}
            >
              <Text
                style={[
                  styles.optionText,
                  answers[index] === "B" && styles.selectedText,
                ]}
              >
                {q.options[1]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Pretendard-Medium", // Pretendard Medium 폰트 적용
  },
  questionContainer: {
    marginVertical: 15,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Pretendard-Medium", // Pretendard Medium 폰트 적용
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  optionText: {
    color: "#8A8A8A", // 선택되지 않은 버튼의 텍스트 색상
    fontSize: 16,
    fontFamily: "Pretendard-Medium", // Pretendard Medium 폰트 적용
  },
  selectedButton: {
    backgroundColor: "#FF835D", // 선택된 버튼의 배경색
    borderColor: "#FF835D",
  },
  selectedText: {
    color: "#fff", // 선택된 버튼의 텍스트 색상
  },
});
