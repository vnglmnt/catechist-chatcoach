import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://localhost:8000';

export default function LessonScreen({ navigation }) {
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState('teens');
  const [duration, setDuration] = useState('60');
  const [loading, setLoading] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const ageGroups = [
    { label: 'Children (6-12)', value: 'children' },
    { label: 'Teens (13-17)', value: 'teens' },
    { label: 'Adults (18+)', value: 'adults' },
    { label: 'All Ages', value: 'all' },
  ];

  const durations = ['30', '45', '60', '90', '120'];

  const sampleTopics = [
    'Trinity',
    'Eucharist',
    'Prayer',
    'Sacraments',
    'Ten Commandments',
    'Beatitudes',
    'Mary',
    'Saints',
    'Church History',
    'Social Justice',
  ];

  const generateLesson = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/generate-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          age_group: ageGroup,
          duration_minutes: parseInt(duration),
          user_id: 'demo_user',
        }),
      });

      const data = await response.json();
      setGeneratedLesson(data);
      setModalVisible(true);
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not connect to server. Make sure backend is running on http://localhost:8000'
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderLessonPlan = () => {
    if (!generatedLesson) return null;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView style={styles.lessonScroll}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{generatedLesson.title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.lessonInfo}>
              <Text style={styles.infoItem}>
                📊 Age Group: {generatedLesson.age_group}
              </Text>
              <Text style={styles.infoItem}>
                ⏱️ Duration: {generatedLesson.duration}
              </Text>
              <Text style={styles.infoItem}>
                📅 Created: {new Date(generatedLesson.created_at).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learning Objectives</Text>
              {generatedLesson.objectives.map((obj, idx) => (
                <Text key={idx} style={styles.objectiveItem}>
                  • {obj}
                </Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Materials Needed</Text>
              {generatedLesson.materials_needed.map((material, idx) => (
                <Text key={idx} style={styles.listItem}>
                  • {material}
                </Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lesson Flow</Text>
              {generatedLesson.lesson_flow.map((step, idx) => (
                <View key={idx} style={styles.lessonStep}>
                  <Text style={styles.stepTime}>{step.time}</Text>
                  <Text style={styles.stepActivity}>{step.activity}</Text>
                  <Text style={styles.stepDetails}>{step.details}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prayer Suggestion</Text>
              <Text style={styles.prayerText}>{generatedLesson.prayer_suggestion}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reflection Questions</Text>
              {generatedLesson.reflection_questions.map((q, idx) => (
                <Text key={idx} style={styles.questionItem}>
                  {idx + 1}. {q}
                </Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>References</Text>
              <Text style={styles.referenceTitle}>Catechism:</Text>
              {generatedLesson.catechism_references.map((ref, idx) => (
                <Text key={idx} style={styles.referenceItem}>
                  • {ref}
                </Text>
              ))}
              
              <Text style={[styles.referenceTitle, { marginTop: 10 }]}>Scripture:</Text>
              {generatedLesson.scripture_references.map((ref, idx) => (
                <Text key={idx} style={styles.referenceItem}>
                  • {ref}
                </Text>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#3498db' }]}
                onPress={() => {
                  Alert.alert('Saved', 'Lesson saved to your library');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.actionButtonText}>Save Lesson</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#2ecc71' }]}
                onPress={() => {
                  // Share or export functionality
                  Alert.alert('Export', 'Export functionality would go here');
                }}
              >
                <Text style={styles.actionButtonText}>Export</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Lesson Plan Generator</Text>
          <Text style={styles.subtitle}>
            Create age-appropriate Catholic lesson plans
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Lesson Topic *</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="e.g., Eucharist, Trinity, Prayer..."
            placeholderTextColor="#95a5a6"
          />

          <Text style={styles.sampleTitle}>Sample Topics:</Text>
          <View style={styles.topicGrid}>
            {sampleTopics.map((sample, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.topicChip}
                onPress={() => setTopic(sample)}
              >
                <Text style={styles.topicChipText}>{sample}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Age Group</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={ageGroup}
              onValueChange={setAgeGroup}
              style={styles.picker}
            >
              {ageGroups.map((group, idx) => (
                <Picker.Item
                  key={idx}
                  label={group.label}
                  value={group.value}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Duration (minutes)</Text>
          <View style={styles.durationGrid}>
            {durations.map((time, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.durationChip,
                  duration === time && styles.durationChipSelected,
                ]}
                onPress={() => setDuration(time)}
              >
                <Text
                  style={[
                    styles.durationChipText,
                    duration === time && styles.durationChipTextSelected,
                  ]}
                >
                  {time} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.generateButton,
              (!topic.trim() || loading) && styles.generateButtonDisabled,
            ]}
            onPress={generateLesson}
            disabled={!topic.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.generateButtonText}>Generate Lesson Plan</Text>
                <Text style={styles.generateButtonSubtext}>
                  AI-powered • Church-aligned • Ready-to-use
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoNote}>
            <Text style={styles.infoNoteText}>
              💡 Tip: Be specific! "Eucharist for teens" works better than just "Eucharist"
            </Text>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>What You'll Get:</Text>
          <Text style={styles.exampleItem}>✓ Complete lesson flow with timing</Text>
          <Text style={styles.exampleItem}>✓ Age-appropriate activities</Text>
          <Text style={styles.exampleItem}>✓ Catechism & Scripture references</Text>
          <Text style={styles.exampleItem}>✓ Prayer and reflection questions</Text>
          <Text style={styles.exampleItem}>✓ Teaching tips and strategies</Text>
        </View>
      </ScrollView>

      {renderLessonPlan()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
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
  formCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sampleTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 20,
    marginBottom: 10,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  topicChip: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  topicChipText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  durationChip: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  durationChipSelected: {
    backgroundColor: '#3498db',
  },
  durationChipText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  durationChipTextSelected: {
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 25,
  },
  generateButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  generateButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  infoNote: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f4fc',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoNoteText: {
    color: '#2c3e50',
    fontSize: 14,
    lineHeight: 20,
  },
  exampleCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 15,
  },
  exampleItem: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
    paddingLeft: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  lessonScroll: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lessonInfo: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoItem: {
    fontSize: 15,
    color: '#2c3e50',
    marginBottom: 8,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 5,
  },
  objectiveItem: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    lineHeight: 22,
  },
  lessonStep: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  stepTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 3,
  },
  stepActivity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  stepDetails: {
    fontSize: 15,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  prayerText: {
    fontSize: 16,
    color: '#2c3e50',
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  questionItem: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 12,
    lineHeight: 22,
    paddingLeft: 5,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  referenceItem: {
    fontSize: 15,
    color: '#3498db',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});