import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

export default function HomeScreen() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message})
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse('Error: Make sure backend is running on http://localhost:8000');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catechist ChatCoach</Text>
        <Text style={styles.subtitle}>AI Teaching Assistant</Text>
      </View>
      
      <View style={styles.chatBox}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask about Catholic teaching..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={sendMessage} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ask AI</Text>}
        </TouchableOpacity>
        
        {response ? (
          <View style={styles.responseBox}>
            <Text style={styles.responseLabel}>Answer:</Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : null}
      </View>
      
      <View style={styles.quickButtons}>
        <Text style={styles.quickTitle}>Quick Questions:</Text>
        {['Explain Trinity', 'What is Eucharist?', 'Teach prayer'].map((q, i) => (
          <TouchableOpacity key={i} style={styles.quickBtn} onPress={() => setMessage(q)}>
            <Text style={styles.quickText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {backgroundColor: '#2c3e50', padding: 25, borderBottomLeftRadius: 20, borderBottomRightRadius: 20},
  title: {fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center'},
  subtitle: {fontSize: 16, color: '#ecf0f1', textAlign: 'center', marginTop: 5},
  chatBox: {margin: 20, backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3},
  input: {borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15},
  button: {backgroundColor: '#2c3e50', padding: 15, borderRadius: 10, alignItems: 'center'},
  buttonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  responseBox: {marginTop: 20, padding: 15, backgroundColor: '#e8f4fc', borderRadius: 10},
  responseLabel: {fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5},
  responseText: {fontSize: 16, color: '#34495e', lineHeight: 22},
  quickButtons: {margin: 20, marginTop: 0},
  quickTitle: {fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10},
  quickBtn: {backgroundColor: '#ecf0f1', padding: 15, borderRadius: 10, marginBottom: 10},
  quickText: {fontSize: 16, color: '#2c3e50'},
});