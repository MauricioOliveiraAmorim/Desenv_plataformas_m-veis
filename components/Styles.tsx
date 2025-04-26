import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Estilo para tela de login padronizado
loginContainer: {
  flex: 1,
  backgroundColor: '#000',
  justifyContent: 'center',
  padding: 20,
},

loginInput: {
  backgroundColor: '#1a1a1a',
  color: '#fff',
  borderWidth: 1,
  borderColor: '#d4af37',
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 8,
  marginBottom: 16,
},

loginLabel: {
  color: '#d4af37',
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 8,
},

loginButton: {
  backgroundColor: '#d4af37',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
},

loginButtonText: {
  color: '#000',
  fontWeight: 'bold',
  fontSize: 16,
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

export default styles;


