import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

// 실제 이미지 URL을 사용하는 더미 상품 데이터
const products = [
  {
    id: "1",
    image: {
      uri: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Oreo-Two-Cookies.jpg",
    }, // 오레오 이미지
    store: "GS25",
    name: "오레오 초콜릿 샌드위치 쿠키",
    quantity: "10개",
  },
  {
    id: "2",
    image: {
      uri: "https://sitem.ssgcdn.com/50/43/28/item/1000537284350_i1_1200.jpg",
    }, // 소주잔 이미지
    store: "카카오프렌즈",
    name: "춘식이 소주잔",
    quantity: "10개",
  },
  {
    id: "3",
    image: {
      uri: "https://sitem.ssgcdn.com/14/55/69/item/1000332695514_i1_1200.jpg",
    }, // 해장국 이미지
    store: "김형래 해장국",
    name: "해장국 밀키트 세트",
    quantity: "10개",
  },
  {
    id: "4",
    image: {
      uri: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Oreo-Two-Cookies.jpg",
    }, // 오레오 이미지 (다시 사용)
    store: "GS25",
    name: "오레오 초콜릿 샌드위치 쿠키",
    quantity: "10개",
  },
];

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;

// 코인 아이콘 이미지 import
import coinIcon from "../../../../assets/images/coin.png";

export default function ShopPage() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* 이미지를 별도의 카드로 분리 */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} />
      </View>
      <Text style={styles.store}>{item.store}</Text>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.quantity}>{item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>상점</Text>
        <View style={styles.coinContainer}>
          <Image source={coinIcon} style={styles.coinIcon} />
          {/* 코인 이미지 */}
          <Text style={styles.coinText}>20개</Text>
        </View>
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns} // 2열 그리드
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // 배경색 설정
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA", // 코인 배경 색상
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  coinIcon: {
    width: 24, // 코인 아이콘 크기 설정
    height: 24,
    marginRight: 5,
  },
  coinText: {
    color: "#141414", // 코인 텍스트 색상
    fontWeight: "bold",
    fontSize: 18,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    padding: 10,
    marginBottom: 20,
    width: (screenWidth - 60) / 2, // 화면 너비에 맞춘 카드 크기
    elevation: 2,
  },
  imageContainer: {
    marginBottom: 10,
  },
  productImage: {
    width: 158, // 너비 158px
    height: 158, // 높이 148px
    borderRadius: 8, // 상단 왼쪽에만 border-radius
    resizeMode: "contain", // 이미지 비율에 맞게 조정
    borderWidth: 1, // 테두리 두께 1px
    borderColor: "#E8E8E8", // 테두리 색상
  },
  store: {
    fontSize: 12,
    color: "#777",
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: "#555",
  },
});
