import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';

function TaskListScreen({ route, navigation }) {
  const { date, tasks } = route.params;

  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <Text>Tasks for {date}</Text>
        {tasks.map((task, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Card style={{ marginVertical: 10, marginHorizontal: 20 }}>
              <Card.Content>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{task.title}</Text>
                <Paragraph>{task.description}</Paragraph>
              </Card.Content>
            </Card>
            <Button
              title="Start Pomodoro"
              onPress={() => {
                navigation.navigate('PomodoroScreen', {
                  workTime: task.workTime,
                  breakTime: task.breakTime,
                  pomodoroCount: task.numPomodoros
                });
              }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default TaskListScreen;
