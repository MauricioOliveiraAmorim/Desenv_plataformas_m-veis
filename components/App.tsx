import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import TelaPrincipal from './Telaprincipal';
import TelaCriacao from './TelaCriacao';
import TelaCadastro from './TelaCadastro';
import TelaProcesso from './TelaProcesso';
import TelaEditarProcesso from './TelaEditarProcesso';
import telaFavoritos from './telaFavoritos';
import TelaUsuario from './TelaUsuario';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Criação: undefined;
  Cadastro: undefined; 
  Favoritos:undefined;
  Usuario:undefined;
  Processo: { //processo espera um parametro com dados!!
    titulo: string; // corresponde a nome_Processo
    status: string; // corresponde a status_Processo
    id: string; // corresponde a numero_Processo
    tipo: string;   // corresponde a tipo_Processo
    area: string;   // corresponde a area_Processo
    numero: string; // ← novo campo obrigatório
  };  
  Editar: {
    id: string;
    titulo: string;
    status: string;
    tipo: string;
    area: string;
    numero: string;
  };
  

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
        <Stack.Screen name="Editar" component={TelaEditarProcesso} />
        <Stack.Screen name="Favoritos" component={telaFavoritos} />
        <Stack.Screen name="Usuario" component={TelaUsuario} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
