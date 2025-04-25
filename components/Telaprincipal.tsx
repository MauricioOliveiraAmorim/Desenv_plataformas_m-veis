import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { collection, getDocs } from '@react-native-firebase/firestore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


interface Processo {
  titulo: string;
  status: string;
  id: string;
  tipo: string;
  area: string;
}

const MostrarProcessos = async (): Promise<Processo[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'processos'));
    const processos: Processo[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      processos.push({
        id: data.numero_Processo,
        titulo: data.nome_Processo,
        status: data.status_Processo,
        tipo: data.tipo_Processo,
        area: data.area_Processo,
      });
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

  useEffect(() => {
    const carregarProcessos = async () => {
      const dados = await MostrarProcessos();
      setProcessos(dados);
    }
    carregarProcessos();
  }, []);
  const renderItem = ({ item }: { item: Processo }) => (//renderizar cada item da lista.
    <View style={styles.cardProcesso}>
      <View style={styles.headerProcesso}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Processo',{
          titulo: item.titulo,
          status: item.status,
          id: item.id,
          tipo: item.tipo,
          area: item.area,
        })}>
          <Icon name="star-outline" size={20} color="#d4af37" />
        </TouchableOpacity>
      </View>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.barraBusca}>
        <TextInput
          placeholder="Pesquisar processo..."
          placeholderTextColor='gray'
          style={styles.inputBusca}
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
        data={processos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => navigation.navigate('Criação')}>
        <Icon name="add" size={30} color="black" />
      </TouchableOpacity>

      {/* Barra de navegação inferior */}
      <View style={styles.barraNavegacao}>
        <TouchableOpacity>
          <Icon name="home" size={28} color="#d4af37" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="star" size={28} color="#d4af37" />
        </TouchableOpacity>
        <TouchableOpacity>
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
    width: '100%',
  },
  headerProcesso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
});
