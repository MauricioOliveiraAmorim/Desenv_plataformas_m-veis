import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Alert, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import { RootStackParamList } from './App';
import { getDocs, collection, query, where, doc, updateDoc } from '@react-native-firebase/firestore';
import { db } from './firebaseConfig';
import Icon from 'react-native-vector-icons/Ionicons';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RedefinirSenha'>;
export default function TelaRedefinirSenha() {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [docIdEncontrado, setDocIdEncontrado] = useState('');
    const [modalSenhaVisible, setModalSenhaVisible] = useState(false);
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenhaConfirmacao, setMostrarSenhaConfirmacao] = useState(false);


    const validarSenha = (senha: string) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(senha);
    };

    const HandlebucarEmail = async () => {
        if (!email.trim()) {
            Alert.alert('Erro', 'Por favor, informe um e-mail.');
            return;
        }
        try {
            const q = query(collection(db, 'cadastros'), where('emailUser', '==', email.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docEncontrado = querySnapshot.docs[0];
                setDocIdEncontrado(docEncontrado.id); // ← salva o ID do documento
                setModalSenhaVisible(true); // ← abre o modal para redefinir senha
            } else {
                Alert.alert('Erro', 'Usuário não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar e-mail:', error);
            Alert.alert('Erro', 'Não foi possível verificar o e-mail.');
        }
    }

    const handleSalvarSenha = async () => {
        if (!novaSenha || !confirmarSenha) {
            Alert.alert('Erro', 'Preencha ambos os campos de senha.');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (!validarSenha(novaSenha)) {
            Alert.alert('Erro', 'A senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.');
            return;
        }

        try {
            const ref = doc(db, 'cadastros', docIdEncontrado);
            await updateDoc(ref, {
                senhaUser: novaSenha,
                confirmarSenhaUser: confirmarSenha,
            });
            Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
            setModalSenhaVisible(false);
            setNovaSenha('');
            setConfirmarSenha('');

        } catch (error) {
            console.error('Erro ao salvar nova senha:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a senha.');
        }

    }

    const CancelarSenha = () => {
        setModalSenhaVisible(false);
        setNovaSenha('');
        setConfirmarSenha('');
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.headerAbsoluto}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
                    <Icon name="chevron-back-outline" size={22} color="#d4af37" />
                    <Text style={styles.textoVoltar}>Voltar</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Esqueceu sua senha?</Text>
            <Text style={styles.subtitle}>
                Informe o e-mail cadastrado para redefinir sua senha.
            </Text>


            <Modal
                transparent
                animationType="fade"
                visible={modalSenhaVisible}
                onRequestClose={() => setModalSenhaVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <Text style={styles.textoModal}>Redefinir Senha</Text>
                        <Text style={styles.textoModalSecundario}>
                            Informe a nova senha desejada:
                        </Text>

                        {/* Campo de nova senha com ícone */}
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.inputModalComIcone}
                                placeholder="Nova senha"
                                placeholderTextColor="#999"
                                secureTextEntry={!mostrarSenha}
                                value={novaSenha}
                                onChangeText={setNovaSenha}
                            />
                            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                                <Icon
                                    name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                                    size={22}
                                    color="#d4af37"
                                    style={{ marginLeft: 8 }}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Campo de confirmação com ícone */}
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.inputModalComIcone}
                                placeholder="Confirmar nova senha"
                                placeholderTextColor="#999"
                                secureTextEntry={!mostrarSenhaConfirmacao}
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                            />
                            <TouchableOpacity onPress={() => setMostrarSenhaConfirmacao(!mostrarSenhaConfirmacao)}>
                                <Icon
                                    name={mostrarSenhaConfirmacao ? 'eye-off-outline' : 'eye-outline'}
                                    size={22}
                                    color="#d4af37"
                                    style={{ marginLeft: 8 }}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBotoes}>
                            <TouchableOpacity style={styles.botaoCancelarModal} onPress={CancelarSenha}>
                                <Text style={styles.textoCancelarModal}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoConfirmarModal} onPress={handleSalvarSenha}>
                                <Text style={styles.textoConfirmarModal}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>




            <TextInput
                style={styles.input}
                placeholder="seu@exemplo.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={HandlebucarEmail}
            >
                <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    title: {
        color: '#d4af37',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 28,
    },
    input: {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: 14,
        borderRadius: 10,
        borderColor: '#d4af37',
        borderWidth: 1,
        marginBottom: 20,
        fontSize: 15,
    },
    button: {
        backgroundColor: '#d4af37',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#1a1a1a',
        padding: 24,
        borderRadius: 12,
        width: '85%',
        alignItems: 'center',
    },
    textoModal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#d4af37',
        marginBottom: 8,
        textAlign: 'center',
    },
    textoModalSecundario: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 16,
        textAlign: 'center',
    },
    inputModal: {
        backgroundColor: '#2a2a2a',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#d4af37',
        fontSize: 14,
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        width: '100%',
    },
    botaoCancelarModal: {
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoCancelarModal: {
        color: '#fff',
        fontWeight: 'bold',
    },
    botaoConfirmarModal: {
        backgroundColor: '#d4af37',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoConfirmarModal: {
        color: '#000',
        fontWeight: 'bold',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderColor: '#d4af37',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
    },

    inputModalComIcone: {
        flex: 1,
        color: '#fff',
        paddingVertical: 12,
        fontSize: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        zIndex: 10,
    },

    botaoVoltar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d4af37',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },

    textoVoltar: {
        color: '#d4af37',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 6,
    },
    headerAbsoluto: {
        position: 'absolute',
        top: 40, // distância do topo (ajustável com SafeAreaView se quiser)
        left: 20,
        zIndex: 999, // para ficar acima de tudo
    },


});
