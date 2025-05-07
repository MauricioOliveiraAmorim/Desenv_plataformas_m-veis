import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Usuario'>;

export default function TelaUsuario() {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('user');
        if (json) {
          const { name: n, email: e } = JSON.parse(json);
          setName(n);
          setEmail(e);
        }
      } catch (err) {
        console.error('Erro ao ler usuário:', err);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setName('');
    setEmail('');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal de Logout */}
      <Modal
        transparent
        animationType="fade"
        visible={modalLogoutVisible}
        onRequestClose={() => setModalLogoutVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.textoModal}>Deseja sair?</Text>
            <Text style={styles.textoModalSecundario}>Você será redirecionado para o login.</Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.botaoCancelarModal} onPress={() => setModalLogoutVisible(false)}>
                <Text style={styles.textoCancelarModal}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoConfirmarModal} onPress={handleLogout}>
                <Text style={styles.textoConfirmarModal}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Perfil do Usuário</Text>

        <Image
          source={{ uri: 'https://www.gravatar.com/avatar/?d=mp&f=y' }}
          style={styles.avatar}
        />

        <View style={styles.infoContainer}>
          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{name || '—'}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>E‑mail:</Text>
            <Text style={styles.infoValue}>{email || '—'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButtonContainer} onPress={() => setModalLogoutVisible(true)}>
          <Icon name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutTextEnhanced}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Navegação inferior */}
      <View style={styles.footerNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={28} color="#d4af37" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
          <Icon name="star" size={28} color="#d4af37" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="person" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  inner: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    color: '#d4af37',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#d4af37',
    borderWidth: 2,
    marginBottom: 24,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
  },
  logoutButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutTextEnhanced: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1c1c1c',
    padding: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
    alignItems: 'center',
    width: '80%',
  },
  textoModal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  textoModalSecundario: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  botaoCancelarModal: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  textoCancelarModal: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoConfirmarModal: {
    backgroundColor: '#d4af37',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  textoConfirmarModal: {
    color: '#000',
    fontWeight: 'bold',
  },
});
