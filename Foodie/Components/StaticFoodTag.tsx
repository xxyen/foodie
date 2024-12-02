import { View, Text, StyleSheet } from 'react-native';

export default function StaticFoodTag({ food }: { food: string }) {
    return (
      <View style={styles.container_tag_row}>
        <View style={styles.tag}>
          <Text style={styles.tag_text}>{food}</Text>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container_tag_row: {},
    tag: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        height: 40,
    },
    tag_text: {
        fontSize: 14,
        color: "#0A2533",
        textAlign: "center",
        padding: 10,
    },
  });