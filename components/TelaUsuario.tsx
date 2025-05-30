import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  Animated,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { collection, doc, updateDoc } from '@react-native-firebase/firestore';
import { db } from './firebaseConfig';
import { Alert } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Usuario'>;

export default function TelaUsuario() {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);
  const [modalusernameVisible, setModalusernameVisible] = useState(false);
  const [modaluseremailVisible, setModaluseremailVisible] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [modalAvatarVisible, setModalAvatarVisible] = useState(false); // modal de avatar
  // const [avatarIndex, setAvatarIndex] = useState<number | null>(null);

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


  //resolver!
  const avatarOptions = [
    // URLs externas (mantidas normalmente)
    'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
    'https://cdn-icons-png.flaticon.com/512/206/206897.png',
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    'https://cdn-icons-png.flaticon.com/512/219/219983.png',
    'https://cdn-icons-png.flaticon.com/512/6454/6454383.png', // Ícone de advogada
    // Mulher advogada com terno
    'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',

    // Homem advogado com gravata
    'https://cdn-icons-png.flaticon.com/512/4140/4140051.png',

    // Advogado com expressão séria
    'https://cdn-icons-png.flaticon.com/512/2922/2922566.png',

    // Mulher com notebook e toga (advogada moderna)
    'https://cdn-icons-png.flaticon.com/512/942/942748.png'
    // // ✅ Corrigido: sem o "assets/" no início
    // require('../assets/avatars/advogado1.png'),
    // require('../assets/avatars/advogado2.png'),
    // require('../assets/avatars/advogado3.png'),
    // require('../assets/avatars/advogado4.png'),
    // require('../assets/avatars/advogado5.png'),
    // require('../assets/avatars/advogado6.png'),
    // require('../assets/avatars/advogado7.png'),
    // require('../assets/avatars/gavel.png'),]
  ];



  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSalvarNome = async () => {

    try {
      const usuarioid = await AsyncStorage.getItem("usuarioId");
      if (!usuarioid) return;

      if (!novoNome.trim()) {
        // Alert.alert('Erro', 'Este campo nao pode estar vazio!');
        mostrarFeedback("Este campo não pode estar vazio!", false)
        return;
      }

      const usuarioReferencia = doc(db, 'cadastros', usuarioid);

      await updateDoc(usuarioReferencia, {
        nomeUser: novoNome,

      });

      setName(novoNome);

      const json = await AsyncStorage.getItem('user');
      if (json) {
        const parsed = JSON.parse(json)//transformando em JSON
        parsed.name = novoNome;
        await AsyncStorage.setItem('user', JSON.stringify(parsed));
      }
      setModalusernameVisible(false);
    } catch (error) {
      console.error('Erro ao atualizar nome no AsyncStorage:', error);
      Alert.alert('Erro', 'Não foi possível atualizar seu nome. Tente novamente.');
    }

  };

  const CancelarName = () => {
    setModalusernameVisible(false)
    setNovoNome('');
  }

  const handleSalvarEmail = async () => {
    try {
      const usuarioid = await AsyncStorage.getItem("usuarioId");
      if (!usuarioid) return;

      if (!novoEmail.trim() || !validarEmail(novoEmail.trim())) {
        // Alert.alert('Erro', 'Digite um e-mail válido!');
        mostrarFeedback("Digite um e-mail válido!", false)
        return;
      }

      const usuarioReferencia = doc(db, 'cadastros', usuarioid);

      await updateDoc(usuarioReferencia, {
        emailUser: novoEmail.trim(),

      });

      setEmail(novoEmail);

      const json = await AsyncStorage.getItem('user');
      if (json) {
        const parsed = JSON.parse(json)//transformando em JSON
        parsed.email = novoEmail;
        await AsyncStorage.setItem('user', JSON.stringify(parsed));
      }
      setModaluseremailVisible(false);
    } catch (error) {
      console.error('Erro ao atualizar email no AsyncStorage:', error);
      Alert.alert('Erro', 'Não foi possível atualizar seu Email. Tente novamente.');
    }

  };

  const CancelarEmail = () => {
    setModaluseremailVisible(false)
    setNovoEmail('');
  }


  // Animations
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(-50)).current;
  const scaleLogout = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const json = await AsyncStorage.getItem('user');
        if (json) {
          const { name: n, email: e, avatar: a } = JSON.parse(json);
          setName(n);
          setEmail(e);
          setAvatarUrl(a); // ✅ carrega direto o link
        }
      } catch (err) {
        console.error('Erro ao ler usuário:', err);
      }
    };

    carregarDadosUsuario();
  }, []);



  // Animações
  useEffect(() => {
    Animated.parallel([
      Animated.timing(avatarAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(titleAnim, {
        toValue: 0,
        useNativeDriver: true,
      })
    ]).start();
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
        onRequestClose={() => setModalLogoutVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.textoModal}>Deseja sair?</Text>
            <Text style={styles.textoModalSecundario}>Você será redirecionado para o login.</Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.botaoCancelarModal} onPress={() => setModalLogoutVisible(false)}>
                <Text style={styles.textoCancelarModal}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoConfirmarModal}
                onPress={handleLogout}>
                <Text style={styles.textoConfirmarModal}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal do nome */}
      <Modal
        transparent
        animationType="fade"
        visible={modalusernameVisible}
        onRequestClose={() => setModalusernameVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.textoModal}>Editar Nome</Text>
            <Text style={styles.textoModalSecundario}>Atualize seu nome de usuário abaixo:</Text>

            {/* Campo de input */}
            <TextInput
              style={styles.inputModal}
              placeholder="Digite o novo nome"
              placeholderTextColor="#999"
              value={novoNome}
              onChangeText={setNovoNome}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.botaoCancelarModal} onPress={CancelarName}>
                <Text style={styles.textoCancelarModal}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoConfirmarModal} onPress={handleSalvarNome}>
                <Text style={styles.textoConfirmarModal}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal de email */}
      <Modal
        transparent
        animationType="fade"
        visible={modaluseremailVisible}
        onRequestClose={() => setModaluseremailVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.textoModal}>Editar E-mail</Text>
            <Text style={styles.textoModalSecundario}>Atualize seu email de usuário abaixo:</Text>

            {/* Campo de input */}
            <TextInput
              style={styles.inputModal}
              placeholder="Digite o novo email"
              placeholderTextColor="#999"
              value={novoEmail}
              onChangeText={setNovoEmail}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.botaoCancelarModal} onPress={CancelarEmail}>
                <Text style={styles.textoCancelarModal}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoConfirmarModal} onPress={handleSalvarEmail}>
                <Text style={styles.textoConfirmarModal}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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


      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>
          Perfil do Usuário
        </Text>


        <TouchableOpacity onPress={() => setModalAvatarVisible(true)}> {/* clique para alterar avatar */}
          <Animated.Image
            source={{ uri: avatarUrl }}
            style={[styles.avatar, { opacity: avatarAnim, transform: [{ scale: avatarAnim }] }]}
          />
          <View style={styles.avatarEditIcon}>
            <Icon name="camera-outline" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Modal de escolha de avatar */}
        <Modal transparent visible={modalAvatarVisible} animationType="fade" onRequestClose={() => setModalAvatarVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.textoModal}>Escolha seu Avatar</Text>
              <ScrollView contentContainerStyle={styles.avatarGrid} horizontal={false}>
                <View style={styles.avatarWrapper}>
                  {avatarOptions.map((url, index) => (
                    <TouchableOpacity key={index} onPress={async () => {
                      setAvatarUrl(url); // atualiza na tela
                      const usuarioid = await AsyncStorage.getItem("usuarioId");
                      if (usuarioid) {
                        const usuarioReferencia = doc(db, 'cadastros', usuarioid);
                        await updateDoc(usuarioReferencia, { avatar: url }); // <-- salva no banco
                      }

                      const json = await AsyncStorage.getItem('user');
                      if (json) {
                        const parsed = JSON.parse(json);
                        parsed.avatar = url;
                        await AsyncStorage.setItem('user', JSON.stringify(parsed));
                      }

                      setModalAvatarVisible(false);
                    }}>
                      <Image source={{ uri: url }} style={styles.avatarMini} />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* <Animated.Image
          source={{ uri: 'https://www.gravatar.com/avatar/?d=mp&f=y' }}
          style={[styles.avatar, { opacity: avatarAnim, transform: [{ scale: avatarAnim }] }]}
        /> */}

        <View style={styles.infoContainer}>
          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{name || '—'}</Text>
            <TouchableOpacity onPress={() => { setModalusernameVisible(true) }}>
              <Icon name="create-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>


          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>E‑mail:</Text>
            <Text style={styles.infoValue}>{email || '—'}</Text>
            <TouchableOpacity onPress={() => { setModaluseremailVisible(true) }}>
              <Icon name="create-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleLogout }] }}>
          <TouchableOpacity
            style={styles.logoutButtonContainer}
            onPress={() => {
              Animated.sequence([
                Animated.timing(scaleLogout, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                Animated.timing(scaleLogout, { toValue: 1, duration: 100, useNativeDriver: true }),
              ]).start(() => setModalLogoutVisible(true));
            }}>
            <Icon name="log-out-outline" size={20} color="#d4af37" style={{ marginRight: 8 }} />
            <Text style={styles.logoutTextEnhanced}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Navegação inferior */}
      <View style={styles.footerNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={28} color="#d4af37" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
          <Icon name="star" size={28} color="#d4af37" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }}>
          <Icon name="person" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  inner: { padding: 20, alignItems: 'center', paddingBottom: 100 },
  title: { fontSize: 24, color: '#d4af37', fontWeight: 'bold', marginBottom: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#d4af37',
    borderWidth: 2,
    marginBottom: 24,
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: 10,
    right: -10,
    backgroundColor: '#000',
    padding: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#d4af37',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: { color: '#aaa', fontSize: 14 },
  infoValue: { color: '#fff', fontSize: 14 },
  logoutButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d4af37',
  },
  logoutTextEnhanced: { color: '#d4af37', fontWeight: 'bold', fontSize: 16 },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
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
    //   width: '90%', // <-- aumentar um pouco
    // maxHeight: '80%', // <-- permitir rolagem interna
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
  textoCancelarModal: { color: '#fff', fontWeight: 'bold' },
  botaoConfirmarModal: {
    backgroundColor: '#d4af37',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  textoConfirmarModal: { color: '#000', fontWeight: 'bold' },
  inputModal: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4af37',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    marginBottom: 20,
    fontSize: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 15,
  },

  avatarWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  avatarMini: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 8,
    borderWidth: 2,
    borderColor: '#d4af37',
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
