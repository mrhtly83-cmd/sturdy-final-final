import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const testimonials = [
  {
    text: "Sturdy has transformed how I communicate with my children.",
    author: "Sarah M.",
  },
  {
    text: "The scripts help me stay calm in difficult moments.",
    author: "Michael T.",
  },
  {
    text: "An essential tool for every parent!",
    author: "Jennifer L.",
  },
];

export default function TestimonialRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>"{current.text}"</Text>
      <Text style={styles.author}>— {current.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    alignItems: "center",
  },
  quote: {
    color: "#FFFFFF",
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 12,
  },
  author: {
    color: "#888888",
    fontSize: 14,
  },
});
