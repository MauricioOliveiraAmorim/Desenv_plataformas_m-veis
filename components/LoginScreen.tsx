import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import styles from './Styles';
import { RootStackParamList } from './App';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, getDocs } from '@react-native-firebase/firestore';
import { db } from './firebaseConfig';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();


  const [entradaname, setEntradaname] = useState('');
  const [entradapassword, setEntradapassword] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleButton = useRef(new Animated.Value(1)).current;

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
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.nomeUser === entradaname && data.senhaUser === entradapassword) {
            usuarioValido = true;
          }
        });
  
        if (usuarioValido) {
          navigation.navigate('Home');
        } else {
          Alert.alert('Erro', 'Usuário ou senha incorretos!');
        }
      } catch (error) {
        console.error('Erro na autenticação:', error);
        Alert.alert('Erro', 'Algo deu errado ao autenticar.');
      } finally {
        setCarregando(false); // sempre para de carregar ao final
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
      <Text style={styles.loginLabel}>Usuário:</Text>
      <TextInput
        style={styles.loginInput}
        placeholder="Digite seu nome"
        placeholderTextColor="#999"
        value={entradaname}
        onChangeText={setEntradaname}
      />

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
