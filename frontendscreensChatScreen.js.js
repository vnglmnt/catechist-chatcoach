import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const API_URL = 'http://localhost:8000'; // Change to your computer's IP for mobile

export default function ChatScreen({ navigation, route }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Catholic teaching assistant. I can help with doctrine, lesson planning, teaching strategies, and more. What would you like to know?",
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const userId = 'demo_user_123';

  // Check for preset query from HomeScreen
  useEffect(() => {
    if (route.params?.preset) {
      setInput(route.params.preset);
      // Auto-send after a moment
      setTimeout(() => {
        handleSend();
      }, 500);
    }
  }, [route.params]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          user_id: userId,
        }),
      });

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        teaching_tip: data.teaching_tip || '',
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: "⚠️ Could not connect to server. Please make sure the backend is running on http://localhost:8000",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userContainer : styles.botContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={[
          styles.messageText,
          item.sender === 'user' && styles.userText
        ]}>
          {item.text}
        </Text>
        
        {item.sources && item.sources.length > 0 && (
          <View style={styles.sourcesContainer}>
            <Text style={styles.sourcesLabel}>Sources:</Text>
            {item.sources.map((source, idx) => (
              <Text key={idx} style={styles.sourceItem}>• {source}</Text>
            ))}
          </View>
        )}
        
        {item.teaching_tip && (
          <View style={styles.tipContainer}>
            <Text style={styles.tipLabel}>💡 Teaching Tip:</Text>
            <Text style={styles.tipText}>{item.teaching_tip}</Text>
          </View>
        )}
        
        {item.isError && (
          <Text style={styles.errorText}>Connection Error - Check backend server</Text>
        )}
      </View>
      
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );

  const suggestedQuestions = [
    "How do I explain the Trinity?",
    "What's a good Eucharist lesson for teens?",
    "How to teach prayer to children?",
    "What are the sacraments of initiation?",
    "Help with lesson on Ten Commandments",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Teaching Mentor</Text>
          <Text style={styles.headerSubtitle}>
            Answers aligned with Catholic teaching
          </Text>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Start a conversation with your AI teaching mentor
              </Text>
            </View>
          }
        />

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsContainer}
          >
            {suggestedQuestions.map((question, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionButton}
                onPress={() => {
                  setInput(question);
                  // Auto-send
                  setTimeout(() => handleSend(), 100);
                }}
              >
                <Text style={styles.suggestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about teaching, doctrine, or lesson ideas..."
            placeholderTextColor="#95a5a6"
            multiline
            maxLength={500}
            editable={!loading}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ⚠️ Always verify with official Church teaching. AI responses are 
            informational aids for catechists.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 15,
    borderRadius: 18,
    marginBottom: 5,
  },
  userBubble: {
    backgroundColor: '#3498db',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  sourcesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  sourcesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 5,
  },
  sourceItem: {
    fontSize: 13,
    color: '#3498db',
    fontStyle: 'italic',
    marginLeft: 5,
  },
  tipContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f39c12',
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 3,
  },
  tipText: {
    fontSize: 14,
    color: '#7d6608',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 8,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    color: '#95a5a6',
    alignSelf: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  suggestionsContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  suggestionButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  suggestionText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingTop: 12,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#2c3e50',
    borderRadius: 22,
    paddingHorizontal: 25,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 10,
    backgroundColor: '#e8f4fc',
    borderTopWidth: 1,
    borderTopColor: '#3498db',
  },
  footerText: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 16,
  },
});