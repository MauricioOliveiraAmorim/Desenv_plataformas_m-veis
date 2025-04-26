import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

  const [modalVisible, setModalVisible] = useState(false);
  const [mensagemModal, setMensagemModal] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [faltante, setFaltante] = useState(false);

  const fecharModal = () => {
    setModalVisible(false);
    if (sucesso) {
      navigation.navigate('Home');
    } else if (faltante == true) {
      setFaltante(false); // ← adicionar isso para limpar o estado 
      return;
    }else if(!sucesso){
      navigation.navigate('Home');
    }
  };

  const processoCancelado = () => {
    setMensagemModal('Criação do processo cancelada!');
    setSucesso(false);
    setFaltante(false);
    setModalVisible(true);
  };

  const registrarProcesso = async () => {
    if (nome_process && numero_process && tipo_process && area_process && status_process) {
      const novoProcesso = {
        nome_Processo: nome_process,
        numero_Processo: numero_process,
        tipo_Processo: tipo_process,
        area_Processo: area_process,
        status_Processo: status_process,
        data: new Date().toISOString(),
      };
      try {
        console.log('Firestore DB:', db);
        await db.collection('processos').add(novoProcesso);

        setMensagemModal('Processo criado com sucesso!');
        setSucesso(true);
        setModalVisible(true);
        setFaltante(false);

        // Limpar campos após sucesso
        setNome_process('');
        setNumero_process('');
        setTipo_process('');
        setArea_process('');
        setStatus_process('');
      } catch (error) {
        setMensagemModal('Erro ao criar o processo!');
        setSucesso(false);
        setModalVisible(true);
        setFaltante(false);
      }
    } else {
      setMensagemModal('Por favor, preencha todos os campos!');
      setFaltante(true);//caso falte algum, ainda fica para editar
      setSucesso(false);
      setModalVisible(true);
    }
  };

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
        <TouchableOpacity style={styles.botaoCancelar} onPress={processoCancelado}>
          <Text style={styles.botaoTextoCancelar}>CANCELAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoCriar} onPress={registrarProcesso}>
          <Text style={styles.botaoTextoCriar}>CRIAR</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Personalizado */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={[styles.textoModal, { color: sucesso ? '#00ff00' : '#ff4444' }]}>
              {mensagemModal}
            </Text>
            <TouchableOpacity onPress={fecharModal} style={styles.fecharBotao}>
              <Text style={styles.fecharTexto}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1c1c1c',
    padding: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
    alignItems: 'center',
  },
  textoModal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fecharBotao: {
    backgroundColor: '#d4af37',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  fecharTexto: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
});
