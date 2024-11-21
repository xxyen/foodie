import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from "react-native-markdown-display";


const CHAT_BOT_FACE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRCaYaLt0rKBiuvTu2R_HaVwR-7GHXCvPy_w&s";
const CHAT_BOT_NAME = "FoodBot";
const CHAT_BOT_COLOR = "#671ddf";

const SPOONACULAR_API_KEY = "chick";
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/food/converse";

export default function ChatWithChatBot() {
  const [messages, setMessages] = useState([]);
  const [contextId] = useState(() => Math.random().toString(36).substring(2, 15));

  // Initialize chatbot message
useEffect(() => {
  // Ensure the introductory message is added only once
  if (messages.length === 0) {
    setMessages([
      {
        _id: 1,
        text: `Hello, I am **${CHAT_BOT_NAME}**, How can I help you with food or recipes today? 😊\n\n` +
          `Here are some things you can ask me:\n\n` +
          `- **Ask for recipes**: 'chicken recipes' or 'spaghetti with shrimp'.\n` +
          `- **Nutrient contents**: 'vitamin A in 2 carrots' or 'calories in 1 cup of butter'.\n` +
          `- **Convert measurements**: '2 cups of butter in grams'.\n` +
          `- **Foodie gifts**: 'show me some foodie gifts'.\n` +
          `- **Food substitutes**: 'what is a substitute for flour'.\n` +
          `- **Wine pairings**: 'which wine goes well with spaghetti carbonara'.\n` +
          `- **More results**: 'more' or 'more like the first/second/third...'.\n` +
          `- **Jokes**: 'tell me a joke'.\n` +
          `- **Food trivia**: 'food trivia'.`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: CHAT_BOT_NAME,
          avatar: CHAT_BOT_FACE,
        },
      },
    ]);
  }
}, [messages.length]);



  const onSend = useCallback((messages = []) => {
    // Append user message to chat
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    console.log("3333333333333");

    // Generate bot response
    if (messages[0]?.text) {
      generateBotResponse(messages[0].text);
    }
  }, []);

  const generateBotResponse = async (userMessage) => {
    try {
      const response = await fetch(
        `${SPOONACULAR_BASE_URL}?text=${encodeURIComponent(userMessage)}&contextId=${contextId}&apiKey=${SPOONACULAR_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botReplyText = data.answerText || "I'm sorry, I couldn't find an answer to that.";

      const botReply = {
        _id: Math.random() * 9999999,
        text: botReplyText,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: CHAT_BOT_NAME,
          avatar: CHAT_BOT_FACE,
        },
      };
      console.log("222222222222222");
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, botReply)
      );
    } catch (error) {
      const errorReply = {
        _id: Math.random() * 9999999,
        text: "Sorry, I encountered an error while fetching the data. Please try again.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: CHAT_BOT_NAME,
          avatar: CHAT_BOT_FACE,
        },
      };
      console.log("11111111111111111");
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, errorReply)
      );
    }
  };

const renderBubble = (props) => {
  console.log(props);
  const isMarkdown = props.currentMessage.user._id === 2; // Only bot messages use Markdown
  console.log(isMarkdown);
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: CHAT_BOT_COLOR, // User bubble
        },
        left: {
          backgroundColor: "#f0f0f0", // Bot bubble
        },
      }}
      renderCustomView={
        isMarkdown
          ? () => (
              <Markdown style={markdownStyles}>
                {props.currentMessage.text}
              </Markdown>
            )
          : null
      }
      textStyle={
        isMarkdown
          ? {} // Prevent default text rendering for Markdown messages
          : {
              right: {
                color: "#fff", // User text
              },
              left: {
                color: CHAT_BOT_COLOR, // Bot text
              },
            }
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
        color: "#fff",
      }}
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
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1, // Current user ID
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
});

const markdownStyles = {
  body: {
    fontSize: 16,
    color: "black",
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