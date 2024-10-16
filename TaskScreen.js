import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';

function TaskScreen({ route, navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { date } = route.params;
  const [workTime, setWorkTime] = useState('');
  const [breakTime, setBreakTime] = useState('');

  const handleCreateTask = () => {
    const newTask = {
      title,
      description,
      numPomodoros: 1, 
      workTime,
      breakTime
    };
    navigation.navigate('CalendarScreen', { task: newTask, date });
  };

  return (
    <View style={styles.container}>
      <Text>Manage task for the date: {date}</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        style={styles.inputTitle}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Task description"
        style={styles.inputDescription}
        multiline={true}
      />
     <TextInput 
        placeholder="Working time (min)" 
        value={workTime.toString()} 
        onChangeText={text => setWorkTime(Number(text))}
        keyboardType="numeric"
        style={styles.inputTitle}
     />
      <TextInput 
          placeholder="Break time (min)" 
          value={breakTime.toString()} 
          onChangeText={text => setBreakTime(Number(text))}
          keyboardType="numeric"
          style={styles.inputTitle}
      />
      <Button title="Add task" onPress={handleCreateTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    padding: 20
  },
  inputTitle: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  inputDescription: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    height: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top', // Pour faire commencer le texte en haut sur Android
  }
});

export default TaskScreen;