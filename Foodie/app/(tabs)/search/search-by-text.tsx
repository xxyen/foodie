import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  GestureResponderEvent,
  Modal,
  Button,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { useState } from "react";
import {
  getFoodRecipeAutoComplete
} from "../../../utils";
import Icon from "react-native-vector-icons/Ionicons";

export default function SearchByText() {
  const router = useRouter();
  const { searchText: initialSearchText } = useLocalSearchParams();
  const [searchText, setSearchText] = useState(initialSearchText || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);


  const closeModal = () => {
    router.back();
  };

    const onChangeSearchText = async (text) => {
      setSearchText(text);
      if (!text || typeof text !== 'string' || !text.trim()) {
            setSuggestions([]);
            return;
          }
           setLoading(true);
       try {
            const data = await getFoodRecipeAutoComplete(text);
            console.log(data);
            const titles = data.map((item) => item.title);
            setSuggestions(titles);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
          }finally {
                 setLoading(false);
          }
    };

    const navigateToSearchDetails = (searchText) => {
        if (searchText) {
          router.push({
            pathname: "/search/search-details",
            params: { pressedTag: searchText, type: "text" },
          });
        } else {
          console.log("Search text is empty!");
        }
      };

  return (

   <SafeAreaView style={styles.safearea}>
     <View style={styles.container}>
     <View style={styles.searchbar}>
            <TextInput
               style={styles.search_input}
               onChangeText={onChangeSearchText}
               placeholder="What would you like to eat today?"
               placeholderTextColor="rgba(128,128,128, 0.9)"
               onFocus={onChangeSearchText}
             />
             <Icon name="search" size={24} color="gray" style={styles.icon}  onPress={() => navigateToSearchDetails(searchText)}/>
             </View>
             {loading && (
                       <ActivityIndicator
                         size="large"
                         color="#E1AEC1"
                         style={styles.loader}
                       />
                     )}
             {suggestions.length > 0 && (
               <FlatList
                 data={suggestions}
                 keyExtractor={(item, index) => index.toString()}
                 renderItem={({ item }) => (
                   <TouchableOpacity onPress={() => navigateToSearchDetails(item)}>
                     <Text style={styles.suggestionItem}>{item}</Text>
                   </TouchableOpacity>
                 )}
                 style={styles.suggestionsList}
                 contentContainerStyle={styles.flatListContainer }
               />
             )}
     </View>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
searchbar:{
 alignItems: "center",
 flexDirection: "row",
 paddingHorizontal: 20,
 height: 60,
},
 icon: {
    marginLeft: 10,
    fontSize: 30,
    color: "gray",
     lineHeight: 80,
  },
flatListContainer:{
paddingHorizontal:20,
},
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'flex-start',
  },
safearea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    gap: 10,
  },
    search_input: {
     flex: 1,
      marginTop: "5%",
      height: 60,
      width: "90%",
      backgroundColor: "rgba(217, 217, 217, 0.2)",
      borderRadius: 20,
      paddingLeft: 10,
      fontSize: 18,
      fontWeight: "bold",
    },
         loader: {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
});
