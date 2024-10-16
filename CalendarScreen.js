import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import TaskListScreen from './TaskListScreen'; 
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';



function CalendarScreen({ navigation, route }) {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0];
  const [tasks, setTasks] = useState({});
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(currentDateString); // Utilisez la date actuelle comme valeur par défaut
  const [dotMarkedDates, setDotMarkedDates] = useState({});

  useEffect(() => {
    // chargement des taches de l'async storage lors du chargement de l'application 
    const loadTasks = async () => {
      try {
        const tasksData = await AsyncStorage.getItem('tasks');
        if (tasksData !== null) {
          const tasksFromStorage = JSON.parse(tasksData);
          setTasks(tasksFromStorage);

          // je formate les jours avec les taches pour avoir le marqueur rouge 
          const markedDates = {};

          // Je parcours toutes les dates qui ont des tâches
          for (const date in tasksFromStorage) {
            markedDates[date] = { marked: true, dotColor: 'red' };
          }

          // Je m'assure que la date actuelle est également marquée
        markedDates[currentDateString] = {
          ...markedDates[currentDateString], // Gardez les marqueurs existants s'ils sont présents
          selected: true,
          marked: true,
          selectedColor: '#27ae60'
        };
        

          setDotMarkedDates(markedDates);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des tâches depuis AsyncStorage :', error);
      }
    };

    loadTasks();
  }, []);


  // Rendu des taches dans une liste d'item pour afficher les taches quotidiennes
  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItemContainer}>
      <Text style={styles.taskItemTitle}>{item.title}</Text>
    </View>
  );

  // maj des tâches + sauvegarde dans l'async storage 
  useEffect(() => {
    if (route.params?.task) {
      const date = route.params.date;
      const task = route.params.task;
  
      const existingTasks = { ...tasks };
  
      existingTasks[date] = [...(existingTasks[date] || []), task];
  
      setTasks(existingTasks);

      // maj des marqueurs qd y'a une nvl tache pr que le marqueur s'ajoute direct
    setDotMarkedDates((prevMarkedDates) => ({
      ...prevMarkedDates,
      [date]: { marked: true, dotColor: 'red' },
    }));
  
      // Sauvegarde
      AsyncStorage.setItem('tasks', JSON.stringify(existingTasks))
        .catch(error => console.error('Erreur lors de la sauvegarde des tâches dans AsyncStorage :', error));
    }
  }, [route.params?.task]);
  
  
  const displayTasksForDate = (date) => {
    const tasksForDate = tasks[date] || [];
    alert('Tâches pour ' + date + ':\n' + tasksForDate.map(task => task.title + ': ' + task.description).join('\n')); // le .map sert à transformer chaque date en string pour pouvoir l'affficher et le .join assemble tt les string  
  };


  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setOptionsModalVisible(true);
          }}

          markedDates={{
            ...dotMarkedDates,
            [currentDateString]: {
              selected: true,
              marked: true,
              selectedColor: '#27ae60',
              selectedTextColor: 'white',
              textStyle: { fontWeight: 'bold', color: 'white' },
            },
          }}

          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#2c3e50',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#27ae60',
            dayTextColor: '#2c3e50',
            textDisabledColor: '#d9e1e8',
            arrowColor: '#27ae60',
            monthTextColor: '#27ae60',
          }}
          style={styles.calendar}
        />
      </View>
        
       <View style={styles.todaysTasksContainer}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        <FlatList
          data={tasks[currentDateString] || []}
          renderItem={({ item }) => (
            <View style={styles.taskItemContainer}>
              <Text style={styles.taskItemTitle}>{item.title}</Text>
            </View> 
          )}
          keyExtractor={(item, index) => `task-${index}`}
        />
      </View>
      <Modal isVisible={isOptionsModalVisible}>
        <View style={styles.modalContainer}>
          <Text>Options for the date: {selectedDate}</Text>
          <Button
            title="Display tasks"
            onPress={() => {
              setOptionsModalVisible(false);
              const tasksForSelectedDate = tasks[selectedDate] || [];
              navigation.navigate('TaskListScreen', { date: selectedDate, tasks: tasksForSelectedDate});
            }}
          />
          <Button
            title="Create a new task"
            onPress={() => {
              navigation.navigate('TaskScreen', { date: selectedDate });
              setOptionsModalVisible(false);
            }}
          />
          <Button title="Close" onPress={() => setOptionsModalVisible(false)} />
        </View>
      </Modal>
      
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // pour aligner le contenu vers le haut
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 20, // espace supplémentaire en haut pour éviter que le contenu ne soit trop collé
  },
  calendarContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '95%', 
    height: '50%', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 10,
  },

  calendar: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },

  modalContainer: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000', // ajout d'ombre pour le mettre en évidence
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  todaysTasksContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
    backgroundColor: '#f7f7f7', 
  },
  taskItemContainer: {
    backgroundColor: '#ffffff',
    padding: 12, 
    marginVertical: 8, 
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, 
    shadowOpacity: 0.08, 
    elevation: 3, 
  },
  taskItemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default CalendarScreen;