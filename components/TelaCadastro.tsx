import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App'; // ajuste se o caminho do App.tsx for diferente
import { db } from './firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

export default function TelaCadastro() {
  const navigation = useNavigation<NavigationProp>();

  const [nome_user, setNome_user] = useState('');
  const [email_user, setEmail_user] = useState('');
  const [senha_user, setSenha_user] = useState('');
  const [confirmarSenha_user, setConfirmarSenha_user] = useState('');

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(senha);
  };



  const handleCadastro = async () => {

    if (senha_user !== confirmarSenha_user) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    if (!nome_user || !email_user || !senha_user || !confirmarSenha_user) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (!validarEmail(email_user.trim())) {
      Alert.alert('Erro', 'Digite um e-mail válido!');
      return;
    }

    if (!validarSenha(senha_user)) {
      Alert.alert('Erro', 'A senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.');
      return;
    }


    const avatarLink = "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"; // índice do avatar padrão
    if (nome_user && email_user && senha_user && confirmarSenha_user) {
      const novoCadastro = {

        nomeUser: nome_user,
        emailUser: email_user.trim(),
        senhaUser: senha_user,
        confirmarSenhaUser: confirmarSenha_user,
        data: new Date().toISOString(),
        avatar: avatarLink
      };
      try {
        console.log('Firestore DB:', db);
        await db.collection('cadastros').add(novoCadastro);
        Alert.alert('Sucesso', 'Cadastro registrado com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
        setNome_user('');
        setEmail_user('');
        setSenha_user('');
        setConfirmarSenha_user('');
      } catch (error) {
        Alert.alert('Erro!');
      }
    } else {
      Alert.alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho fixo com botão voltar */}

      <View style={[styles.header, { marginTop: 20, marginBottom: 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Icon name="chevron-back-outline" size={22} color="#d4af37" />
          <Text style={styles.textoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Image
          source={require('./Logo/logo.png')} // ajuste conforme seu caminho
          style={{ width: 120, height: 120, resizeMode: 'contain' }}
        />
      </View> */}
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

       {/* Critérios visuais da senha */}
      <View style={{ alignSelf: 'flex-start', marginTop: 1, marginBottom: 12 }}>
        <Text style={{ color: senha_user.length >= 8 ? 'green' : 'red' }}>
          {senha_user.length >= 8 ? '✓' : '✗'} Mínimo de 8 caracteres
        </Text>
        <Text style={{ color: /[A-Z]/.test(senha_user) ? 'green' : 'red' }}>
          {/[A-Z]/.test(senha_user) ? '✓' : '✗'} Pelo menos uma letra maiúscula
        </Text>
        <Text style={{ color: /[a-z]/.test(senha_user) ? 'green' : 'red' }}>
          {/[a-z]/.test(senha_user) ? '✓' : '✗'} Pelo menos uma letra minúscula
        </Text>
        <Text style={{ color: /\d/.test(senha_user) ? 'green' : 'red' }}>
          {/\d/.test(senha_user) ? '✓' : '✗'} Pelo menos um número
        </Text>
        <Text style={{ color: /[@$!%*#?&]/.test(senha_user) ? 'green' : 'red' }}>
          {/[@$!%*#?&]/.test(senha_user) ? '✓' : '✗'} Caractere especial (@, #, !, etc.)
        </Text>
      </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    zIndex: 10,
  },

  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  textoVoltar: {
    color: '#d4af37',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
});

