import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

export default function Dot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(active ? 18 : 6, { duration: 250 }),
      opacity: withTiming(active ? 1 : 0.4, { duration: 250 }),
    };
  }, [active]);

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "white",
    marginHorizontal: 4,
  },
});
