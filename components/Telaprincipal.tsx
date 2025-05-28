import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, Button, Modal, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


interface Processo {
  titulo: string;
  status: string;
  id: string;
  tipo: string;
  area: string;
  numero: string;
  data: string;
  favoritado?: boolean;// novo campo

}

const MostrarProcessos = async (): Promise<Processo[]> => {
  try {
    //puxando o favorito
    const usuarioId = await AsyncStorage.getItem('usuarioId');
    if (!usuarioId) return [];//se nao houver o doc do usuario, return

    const querySnapshot = await getDocs(collection(db, 'processos'));

    //verificando id do usuario
    const favoritosSnapshot = await getDocs(
      query(collection(db, 'favoritos'), where('userId', '==', usuarioId))
    )
    const favoritosIds = favoritosSnapshot.docs.map((doc) => doc.data().processoId);

    const processos: Processo[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      processos.push({
        id: doc.id, // ← agora é o ID do documento Firestore, não o número do processo
        titulo: data.nome_Processo,
        status: data.status_Processo,
        tipo: data.tipo_Processo,
        area: data.area_Processo,
        numero: data.numero_Processo, // ← novo campo
        data: data.data,
        favoritado: favoritosIds.includes(doc.id), // marcado se estiver na coleção favoritos

      });
    });
    const prioridadeStatus = [
      'Fase-Postulatoria',
      'Saneamento e Organização',
      'Instrução',
      'Julgamento',
      'Recursos',
      'Execução',
      'Concluido'
    ];

    processos.sort((a, b) => {
      const prioridadeA = prioridadeStatus.indexOf(a.status);
      const prioridadeB = prioridadeStatus.indexOf(b.status);

      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB; // ordena pela fase
      } else {
        return new Date(b.data).getTime() - new Date(a.data).getTime(); // se fase for igual, mais recente primeiro
      }
    });


    return processos;
  } catch (error) {
    console.error('Erro ao buscar processos:', error);
    return [];
  }
};

