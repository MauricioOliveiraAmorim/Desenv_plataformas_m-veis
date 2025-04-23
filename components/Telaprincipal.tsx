import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


interface Processo {
  id: string;
  titulo: string;
  status: string;
}

const processosMock: Processo[] = [
  { id: '1', titulo: 'Processo 1', status: 'Em andamento' },
  { id: '2', titulo: 'Processo 2', status: 'Concluído' },
];

export default function TelaPrincipal() {
  const navigation = useNavigation<NavigationProp>();


  const renderItem = ({ item }: { item: Processo }) => (
    <View style={styles.cardProcesso}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <TouchableOpacity>
          <Icon name="star-outline" size={20} color="#d4af37" onPress={() => navigation.navigate('Processo')}/>
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
        data={processosMock}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => navigation.navigate('Criação')}>
        <Icon name="add" size={30} color="black" />
      </TouchableOpacity>

      {/* Botão de adicionar
      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => Alert.alert("Adicionando Processo!")}>
        <Icon name="add" size={30} color='white' />
      </TouchableOpacity> */}

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
});
