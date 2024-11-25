import { View, Text, StyleSheet, SafeAreaView, Pressable, FlatList, Alert } from "react-native";
import { useAppContext } from "@/context/contexts";
import { useState, useEffect } from "react";
import { getProfile } from "@/utils";
import { changeAllergies } from "@/utils";
import ExtraAllergies from "./ExtraAllergies";

export default function AllergiesList() {
    const { id, allergies, onChangeAllergies } = useAppContext();
    const [userInfo, setUserInfo] = useState<IUserInfo | undefined>(undefined);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); 

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
        const updatedList = allergies.filter(
          (allergy) => !selectedItems.has(allergy)
        );
        changeAllergies(id, updatedList)
          .then(() => {
            onChangeAllergies(updatedList);
            setSelectedItems(new Set());
            Alert.alert("Items Removed", "Selected allergies have been successfully removed.");
        })
        .catch((error) => {
            console.error("Failed to update allergies:", error);
            Alert.alert("Error", "Failed to update the allergy list.");
        });
    };

    return (
        <SafeAreaView style={styles.safearea}>
            <View style={styles.containerTitle}>
                <Text style={styles.title}>Allergies</Text>
                <Text style={styles.subtitle}>{`${allergies.length} Items`}</Text>
            </View>
            <FlatList
                contentContainerStyle={styles.container}
                data={allergies}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        style={[
                            styles.item,
                            selectedItems.has(item) && styles.itemSelected,
                        ]}
                        onPress={() => toggleSelection(item)}
                    >
                        <Text
                            style={[
                                styles.text,
                                selectedItems.has(item) && styles.textSelected,
                            ]}
                        >
                            {item}
                        </Text>
                    </Pressable>
                )}
            />
            <Pressable
                style={styles.deleteButton}
                onPress={confirmAndRemoveSelectedItems}
            >
                <Text style={styles.deleteButtonText}>Remove Allergy</Text>
            </Pressable>
            <Pressable
                style={styles.addButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.addButtonText}>Add Allergy</Text>
            </Pressable>
            <ExtraAllergies
                visible={isModalVisible}
                onChangeVisible={setIsModalVisible}
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
  containerTitle: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10, 
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    marginLeft: 10,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    borderRadius: 20,
    padding: 10,
  },
  item: {
    width: "100%",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", 
    marginVertical: 5,
    paddingHorizontal: 15, 
  },
  itemSelected: {
    backgroundColor: "#000000",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  textSelected: {
    color: "#FFFFFF",
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
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginHorizontal: 20,
    marginBottom: 20,
},
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});
