import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CalendarScreen from './CalendarScreen'; 
import TaskScreen from './TaskScreen';
import TaskListScreen from './TaskListScreen';
import PomodoroScreen from './PomodoroScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CalendarScreen">
        <Stack.Screen 
            name="CalendarScreen" 
            component={CalendarScreen}
            options={{ 
                title: 'StudySmart',
                headerTitleStyle: {
                    color: '#27ae60', 
                    fontSize: 30,     
                    fontWeight: 'bold'
                }
            }} 
        />
        <Stack.Screen 
            name="TaskScreen" 
            component={TaskScreen} 
            options={{ 
              title: 'StudySmart',
              headerTitleStyle: {
                color: '#27ae60', 
                fontSize: 30,    
                fontWeight: 'bold'
            }
          }}

        />

        <Stack.Screen 
          name="TaskListScreen" 
          component={TaskListScreen} 
          options={{ 
            title: 'StudySmart',
            headerTitleStyle: {
              color: '#27ae60', 
              fontSize: 30,    
              fontWeight: 'bold'
            }
          }}
        />

        <Stack.Screen 
          name="PomodoroScreen" 
          component={PomodoroScreen}  
          options={{ 
            title: 'StudySmart',
            headerTitleStyle: {
              color: '#27ae60', 
              fontSize: 30,    
              fontWeight: 'bold'
            }
          }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;