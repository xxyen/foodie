import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, Pressable, Image, Linking } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from "react-native-markdown-display";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchBotResponse
} from "../../../utils";

const CHAT_BOT_FACE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCaYaLt0rKBiuvTu2R_HaVwR-7GHXCvPy_w&s";
const CHAT_BOT_NAME = "FoodBot";
const CHAT_BOT_COLOR = "#E1AEC1";
const STORAGE_KEY = "CHAT_MESSAGES";

export default function ChatWithChatBot() {
  const [messages, setMessages] = useState([]);
  const [contextId] = useState(() => Math.random().toString(36).substring(2, 15));

// Load messages from AsyncStorage
    const loadMessages = async () => {
      try {
        const jsonMessages = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonMessages != null ? JSON.parse(jsonMessages) : [];
      } catch (error) {
        console.error("Failed to load messages:", error);
        return [];
      }
    };

// Save messages to AsyncStorage
  const saveMessages = async (messages) => {
    try {
      const jsonMessages = JSON.stringify(messages);
      await AsyncStorage.setItem(STORAGE_KEY, jsonMessages);
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  };

  // Clear messages from AsyncStorage
   const clearMessages = async () => {
     try {
       await AsyncStorage.removeItem(STORAGE_KEY);
     } catch (error) {
       console.error("Failed to clear messages:", error);
     }
   };

  // Initialize chatbot message
  useEffect(() => {
    const initializeChat = async () => {
      const savedMessages = await loadMessages();
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        setMessages([
          {
            _id: 1,
            text: `Hello, I am **${CHAT_BOT_NAME}**, How can I help you with food or recipes today? 😊\n\n` +
              `Here are some things you can ask me:\n\n` +
              `- **Ask for recipes**: chicken recipes or spaghetti with shrimp.\n` +
              `- **Nutrient contents**: vitamin A in 2 carrots or calories in 1 cup of butter.\n` +
              `- **Convert measurements**: 2 cups of butter in grams.\n` +
              `- **Foodie gifts**: show me some foodie gifts.\n` +
              `- **Food substitutes**: what is a substitute for flour.\n` +
              `- **Wine pairings**: which wine goes well with spaghetti carbonara.\n` +
              `- **More results**: more or more like the first/second/third....\n` +
              `- **Jokes**: tell me a joke.\n` +
              `- **Food trivia**: food trivia.`,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: CHAT_BOT_NAME,
              avatar: CHAT_BOT_FACE,
            },
          },
        ]);
      }
    };

    initializeChat();
  }, []);



   const onSend = useCallback((newMessages = []) => {
      setMessages((previousMessages) => {
        const updatedMessages = GiftedChat.append(previousMessages, newMessages);
        saveMessages(updatedMessages);
        return updatedMessages;
      });

      if (newMessages[0]?.text) {
        generateBotResponse(newMessages[0].text);
      }
    }, []);

   const generateBotResponse = async (userMessage) => {
      const botResponse = await fetchBotResponse(userMessage, contextId);

      const botReply = {
        _id: Math.random() * 9999999,
        text: botResponse.answerText,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: CHAT_BOT_NAME,
          avatar: CHAT_BOT_FACE,
        },
        media: botResponse.media,
      };

     setMessages((previousMessages) => {
         const updatedMessages = GiftedChat.append(previousMessages, botReply);
         saveMessages(updatedMessages);
         return updatedMessages;
     });
    };

const renderBubble = (props) => {
  const isMarkdown = props.currentMessage.user._id === 2; // Only bot messages use Markdown
  console.log(props.currentMessage.media);
  return (
   <Bubble
     {...props}
     wrapperStyle={{
       right: {
         backgroundColor: CHAT_BOT_COLOR, // User bubble
         borderBottomRightRadius: 0,
         borderBottomLeftRadius: 15,
         borderTopRightRadius: 15,
         borderTopLeftRadius: 15,
         padding: 5,
       },
       left: {
         backgroundColor: "#f0f0f0", // Bot bubble
         borderBottomRightRadius: 15,
         borderBottomLeftRadius: 15,
         borderTopRightRadius: 15,
         borderTopLeftRadius: 0,
         padding: 5,
       },
     }}
     renderMessageText={() => null}
     renderCustomView={
       props.currentMessage.media && props.currentMessage.media.length > 0
         ? () => (
             <View style={styles.mediaContainer}>
               <Text style={styles.messageText}>{props.currentMessage.text}</Text>
               {props.currentMessage.media.map((item, index) => (
                 <Pressable
                   key={index}
                   style={styles.mediaItem}
                   onPress={() => Linking.openURL("https://spoonacular.com/articles/8-healthy-shrimp-dinner-recipes")}
                 >
                   <Image
                     source={{ uri: item.image }}
                     style={styles.mediaImage}
                     resizeMode="cover"
                   />
                   <Text style={styles.mediaTitle}>{item.title}</Text>
                 </Pressable>
               ))}
             </View>
           )
         : isMarkdown
         ? () => (
             <Markdown style={markdownStyles}>
               {props.currentMessage.text}
             </Markdown>
           )
         : () => (
             <Text
               style={{
                 color: props.position === "left" ? CHAT_BOT_COLOR : "#fff",
                 fontSize: 16,
                 margin: 0,
               }}
             >
               {props.currentMessage.text}
             </Text>
           )
     }

   />


  );
};


  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: CHAT_BOT_COLOR,
      }}
      textInputStyle={{
        color: "white",
      }}
      placeholder={"Type a message..."}
      placeholderTextColor={"white"}
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        <FontAwesome name="send" size={24} color="white" />
      </View>
    </Send>
  );


  return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View  style={{ backgroundColor: "white" , height: "100%" }}>
      <GiftedChat
        renderMarkdown
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        minInputToolbarHeight={50}
        renderSend={renderSend}
        maxComposerHeight={200}
      />
      </View >
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 20,
  },
   mediaContainer: {
      padding: 10,
    },
    mediaItem: {
      marginBottom: 15,
      alignItems: "center",
    },
    mediaImage: {
      width: 200,
      height: 120,
      borderRadius: 10,
    },
    mediaTitle: {
      marginTop: 5,
      fontSize: 14,
      color: CHAT_BOT_COLOR,
      fontWeight: "bold",
      textAlign: "center",
    },
    messageText: {
      fontSize: 16,
      marginBottom: 10,
      color: "black",
    },
});

const markdownStyles = {
  body: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  strong: {
    fontWeight: "bold",
  },
  bullet_list: {
    marginLeft: 10,
  },
  list_item: {
    marginBottom: 5,
  },
};
