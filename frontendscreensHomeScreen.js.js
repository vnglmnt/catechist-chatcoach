import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const menuItems = [
    {
      id: 1,
      title: '💬 AI Chat Mentor',
      description: 'Get faithful answers to teaching questions',
      screen: 'Chat',
      color: '#3498db',
    },
    {
      id: 2,
      title: '📚 Lesson Generator',
      description: 'Create age-appropriate lesson plans',
      screen: 'Lesson',
      color: '#2ecc71',
    },
    {
      id: 3,
      title: '⛪ Catholic Resources',
      description: 'CCC, Vatican II, Church Fathers',
      screen: 'Resources',
      color: '#9b59b6',
    },
    {
      id: 4,
      title: '👩‍🏫 Teaching Strategies',
      description: 'Pedagogical methods for catechists',
      screen: 'Strategies',
      color: '#f39c12',
    },
    {
      id: 5,
      title: '🙏 Prayer Library',
      description: 'Prayers for catechists and students',
      screen: 'Prayer',
      color: '#1abc9c',
    },
    {
      id: 6,
      title: '❓ FAQ & Support',
      description: 'Common questions and answers',
      screen: 'FAQ',
      color: '#e74c3c',
    },
  ];

  const quickTopics = [
    { title: 'Explain Trinity', query: 'How to explain Trinity to children?' },
    { title: 'Eucharist Lesson', query: 'Lesson plan for Eucharist' },
    { title: 'Teaching Prayer', query: 'How to teach prayer?' },
    { title: 'Sacraments', query: 'What are the seven sacraments?' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome, Catechist!</Text>
          <Text style={styles.subtitle}>
            Your AI-assisted teaching companion for Catholic education
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <View style={styles.topicGrid}>
            {quickTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={styles.topicButton}
                onPress={() => navigation.navigate('Chat', { preset: topic.query })}
              >
                <Text style={styles.topicText}>{topic.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuCard, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About This App</Text>
          <Text style={styles.infoText}>
            Catechist ChatCoach helps volunteer catechists prepare faithful,
            engaging lessons aligned with Catholic teaching.
          </Text>
          <Text style={styles.infoSmall}>
            All content is checked against: CCC • Vatican II • Scripture • Church Fathers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  menuCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  infoBox: {
    backgroundColor: '#e8f4fc',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    marginBottom: 10,
  },
  infoSmall: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});