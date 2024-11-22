import { View, Text, StyleSheet, SafeAreaView, Pressable, FlatList, Alert } from "react-native";
import Checkbox from "expo-checkbox"; 
import { useAppContext } from "@/context/contexts";
import { useState, useEffect } from "react";
import { getProfile } from "@/utils";
import { updateIngredients } from "@/utils";

export default function AllergiesList() {
    const { id, onChangeIngredients } = useAppContext();
    const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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
    }, [JSON.stringify(userInfo)]);

    const toggleSelection = (item: string) => {
        const updatedSelection = new Set(selectedItems);
        if (updatedSelection.has(item)) {
            updatedSelection.delete(item);
        } else {
            updatedSelection.add(item);
        }
        setSelectedItems(updatedSelection);
    };

    const confirmAndRemoveSelectedItems = () => {
        if (selectedItems.size === 0) {
            Alert.alert("No Items Selected", "Please select items to remove.");
            return;
        }

        Alert.alert(
            "Confirm Remove",
            `Are you sure you want to remove selected items?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: removeSelectedItems,
                },
            ]
        );
    };

    const removeSelectedItems = () => {
        const updatedList = ingredients.filter((ingredient) => !selectedItems.has(ingredient));
        updateIngredients(id, updatedList).then(() => {
            setIngredients(updatedList);
            onChangeIngredients(updatedList);
            setSelectedItems(new Set());
            Alert.alert("Items Removed", "Selected items have been successfully removed.");
        }).catch((error) => {
            console.error("Failed to update ingredients:", error);
            Alert.alert("Error", "Failed to update the shopping list.");
        });
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <FlatList
                contentContainerStyle={styles.listContainer}
                data={ingredients}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Checkbox
                            value={selectedItems.has(item)}
                            onValueChange={() => toggleSelection(item)}
                        />
                        <Text style={styles.itemText}>{item}</Text>
                    </View>
                )}
            />
            <Pressable style={styles.deleteButton} onPress={confirmAndRemoveSelectedItems}>
                <Text style={styles.deleteButtonText}>Remove Selected</Text>
            </Pressable>
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
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D3D3D3", 
    marginHorizontal: 10,
  },
  itemText: {
    fontSize: 18,
    flex: 1,
    marginLeft: 15,
  },
  deleteButton: {
    backgroundColor: "#E84234",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
