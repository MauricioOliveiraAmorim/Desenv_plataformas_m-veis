import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  GestureResponderEvent,
  Alert,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs } from '@react-native-firebase/firestore';
import { db } from './firebaseConfig';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Processo'>;

// Define o tipo da rota para acessar os parâmetros passados via navigation
type RouteProps = RouteProp<RootStackParamList, 'Processo'>;

type Auditoria = {
  campoAlterado: string;
  valorAnterior: string;
  ValorAtual: string;
  usuarioId: string;
  nomeUsuario: string;
  Timestamp: string;
}


export default function TelaProcesso() {
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<RouteProps>();

  //trazendo os paremetros de dados recebidos da tela anterior (vindo da FlatList)
  const { titulo, status, id, tipo, area, numero } = route.params;

  const [modalAuditoria, setModalAuditoria] = useState(false);
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);

  const handleEditar = (event: GestureResponderEvent) => {
    navigation.navigate('Editar', {
      id,
      titulo,
      status,
      tipo,
      area,
      numero
    });

  };

  const handleVerAuditoria = async () => {
    try {
      const ref = collection(db, 'processos', id, 'auditorias');
      const snapshot = await getDocs(ref);

      // const dados: Auditoria[] = snapshot.docs.map((doc) => doc.data() as Auditoria);// se quiser o contrario reverte o b por a 

        const dados: Auditoria[] = snapshot.docs
        .map((doc) => doc.data() as Auditoria)
        .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

      setAuditorias(dados);
      setModalAuditoria(true);
    } catch (error) {
      Alert.alert('Erro ao carregar auditorias');
      console.error('Erro ao buscar auditoria:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <Text style={styles.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.tituloSecao}>· INFORMAÇÕES DO PROCESSO</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Nome do Processo</Text>
          <Text style={styles.value}>{titulo}</Text>

          <Text style={styles.label}>Número do Processo</Text>
          <Text style={styles.value}>{numero}</Text>

          <Text style={styles.label}>Tipo do Processo</Text>
          <Text style={styles.value}>{tipo}</Text>

          <Text style={styles.label}>Área do Direito</Text>
          <Text style={styles.value}>{area}</Text>

          <Text style={styles.label}>Status do Processo</Text>
          <Text style={styles.value}>{status}</Text>
        </View>

        <View style={styles.botoesContainer}>
          <TouchableOpacity style={styles.botaoEditar} onPress={handleEditar}>
            <Text style={styles.textoEditar}>EDITAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoAuditoria} onPress={handleVerAuditoria}>
            <Text style={styles.textoAuditoria}>VER AUDITORIA</Text>
          </TouchableOpacity>
        </View>
        {/* Modal de Auditoria */}
        <Modal visible={modalAuditoria} transparent animationType="fade" onRequestClose={() => setModalAuditoria(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Histórico de Alterações</Text>
              <ScrollView>
                {auditorias.map((item, index) => (
                  <View key={index} style={styles.auditoriaItem}>
                    <Text style={styles.modalCampo}><Text style={{ fontWeight: 'bold' }}>Campo:</Text> {item.campoAlterado}</Text>
                    <Text style={styles.modalCampo}><Text style={{ fontWeight: 'bold' }}>De:</Text> {item.valorAnterior}</Text>
                    <Text style={styles.modalCampo}><Text style={{ fontWeight: 'bold' }}>Para:</Text> {item.ValorAtual}</Text>
                    <Text style={styles.modalCampo}><Text style={{ fontWeight: 'bold' }}>Por:</Text> {item.nomeUsuario}</Text>

                    <Text style={styles.modalCampo}>
                      <Text style={{ fontWeight: 'bold' }}>Em:</Text>{' '}
                      {new Date(item.Timestamp).toLocaleString('pt-BR', {
                        timeZone: 'America/Sao_Paulo', day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })} às {new Date(item.Timestamp).toLocaleTimeString('pt-BR', {
                        timeZone: 'America/Sao_Paulo',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>

                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setModalAuditoria(false)} style={styles.modalClose}>
                <Text style={{ fontWeight: 'bold', color: '#000' }}>FECHAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  tituloSecao: {
    fontSize: 18,
    color: '#d4af37',
    fontWeight: 'bold',
    borderBottomColor: '#d4af37',
    borderBottomWidth: 1,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  infoBox: {
    marginBottom: 40,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  value: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 4,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoEditar: {
    backgroundColor: '#d4af37',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  botaoAuditoria: {
    borderWidth: 1,
    borderColor: '#d4af37',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  textoEditar: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoAuditoria: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoVoltar: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  textoVoltar: {
    color: '#d4af37',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  auditoriaItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#111',
    borderRadius: 6,
    borderColor: '#d4af37',
    borderWidth: 1,
  },
  modalCampo: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  modalClose: {
    marginTop: 10,
    backgroundColor: '#d4af37',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

