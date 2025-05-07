import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Processo {
    titulo: string;
    status: string;
    id: string;
    tipo: string;
    area: string;
    numero: string;
    data: string;
    favoritado?: boolean;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favoritos'>;

export default function TelaFavoritos() {
    const navigation = useNavigation<NavigationProp>();
    const [processos, setProcessos] = useState<Processo[]>([]);
    const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

    
    const starScale = useRef(new Animated.Value(1)).current;

    const animarEstrela = () => {
        Animated.sequence([
            Animated.timing(starScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
            Animated.timing(starScale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const carregarProcessos = async () => {
        const usuarioId = await AsyncStorage.getItem('usuarioId');
        if (!usuarioId) return;

        const querySnapshot = await getDocs(collection(db, 'processos'));
        const favoritosSnapshot = await getDocs(
            query(collection(db, 'favoritos'), where('userId', '==', usuarioId))
        );
        const favoritosIds = favoritosSnapshot.docs.map(doc => doc.data().processoId);

        const processos: Processo[] = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (favoritosIds.includes(doc.id)) {
                processos.push({
                    id: doc.id,
                    titulo: data.nome_Processo,
                    status: data.status_Processo,
                    tipo: data.tipo_Processo,
                    area: data.area_Processo,
                    numero: data.numero_Processo,
                    data: data.data,
                    favoritado: true,
                });
            }
        });
        const prioridadeStatus = [
            'Fase-Postulatoria',
            'Saneamento',
            'Instrução',
            'Julgamento',
            'Recursos',
            'Execução',
            'Concluido'
        ];

        processos.sort((a, b) => {
            const prioridadeA = prioridadeStatus.indexOf(a.status);
            const prioridadeB = prioridadeStatus.indexOf(b.status);

            if (prioridadeA !== prioridadeB) {
                return prioridadeA - prioridadeB; // ordena pela fase
            } else {
                return new Date(b.data).getTime() - new Date(a.data).getTime(); // se fase for igual, mais recente primeiro
            }
        });

        setProcessos(processos);
    };

    useEffect(() => {
        carregarProcessos();
    }, []);

    const removerFavorito = async (processoId: string) => {
        const usuarioId = await AsyncStorage.getItem('usuarioId');
        if (!usuarioId) return;

        const favoritosRef = collection(db, 'favoritos');
        const q = query(favoritosRef, where('userId', '==', usuarioId), where('processoId', '==', processoId));
        const snapshot = await getDocs(q);
        snapshot.forEach(async fav => {
            await deleteDoc(doc(db, 'favoritos', fav.id));
        });

        setProcessos((prev) => prev.filter((proc) => proc.id !== processoId));
    };

    const renderItem = ({ item }: { item: Processo }) => (
        <View style={styles.cardProcesso}>
            <View style={styles.headerProcesso}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Processo', {
                            titulo: item.titulo,
                            status: item.status,
                            id: item.id,
                            tipo: item.tipo,
                            area: item.area,
                            numero: item.numero
                        })}
                        style={{ padding: 6 }}>
                        <Icon name="ellipsis-horizontal-outline" size={22} color="#d4af37" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                    onPress={() => {
                        animarEstrela();
                        if (item.favoritado) {
                            removerFavorito(item.id);
                          }
                      }}
                      style={{ padding: 1 }}
                    >
                      <Animated.View style={{ transform: [{ scale: starScale }] }}>
                        <Icon
                          name={item.favoritado ? 'star' : 'star-outline'}
                          size={22}
                          color={item.favoritado ? '#FFD700' : '#555'}
                        />
                      </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.status}>{item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Cabeçalho fixo com botão voltar */}
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
                    <Icon name="chevron-back-outline" size={22} color="#d4af37" />
                    <Text style={styles.textoVoltar}>Voltar</Text>
                </TouchableOpacity>
            </View> */}
            <FlatList
                data={processos}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <Text style={{ color: '#777', textAlign: 'center', marginTop: 50 }}>
                      Nenhum processo favoritado ainda.
                    </Text>
                  }
            />
            {/* Barra de navegação inferior */}
            <View style={styles.barraNavegacao}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Icon name="home" size={28} color="#d4af37" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
                    <Icon name="star" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Usuario')}>
                    <Icon name="person" size={28} color="#d4af37" />
                </TouchableOpacity>
            </View>
        </View>
        // </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 20 },
    cardProcesso: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#d4af37',
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    status: {
        color: '#ccc',
        marginTop: 5,
    },
    headerProcesso: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    barraNavegacao: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#111',
        position: 'absolute',
        bottom: 0,
        width: '112%',
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
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#111',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d4af37',
    },

    textoVoltar: {
        color: '#d4af37',
        fontWeight: '600',
        fontSize: 15,
    },


});