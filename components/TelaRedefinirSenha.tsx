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

    const [modalVisibleSucess, setModalVisibleSucess] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [mensagemModal, setMensagemModal] = useState('');

    const mostrarFeedback = (mensagem: string, sucessoFlag: boolean) => {
        setMensagemModal(mensagem);
        setSucesso(sucessoFlag);
        setModalVisibleSucess(true);
    };

    const [modalVisibleSucess2, setModalVisibleSucess2] = useState(false);
    const [conteudoModal, setConteudoModal] = useState<React.ReactNode>(null);
    const mostrarFeedback2 = (conteudo: React.ReactNode, sucessoFlag: boolean) => {
        setConteudoModal(conteudo);
        setSucesso(sucessoFlag);
        setModalVisibleSucess2(true);
    }

    const fecharModal2 = () => {
        setModalVisibleSucess2(false);
        // if (sucesso) {
        //   navigation.navigate('Home');
        // }
    };


    const fecharModal = () => {
        setModalVisibleSucess(false);
        // if (sucesso) {
        //   navigation.navigate('Home');
        // }
    };


    const validarSenha = (senha: string) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(senha);
    };

    const HandlebucarEmail = async () => {
        if (!email.trim()) {
            // Alert.alert('Erro', 'Por favor, informe um e-mail.');
            mostrarFeedback("Por favor, informe um e-mail.", false);
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
                // Alert.alert('Erro', 'Usuário não encontrado.');
                mostrarFeedback('Usuário não encontrado', false)
            }
        } catch (error) {
            console.error('Erro ao buscar e-mail:', error);
            Alert.alert('Erro', 'Não foi possível verificar o e-mail.');
        }
    }

    const handleSalvarSenha = async () => {
        if (!novaSenha || !confirmarSenha) {
            // Alert.alert('Erro', 'Preencha ambos os campos de senha.');
            mostrarFeedback("Preencha ambos os campos de senha.", false)
            return;
        }

        if (novaSenha !== confirmarSenha) {
            // Alert.alert('Erro', 'As senhas não coincidem.');
            mostrarFeedback("As senhas não coincidem.", false)
            return;
        }

        if (!validarSenha(novaSenha)) {
            // Alert.alert('Erro', 'A senha deve conter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.');
            mostrarFeedback2(
                <View style={{ alignSelf: 'flex-start', marginTop: 1, marginBottom: 12 }}>
                    <Text style={{ color: novaSenha.length >= 8 ? 'green' : 'red' }}>
                        {novaSenha.length >= 8 ? '✓' : '✗'} Mínimo de 8 caracteres
                    </Text>
                    <Text style={{ color: /[A-Z]/.test(novaSenha) ? 'green' : 'red' }}>
                        {/[A-Z]/.test(novaSenha) ? '✓' : '✗'} Pelo menos uma letra maiúscula
                    </Text>
                    <Text style={{ color: /[a-z]/.test(novaSenha) ? 'green' : 'red' }}>
                        {/[a-z]/.test(novaSenha) ? '✓' : '✗'} Pelo menos uma letra minúscula
                    </Text>
                    <Text style={{ color: /\d/.test(novaSenha) ? 'green' : 'red' }}>
                        {/\d/.test(novaSenha) ? '✓' : '✗'} Pelo menos um número
                    </Text>
                    <Text style={{ color: /[@$!%*#?&]/.test(novaSenha) ? 'green' : 'red' }}>
                        {/[@$!%*#?&]/.test(novaSenha) ? '✓' : '✗'} Caractere especial (@, #, !, etc.)
                    </Text>
                </View>,
                false
            );
            return;
        }

        try {
            const ref = doc(db, 'cadastros', docIdEncontrado);
            await updateDoc(ref, {
                senhaUser: novaSenha,
                confirmarSenhaUser: confirmarSenha,
            });
            // Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
            
            mostrarFeedback("Senha atualizada com sucesso!", true)
            
            setModalSenhaVisible(false);
            setNovaSenha('');
            setConfirmarSenha('');
            setEmail('');
            setTimeout(() => {
            navigation.navigate('Login');
            }, 2000); 

        } catch (error) {
            console.error('Erro ao salvar nova senha:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a senha.');
        }

    }

    const CancelarSenha = () => {
        setModalSenhaVisible(false);
        setNovaSenha('');
        setConfirmarSenha('');
        setEmail('')
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





            {/* Modal Personalizado */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisibleSucess}
                onRequestClose={fecharModal}
            >
                <View style={styles.modalContainerPersonalizado}>
                    <View style={styles.modalBoxPersonalizado}>
                        <Text style={[styles.textoModalPersonalizado, { color: sucesso ? '#00ff00' : '#ff4444' }]}>
                            {mensagemModal}
                        </Text>
                        <TouchableOpacity onPress={fecharModal} style={styles.fecharBotaoPersonalizado}>
                            <Text style={styles.fecharTextoPersonalizado}>FECHAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Personalizado verificação */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisibleSucess2}
                onRequestClose={fecharModal}
            >
                <View style={styles.modalContainerPersonalizado}>
                    <View style={styles.modalBoxPersonalizado}>
                        <View style={{ marginBottom: 16 }}>
                            {conteudoModal}
                        </View>
                        <TouchableOpacity onPress={fecharModal2} style={styles.fecharBotaoPersonalizado}>
                            <Text style={styles.fecharTextoPersonalizado}>FECHAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>





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
    modalContainerPersonalizado: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBoxPersonalizado: {
        backgroundColor: '#1c1c1c',
        padding: 30,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d4af37',
        alignItems: 'center',
        width: 325
    },
    textoModalPersonalizado: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    fecharBotaoPersonalizado: {
        backgroundColor: '#d4af37',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    fecharTextoPersonalizado: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 16,
    },


});
