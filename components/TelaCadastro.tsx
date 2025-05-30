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
  Modal,
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

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [modalVisibleSucess, setModalVisibleSucess] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mensagemModal, setMensagemModal] = useState('');

  const mostrarFeedback = (mensagem: string, sucessoFlag: boolean) => {
    setMensagemModal(mensagem);
    setSucesso(sucessoFlag);
    setModalVisibleSucess(true);
  };

  const fecharModal = () => {
    setModalVisibleSucess(false);
    // if (sucesso) {
    //   navigation.navigate('Home');
    // }
  };


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
      mostrarFeedback('As senhas não coincidem!', false);
      return;
    }

    if (!nome_user || !email_user || !senha_user || !confirmarSenha_user) {
      mostrarFeedback('Preencha todos os campos!', false);
      return;
    }

    if (!validarEmail(email_user.trim())) {
      mostrarFeedback('Digite um e-mail válido!', false);
      return;
    }

    if (!validarSenha(senha_user)) {
      mostrarFeedback('A senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.', false);
      return;
    }

    const querySnapshot = await db
      .collection('cadastros')
      .where('emailUser', '==', email_user.trim().toLowerCase())
      .get();

    if (!querySnapshot.empty) {
      mostrarFeedback('Já existe um cadastro com esse e-mail!', false);
      return;
    }


    const avatarLink = "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"; // índice do avatar padrão
    if (nome_user && email_user && senha_user && confirmarSenha_user) {
      const novoCadastro = {

        nomeUser: nome_user,
        emailUser: email_user.trim().toLowerCase(),
        senhaUser: senha_user,
        confirmarSenhaUser: confirmarSenha_user,
        data: new Date().toISOString(),
        avatar: avatarLink
      };
      try {

        console.log('Firestore DB:', db);
        await db.collection('cadastros').add(novoCadastro);
        // Alert.alert('Sucesso', 'Cadastro registrado com sucesso!', [
        //   { text: 'OK', onPress: () => navigation.navigate('Login') },
        // ]);
        mostrarFeedback("Cadastro registrado com sucesso!", true)
        setTimeout(() => {
          navigation.navigate('Login')
        }, 2000);
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
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputComIcone}
          placeholder="Digite sua senha"
          placeholderTextColor="#aaa"
          secureTextEntry={!mostrarSenha}
          value={senha_user}
          onChangeText={setSenha_user}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Icon
            name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#d4af37"
          />
        </TouchableOpacity>
      </View>

      {/* Modal Personalizado */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisibleSucess}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalContainerPersonalizado}>
          <View style={styles.modalBoxPersonalizado}>
            <Text style={[styles.textoModalPersonalizado, { color: sucesso ? '#00ff00' : '#ff4444' }]}>
              {mensagemModal}
            </Text>
            <TouchableOpacity onPress={fecharModal} style={styles.fecharBotaoPersonalizado}>
              <Text style={styles.fecharTextoPersonalizado}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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
    marginBottom: 15,
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
  inputWrapper: {
    flexDirection: 'row',       // 💡 Coloca input e ícone lado a lado
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderColor: '#d4af37',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  inputComIcone: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
  },
  modalContainerPersonalizado: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBoxPersonalizado: {
    backgroundColor: '#1c1c1c',
    padding: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
    alignItems: 'center',
    width: 325
  },
  textoModalPersonalizado: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fecharBotaoPersonalizado: {
    backgroundColor: '#d4af37',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  fecharTextoPersonalizado: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },

});

