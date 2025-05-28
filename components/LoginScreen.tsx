import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import styles from './Styles';
import { RootStackParamList } from './App';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, getDocs } from '@react-native-firebase/firestore';
import { db } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [entradaemail, setEntradaemail] = useState('');
  const [entradapassword, setEntradapassword] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleButton = useRef(new Animated.Value(1)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [mensagemModal, setMensagemModal] = useState('');

  const fecharModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    setCarregando(true);

    setTimeout(async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cadastros'));

        let usuarioValido = false;
        let usuarioId = ''; // ← Captura o ID do usuário
        let usuarioData: any = null;



        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.emailUser === entradaemail && data.senhaUser === entradapassword) {
            usuarioValido = true;
            usuarioId = doc.id; // ← Aqui você captura o doc.id
            usuarioData = data; // ← salva os dados aqui
          }
        });

        if (usuarioValido) {
          // Armazene o usuário logado (doc.id) com AsyncStorage ou Context
          await AsyncStorage.setItem('usuarioId', usuarioId); // ← salvar localmente
          await AsyncStorage.setItem('user', JSON.stringify({
            name: usuarioData.nomeUser,
            email: usuarioData.emailUser, // use '' se o campo for opcional
            avatar: usuarioData.avatar
          }));
          navigation.navigate('Home');
        } else {
          setMensagemModal('Usuários ou senha incorretos!');
          setModalVisible(true);
        }
      } catch (error) {
        console.error('Erro na autenticação:', error);
        Alert.alert('Erro', 'Algo deu errado ao autenticar.');
      } finally {
        setCarregando(false);
      }
    }, 1500);
  };

  const animarBotao = () => {
    Animated.sequence([
      Animated.timing(scaleButton, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleButton, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => handleLogin());
  };

  return (
    <Animated.View style={[styles.loginContainer, { opacity: fadeAnim }]}>

      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Image
          source={require('./Logo/logo.png')} // ajuste o caminho conforme necessário
          style={{ width: 160, height: 160, resizeMode: 'contain' }}
        />
      </View>

      <Text style={styles.loginLabel}>E-mail:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[
            styles.loginInput,
            { flex: 1 },]}
          placeholder="Digite seu E-mail"
          placeholderTextColor="#999"
          value={entradaemail}
          onChangeText={setEntradaemail}
        />
        <Icon
          name={'person'}
          size={24}
          color="#d4af37"
          style={{ marginLeft: 8 }}
        />
      </View>

      <Text style={styles.loginLabel}>Senha:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[
            styles.loginInput,
            { flex: 1 },
            mostrarSenha && { borderColor: '#FFD700', borderWidth: 2 },
          ]}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry={!mostrarSenha}
          value={entradapassword}
          onChangeText={setEntradapassword}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Icon
            name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#d4af37"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: -10,marginBottom:20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('RedefinirSenha')}>
          <Text style={{ color: '#d4af37', fontSize: 14, textDecorationLine: 'underline' }}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={[styles.textoModal, { color: '#ff4444' }]}>
              {mensagemModal}
            </Text>
            <TouchableOpacity onPress={fecharModal} style={styles.fecharBotao}>
              <Text style={styles.fecharTexto}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {carregando ? (
        <ActivityIndicator size="large" color="#d4af37" style={{ marginTop: 20 }} />
      ) : (
        <Animated.View style={{ transform: [{ scale: scaleButton }] }}>
          <TouchableOpacity style={styles.loginButton} onPress={animarBotao}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Cadastro')}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: '#d4af37', textAlign: 'center', textDecorationLine: 'underline' }}>
          Não tem uma conta? Cadastre-se
        </Text>
      </TouchableOpacity>


    </Animated.View>
  );
}
