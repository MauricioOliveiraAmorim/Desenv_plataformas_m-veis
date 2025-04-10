import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { RootStackParamList } from './App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [name] = useState('Arthur');
  const [password] = useState('1234');
  const [entradaname, setEntradaname] = useState('');
  const [entradapassword, setEntradapassword] = useState('');

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginLabel}>Usuário:</Text>
      <TextInput
        style={styles.loginInput}
        placeholder="Digite seu nome"
        placeholderTextColor="#999"
        value={entradaname}
        onChangeText={setEntradaname}
      />

      <Text style={styles.loginLabel}>Senha:</Text>
      <TextInput
        style={styles.loginInput}
        placeholder="Digite sua senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={entradapassword}
        onChangeText={setEntradapassword}
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          if (entradaname === name && entradapassword === password) {
            navigation.navigate('Home');
          } else {
            Alert.alert('Erro', 'Usuário ou senha incorretos!');
          }
        }}
      >
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

