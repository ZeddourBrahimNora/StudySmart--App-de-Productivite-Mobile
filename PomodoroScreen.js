import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Vibration, Platform } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av'; 
import Modal from 'react-native-modal';



const PomodoroScreen = ({ route }) => {
  const { workTime, breakTime, pomodoroCount} = route.params;
  const [remainingPomodoros, setRemainingPomodoros] = useState(pomodoroCount);
  const radius = 100;
  const circleCircumference = 2 * Math.PI * radius;

  const [isWorking, setIsWorking] = useState(true);
  const [totalTime, setTotalTime] = useState(workTime * 60);
  const [passedTime, setPassedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [strokeDashoffset, setStrokeDashoffset] = useState(circleCircumference);  

  const [isModalVisible, setModalVisible] = useState(false);

  const intervalRef = useRef(null); // Ajout d'une référence pour l'intervalle


  

  // pour jouer une notification de son lorsqu'on passe a la pause
  const playSound = async () => {
    const soundObject = new Audio.Sound();
    try {
        await soundObject.loadAsync(require('./notificationSound.mp3'));
        await soundObject.playAsync();
    } catch (error) {
        console.error(error);
    }
  };
  // ici on verifie la plateforme et en fonction de la plateforme je joue le son de la notification car =/= import biblio selon la plateforme qu'on vise
  const handleVibration = () => {
    if (Platform.OS === 'android') {
      Vibration.vibrate();
    } else if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };


  useEffect(() => {
    if (isRunning && remainingPomodoros > 0) {
      console.log('Starting interval');
      intervalRef.current = setInterval(() => {
        setPassedTime(prevTime => {
          const newTime = prevTime + 1;

          if (newTime >= totalTime) {
            handleVibration();
            playSound();

            if (isWorking) {
              setIsWorking(false); // Passer à la phase de pause
              setTotalTime(breakTime * 60);
            } else {
              setIsWorking(true); // Revenir à la phase de travail
              setTotalTime(workTime * 60);

              setRemainingPomodoros(prevPomodoros => prevPomodoros - 1); // Décrémenter les Pomodoros après chaque cycle complet (travail+pause)
              if (remainingPomodoros - 1 <= 0) {
                setTimeout(() => setModalVisible(true), 0); // Afficher le modal si c'était le dernier cycle
              }
            }

            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () =>
    {
      clearInterval(intervalRef.current);
    } 
  }, [isRunning, isWorking, totalTime, breakTime, workTime, remainingPomodoros]);
  
  
  useEffect(() => {
    if (remainingPomodoros <= 0) {
      setIsRunning(false);
    }
  }, [remainingPomodoros]);
  


  useEffect(() => {
    const elapsedPercentage = (passedTime / totalTime);
    const offset = circleCircumference - (circleCircumference * elapsedPercentage);
    setStrokeDashoffset(offset);
  }, [passedTime]);

  const minutes = Math.floor((totalTime - passedTime) / 60);
  const seconds = (totalTime - passedTime) % 60;

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setRemainingPomodoros(pomodoroCount)
    setIsRunning(false);
    setIsWorking(true);
    setPassedTime(0);
    setTotalTime(workTime * 60);
  };

  return (
    <View style={styles.container}>
      <Svg width="220" height="220">
        <Rect
          x="0"
          y="0"
          width="220"
          height="220"
          fill="#ffffff"
        />
        <Circle
          cx="110"
          cy="110"
          r={radius}
          strokeWidth="10"
          stroke="#e5e5e5"
          fill="#ffffff" 
        />
        <Circle
          cx="110"
          cy="110"
          r={radius}
          strokeWidth="10"
          fill="#ffffff" 
          stroke="#3498db"
          strokeLinecap="round"
          strokeDasharray={circleCircumference}
          strokeDashoffset={strokeDashoffset}
          transform={{ rotation: -90, originX: 110, originY: 110 }}
        />
      </Svg>
      <View style={styles.timerTextContainer}>
        <Text style={styles.timerText}>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title={isRunning ? 'Pause' : 'Start'} onPress={toggleTimer} color="#3498db" />
        <Button title="Reset" onPress={resetTimer} color="#e74c3c" />
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Congratulations</Text>
        </View>
        <Text style={styles.modalMessage}>
          You did a great job and completed your task!
        </Text>
        <Button
          title="Great!"
          onPress={() => setModalVisible(false)}
          color="#3498db"
        />
      </View>
    </Modal>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  timerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4a4a4a'
  },
  modalMessage: {
    fontSize: 16,
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default PomodoroScreen;