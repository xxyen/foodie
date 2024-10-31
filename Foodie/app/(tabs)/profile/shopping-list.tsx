import { View, Text, StyleSheet, SafeAreaView, Pressable, FlatList, Alert } from "react-native";
import { useAppContext } from "@/context/contexts";
import { useState, useEffect } from "react";
import { getProfile } from "@/utils";

export default function ShoppingList() {
    const { id, onChangeIngredients } = useAppContext();
    const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);
    const [ingredients, setIngredients] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const userData = await getProfile(id);
                if (userData) {
                    setUserInfo(userData);
                }
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (userInfo?.ingredients) {
            setIngredients(userInfo.ingredients);
        }
    }, [userInfo]);

    const confirmAndRemoveItem = (item: string) => {
        Alert.alert(
            "Confirm Remove",
            `Are you sure you want to remove "${item}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => removeItem(item),
                },
            ]
        );
    };

    const removeItem = (item: string) => {
        const updatedList = ingredients.filter((ingredient) => ingredient !== item);
        setIngredients(updatedList);
        onChangeIngredients(updatedList);
        // TBD: update the user's ingredients in the database

        Alert.alert("Item Removed", `"${item}" has been successfully removed.`);
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <FlatList
                contentContainerStyle={styles.listContainer}
                data={ingredients}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.itemText}>{item}</Text>
                        <Pressable style={styles.removeButton} onPress={() => confirmAndRemoveItem(item)}>
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </Pressable>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20, 
  },
  listContainer: {
    paddingHorizontal: 10, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#A9A9A9",
    marginHorizontal: 10,
  },
  itemText: {
    fontSize: 18,
    color: "black",
  },
  removeButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 10,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
