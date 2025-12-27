import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function ChildStep() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Child + Age</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/quiz/challenge")}
      >
        <Text style={styles.btnText}>Next ➜</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16 },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 999, borderWidth: 1 },
  btnText: { fontSize: 16, fontWeight: "700" },
});
