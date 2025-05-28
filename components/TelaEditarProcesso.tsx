import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { RootStackParamList } from './App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    if (sucesso) {
      navigation.navigate('Home');
    }
  };


  const cancelarEdicao = () => {
    setMensagemModal('Edição cancelada. Nenhuma alteração salva.');
    setSucesso(false);
    setModalVisibleSucess(true);

    // Espera 2 segundos e depois navega para Home
    setTimeout(() => {
      setModalVisibleSucess(false);
      navigation.navigate('Home');
    }, 2000); // você pode ajustar esse tempo
  };


  //pensar
  const registrarAuditoria = async ({
    processoId,
    campo,
    de,
    para,
    usuarioId,
    nomeUsuario
  }: {
    processoId: string;
    campo: string;
    de: string;
    para: string;
    usuarioId: string;
    nomeUsuario: string;
  }) => {
    try {
      const ref = collection(db, 'processos', processoId, 'auditorias');
      await addDoc(ref, {
        campoAlterado: campo,
        valorAnterior: de,
        ValorAtual: para,
        usuarioId,
        nomeUsuario,
        Timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
    }
  }

  const atualizarProcesso = async () => {
    if (!nome_process || !numero_process || !tipo_process || !area_process || !status_process) {
      mostrarFeedback('Preencha todos os campos obrigatórios.', false);
      return;
    }

    try {
      const userJson = await AsyncStorage.getItem('user');
      const userId = await AsyncStorage.getItem('usuarioId');
      const usuarioId = userId ?? '';
      const user = userJson ? JSON.parse(userJson) : {};
      const nomeUsuario = user.name ?? 'Desconhecido';

      // Verifica alterações e registra auditoria
      if (nome_process !== titulo) await registrarAuditoria({ processoId: id, campo: 'nome_Processo', de: titulo, para: nome_process, usuarioId, nomeUsuario });
      if (numero_process !== numero) await registrarAuditoria({ processoId: id, campo: 'numero_Processo', de: numero, para: numero_process, usuarioId, nomeUsuario });
      if (tipo_process !== tipo) await registrarAuditoria({ processoId: id, campo: 'tipo_Processo', de: tipo, para: tipo_process, usuarioId, nomeUsuario });
      if (area_process !== area) await registrarAuditoria({ processoId: id, campo: 'area_Processo', de: area, para: area_process, usuarioId, nomeUsuario });
      if (status_process !== status) await registrarAuditoria({ processoId: id, campo: 'status_Processo', de: status, para: status_process, usuarioId, nomeUsuario });

      await db.collection('processos').doc(id).update({
        nome_Processo: nome_process,
        numero_Processo: numero_process,
        tipo_Processo: tipo_process,
        area_Processo: area_process,
        status_Processo: status_process,
      });

      mostrarFeedback('Processo atualizado com sucesso!', true);
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
      mostrarFeedback('Erro ao atualizar o processo.', false);
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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status_process}
            onValueChange={(itemValue) => setStatus_process(itemValue)}
            dropdownIconColor="#d4af37"
            style={styles.picker}
          >
            <Picker.Item label="Status do processo" value="" />
            <Picker.Item label="1. Fase Postulatória (Conhecimento)" value="Fase-Postulatoria" />
            <Picker.Item label="2. Saneamento e Organização" value="Saneamento e Organização" />
            <Picker.Item label="3. Instrução (Provas)" value="Instrução" />
            <Picker.Item label="4. Julgamento (Sentença)" value="Julgamento" />
            <Picker.Item label="5. Recursos" value="Recursos" />
            <Picker.Item label="6. Execução" value="Execução" />
            <Picker.Item label="7. Concluido / Arquivado" value="Concluido" />
          </Picker>
        </View>

      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botaoCancelar} onPress={cancelarEdicao}>
          <Text style={styles.botaoTextoCancelar}>CANCELAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCriar} onPress={atualizarProcesso}>
          <Text style={styles.botaoTextoCriar}>SALVAR</Text>
        </TouchableOpacity>
      </View>


      {/* Modal Personalizado */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisibleSucess}
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
  pickerContainer: {
    backgroundColor: '#1c1c1c',
    borderColor: '#d4af37',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    color: '#fff', // cor do texto interno do picker
    height: 50,
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
