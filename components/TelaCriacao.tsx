import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { RootStackParamList } from './App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Criação'>;


export default function TelaCriacao() {
    const navigation = useNavigation<NavigationProp>();
    
  const [nome_process, setNome_process] = useState('');
  const [numero_process, setNumero_process] = useState('');
  const [tipo_process, setTipo_process] = useState('');
  const [area_process, setArea_process] = useState('');
  const [status_process, setStatus_process] = useState('');

  const navegandoComAlert = () =>{
    navigation.navigate('Home')
    Alert.alert("Criação do processo cancelado!")
  }

  const registrarProcesso = async () => {
    if (nome_process && numero_process && tipo_process && area_process && status_process) {
      const novoProcesso = {
        nome: nome_process,
        numero: numero_process,
        tipo: tipo_process,
        area: area_process,
        status: status_process,
        data: new Date().toISOString(),
      };
      try {
        console.log('Firestore DB:', db);
        await db.collection('processos').add(novoProcesso);
        Alert.alert('Sucesso', 'Processo registrado com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);        
        setNome_process('');
        setNumero_process('');
        setTipo_process('');
        setArea_process('');
        setStatus_process('');
      } catch (error) {
        alert('Erro!');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  // const criarProcesso = () => {
  //   if (!nome || !numero || !tipo || !area || !status) {
  //     Alert.alert('Erro', 'Preencha todos os campos!');
  //   } else {
  //     // Aqui você pode salvar os dados ou enviar para backend
  //     Alert.alert('Sucesso', 'Processo criado com sucesso!');
  //     setNome('');
  //     setNumero('');
  //     setTipo('');
  //     setArea('');
  //     setStatus('');
  //   }
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tituloSecao}>· INFORMAÇÕES DO PROCESSO</Text>

      <TextInput
        placeholder="Nome do Processo"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={nome_process}
        onChangeText={setNome_process}
      />
      <TextInput
        placeholder="Número do Processo"
        style={styles.input}
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={numero_process}
        onChangeText={setNumero_process}
      />
      <TextInput
        placeholder="Tipo do Processo"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={tipo_process}
        onChangeText={setTipo_process}
      />
      <TextInput
        placeholder="Área do Direito"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={area_process}
        onChangeText={setArea_process}
      />
      <TextInput
        placeholder="Status do Processo"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={status_process}
        onChangeText={setStatus_process}
      />

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botaoCancelar} onPress={navegandoComAlert}>
          <Text style={styles.botaoTextoCancelar}>CANCELAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCriar} onPress={registrarProcesso}>
          <Text style={styles.botaoTextoCriar}>CRIAR</Text>
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
    fontSize: 16,
    color: '#d4af37',
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomColor: '#d4af37',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    borderColor: '#d4af37',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
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
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

