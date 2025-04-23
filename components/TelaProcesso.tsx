import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  GestureResponderEvent,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Processo'>;


export default function TelaProcesso() {
  const navigation = useNavigation<NavigationProp>();

  const handleEditar = (event: GestureResponderEvent) => {
    console.log('Editar processo...');
  };

  const handleVerAuditoria = (event: GestureResponderEvent) => {
    console.log('Ver auditoria...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.botaoVoltar}>
          <Text style={styles.textoVoltar}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.tituloSecao}>· INFORMAÇÕES DO PROCESSO</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Nome do Processo</Text>
          <Text style={styles.value}>EXEMPLO</Text>

          <Text style={styles.label}>Número do Processo</Text>
          <Text style={styles.value}>EXEMPLO</Text>

          <Text style={styles.label}>Tipo do Processo</Text>
          <Text style={styles.value}>EXEMPLO</Text>

          <Text style={styles.label}>Área do Direito</Text>
          <Text style={styles.value}>EXEMPLO</Text>

          <Text style={styles.label}>Status do Processo</Text>
          <Text style={styles.value}>EXEMPLO</Text>
        </View>

        <View style={styles.botoesContainer}>
          <TouchableOpacity style={styles.botaoEditar} onPress={handleEditar}>
            <Text style={styles.textoEditar}>EDITAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoAuditoria} onPress={handleVerAuditoria}>
            <Text style={styles.textoAuditoria}>VER AUDITORIA</Text>
          </TouchableOpacity>
        </View>
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

});
