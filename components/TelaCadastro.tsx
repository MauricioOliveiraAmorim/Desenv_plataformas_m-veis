import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App'; // ajuste se o caminho do App.tsx for diferente
import { db } from './firebaseConfig';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

export default function TelaCadastro() {
  const navigation = useNavigation<NavigationProp>();

  const [nome_user, setNome_user] = useState('');
  const [email_user, setEmail_user] = useState('');
  const [senha_user, setSenha_user] = useState('');
  const [confirmarSenha_user, setConfirmarSenha_user] = useState('');

  const handleCadastro = async () => {

    if (senha_user !== confirmarSenha_user) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    if (!nome_user || !email_user || !senha_user || !confirmarSenha_user) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    const avatarLink = "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"; // índice do avatar padrão
    if (nome_user && email_user && senha_user && confirmarSenha_user) {
      const novoProcesso = {

        nomeUser: nome_user,
        emailUser: email_user,
        senhaUser: senha_user,
        confirmarSenhaUser: confirmarSenha_user,
        data: new Date().toISOString(),
        avatar: avatarLink
      };
      try {
        console.log('Firestore DB:', db);
        await db.collection('cadastros').add(novoProcesso);
        Alert.alert('Sucesso', 'Cadastro registrado com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        setNome_user('');
        setEmail_user('');
        setSenha_user('');
        setConfirmarSenha_user('');
      } catch (error) {
        alert('Erro!');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor="#aaa"
        value={nome_user}
        onChangeText={setNome_user}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email_user}
        onChangeText={setEmail_user}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha_user}
        onChangeText={setSenha_user}
      />

      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmarSenha_user}
        onChangeText={setConfirmarSenha_user}
      />

      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    color: '#d4af37',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    color: '#d4af37',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderColor: '#d4af37',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
