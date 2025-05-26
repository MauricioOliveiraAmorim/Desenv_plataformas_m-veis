import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPasswordEmail'>;

export default function ForgotPasswordEmailScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');

  const sendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail.');
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email.trim());
      Alert.alert('Sucesso', 'Verifique seu e-mail para redefinir a senha.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erro ao enviar e-mail', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recuperar senha</Text>
      <Text style={styles.instructions}>
        Informe abaixo o e-mail cadastrado para receber o link de redefinição.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="seu@exemplo.com"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={sendCode}>
        <Text style={styles.buttonText}>Enviar e-mail de recuperação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: '#000', justifyContent: 'center'
  },
  label: {
    color: '#d4af37', fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center'
  },
  instructions: {
    color: '#fff', fontSize: 14, marginBottom: 20, textAlign: 'center'
  },
  input: {
    backgroundColor: '#1a1a1a', color: '#fff',
    padding: 12, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#d4af37'
  },
  button: {
    backgroundColor: '#d4af37', padding: 14, borderRadius: 8, alignItems: 'center'
  },
  buttonText: {
    color: '#000', fontWeight: 'bold'
  },
});
