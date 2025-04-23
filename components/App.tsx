import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import TelaPrincipal from './Telaprincipal';
import TelaCriacao from './TelaCriacao';
import TelaCadastro from './TelaCadastro';
import TelaProcesso from './TelaProcesso';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Criação: undefined;
  Cadastro: undefined; // 👈 Adicione essa rota
  Processo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={TelaPrincipal} />
        <Stack.Screen name="Criação" component={TelaCriacao} />
        <Stack.Screen name="Cadastro" component={TelaCadastro} />
        <Stack.Screen name="Processo" component={TelaProcesso} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
