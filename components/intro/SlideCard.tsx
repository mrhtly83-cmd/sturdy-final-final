// components/intro/SlideCard.tsx

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";

interface Slide {
  title: string;
  body: string;
  icon: string;
  pill?: string;
}

interface SlideCardProps {
  slide: Slide;
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}

export default function SlideCard({ slide, index, scrollX, width }: SlideCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [20, 0, 20],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.iconContainer}>
        <Ionicons name={slide.icon as any} size={24} color="white" />
      </View>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.body}>{slide.body}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: "#3A3F47",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  body: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 20,
  },
});
