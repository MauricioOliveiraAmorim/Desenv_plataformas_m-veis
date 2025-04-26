import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { RootStackParamList } from './App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { db } from './firebaseConfig';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Editar'>;

export default function TelaEditarProcesso() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'Editar'>>();
  const { id, titulo, status, tipo, area, numero } = route.params;

  const [nome_process, setNome_process] = useState(titulo);
  const [numero_process, setNumero_process] = useState(numero);
  const [tipo_process, setTipo_process] = useState(tipo);
  const [area_process, setArea_process] = useState(area);
  const [status_process, setStatus_process] = useState(status);

  const navegandoComAlert = () => {
    navigation.navigate('Home');
    Alert.alert('Edição do processo cancelada!');
  };

  const atualizarProcesso = async () => {
    if (nome_process && numero_process && tipo_process && area_process && status_process) {
      try {
        await db.collection('processos').doc(id).update({
          nome_Processo: nome_process,
          numero_Processo: numero_process,
          tipo_Processo: tipo_process,
          area_Processo: area_process,
          status_Processo: status_process,
        });

        Alert.alert('Sucesso', 'Processo atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
      } catch (error) {
        console.error('Erro ao atualizar processo:', error);
        Alert.alert('Erro!', 'Não foi possível atualizar o processo.');
      }
    } else {
      Alert.alert('Erro!', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.tituloSecao}>· INFORMAÇÕES DO PROCESSO</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Nome do Processo</Text>
        <TextInput
          placeholder="Nome do Processo"
          style={styles.input}
          placeholderTextColor="#aaa"
          value={nome_process}
          onChangeText={setNome_process}
        />

        <Text style={styles.label}>Número do Processo</Text>
        <TextInput
          placeholder="Número do Processo"
          style={[styles.input, { backgroundColor: '#111' }]}
          placeholderTextColor="#aaa"
          value={numero_process}
          onChangeText={setNumero_process}
        />

        <Text style={styles.label}>Tipo do Processo</Text>
        <TextInput
          placeholder="Tipo do Processo"
          style={styles.input}
          placeholderTextColor="#aaa"
          value={tipo_process}
          onChangeText={setTipo_process}
        />

        <Text style={styles.label}>Área do Direito</Text>
        <TextInput
          placeholder="Área do Direito"
          style={styles.input}
          placeholderTextColor="#aaa"
          value={area_process}
          onChangeText={setArea_process}
        />

        <Text style={styles.label}>Status do Processo</Text>
        <TextInput
          placeholder="Status do Processo"
          style={styles.input}
          placeholderTextColor="#aaa"
          value={status_process}
          onChangeText={setStatus_process}
        />
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botaoCancelar} onPress={navegandoComAlert}>
          <Text style={styles.botaoTextoCancelar}>CANCELAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCriar} onPress={atualizarProcesso}>
          <Text style={styles.botaoTextoCriar}>SALVAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  tituloSecao: {
    fontSize: 18,
    color: '#d4af37',
    fontWeight: 'bold',
    marginBottom: 30,
    borderBottomColor: '#d4af37',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  infoBox: {
    marginBottom: 40,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    borderColor: '#d4af37',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  botaoCancelar: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    width: '48%',
  },
  botaoCriar: {
    backgroundColor: '#d4af37',
    padding: 12,
    borderRadius: 8,
    width: '48%',
  },
  botaoTextoCancelar: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoTextoCriar: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
});