export default function TelaPrincipal() {
  const navigation = useNavigation<NavigationProp>();

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [processosFiltrados, setProcessosFiltrados] = useState<Processo[]>([]);
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const [termoBusca, setTermoBusca] = useState('');

  //animação
  const starScale = useRef(new Animated.Value(1)).current;

  const animarEstrela = () => {
    Animated.sequence([
      Animated.timing(starScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(starScale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      const resultado = processos.filter(p =>
        p.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||//toLowerCase transforma tudo em minuscula!
        p.numero.toLowerCase().includes(termoBusca.toLowerCase()) ||
        p.status.toLowerCase().includes(termoBusca.toLowerCase())
      );
      setProcessosFiltrados(resultado);
    }, 400); // 400ms de espera após digitação
    return () => clearTimeout(timeOut); // limpa o timeout anterior
  }), [termoBusca, processos]


  const carregarProcessos = async () => {
    const dados = await MostrarProcessos();
    setProcessos(dados);
  }

  useEffect(() => {
    carregarProcessos();
  }, []);


  const addFavorito = async (processoId: string) => {
    const usuarioId = await AsyncStorage.getItem('usuarioId');
    if (!usuarioId) return;//se nao houver o doc do usuario, return

    await addDoc(collection(db, 'favoritos'), {
      userId: usuarioId,
      processoId: processoId,
    });

    //animaçao
    setProcessos((prev) =>
      prev.map((proc) =>
        proc.id === processoId ? { ...proc, favoritado: true } : proc
      )
    );
  };

  const removerFavorito = async (processoId: string) => {
    const usuarioId = await AsyncStorage.getItem('usuarioId');
    if (!usuarioId) return;//se nao houver o doc do usuario, return

    const favoritsRef = collection(db, 'favoritos');
    const q = query(favoritsRef, where('userId', '==', usuarioId), where('processoId', '==', processoId));
    const snapshot = await getDocs(q);

    snapshot.forEach(async (fav) => {
      await deleteDoc(doc(db, 'favoritos', fav.id));
    });

    //animaçao
    setProcessos((prev) =>
      prev.map((proc) =>
        proc.id === processoId ? { ...proc, favoritado: false } : proc
      )
    );
  };


  const renderItem = ({ item }: { item: Processo }) => (//renderizar cada item da lista.
    <View style={styles.cardProcesso}>
      <View style={styles.headerProcesso}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Ação: Menu */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Processo', {
              titulo: item.titulo,
              status: item.status,
              id: item.id,
              tipo: item.tipo,
              area: item.area,
              numero: item.numero
            })}
            style={{ padding: 6 }}
          >
            <Icon name="ellipsis-horizontal-outline" size={22} color="#d4af37" />
          </TouchableOpacity>

          {/* Ação: Favorito */}
          <TouchableOpacity
            onPress={() => {
              animarEstrela();
              item.favoritado ? removerFavorito(item.id) : addFavorito(item.id);
            }}
            style={{ padding: 1 }}
          >
            <Animated.View style={{ transform: [{ scale: starScale }] }}>
              <Icon
                name={item.favoritado ? 'star' : 'star-outline'}
                size={22}
                color={item.favoritado ? '#FFD700' : '#555'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>



      </View>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.logoutContainer}>
        <Image
          source={require('./Logo/logo.png')} // ajuste o caminho se necessário
          style={{ width: 40, height: 40, resizeMode: 'contain', marginRight: 'auto' }}
        />
        <TouchableOpacity style={styles.botaoLogout} onPress={() => setModalLogoutVisible(true)}>
          <Icon name="log-out-outline" size={20} color="#d4af37" />
          <Text style={styles.textoLogout}>Logout</Text>
        </TouchableOpacity>

        <Modal
          transparent
          animationType="fade"
          visible={modalLogoutVisible}
          onRequestClose={() => setModalLogoutVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.textoModal}>Deseja sair?</Text>
              <Text style={[styles.textoModalSecundario]}>Você será redirecionado para o login.</Text>

              <View style={styles.modalBotoes}>
                <TouchableOpacity style={styles.botaoCancelarModal} onPress={() => setModalLogoutVisible(false)}>
                  <Text style={styles.textoCancelarModal}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoConfirmarModal}
                  onPress={() => {
                    setModalLogoutVisible(false);
                    navigation.navigate('Login');
                  }}
                >
                  <Text style={styles.textoConfirmarModal}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
      {/* Barra de busca */}
      <View style={styles.barraBusca}>
        <TextInput
          placeholder="Pesquisar processo..."
          placeholderTextColor='gray'
          style={styles.inputBusca}
          value={termoBusca}
          onChangeText={setTermoBusca}
        />
        <TouchableOpacity>
          <Icon name="filter" size={24} color="#d4af37" />
        </TouchableOpacity>
      </View>

      {/* Lista de processos */}
      {/* // FlatList é usada para exibir uma lista rolável de dados (como processos).
      // Ela só carrega os itens visíveis, evitando lentidão com listas grandes.
      // 'data' é a lista, 'renderItem' define como mostrar cada item, e 'keyExtractor' dá uma chave única pra cada um. */}
      <FlatList
        data={processosFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => navigation.navigate('Criação')}>
        <Icon name="add" size={30} color="black" />
      </TouchableOpacity>

      {/* Barra de navegação inferior */}
      <View style={styles.barraNavegacao}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
          <Icon name="star" size={28} color="#d4af37" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Usuario')}>
          <Icon name="person" size={28} color="#d4af37" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  barraBusca: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#d4af37',
  },
  inputBusca: {
    flex: 1,
    color: '#fff',
    paddingVertical: 5,
    fontSize: 16,
  },
  cardProcesso: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d4af37',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  status: {
    color: '#ccc',
    marginTop: 5,
  },
  botaoAdicionar: {
    backgroundColor: '#d4af37',
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 80,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  barraNavegacao: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#111',
    position: 'absolute',
    bottom: 0,
    width: '112%',
  },
  headerProcesso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  botaoLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 8,
  },
  textoLogout: {
    color: '#d4af37',
    marginLeft: 6,
    fontWeight: 'bold',
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
