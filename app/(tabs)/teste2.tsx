import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Button, View, TextInput } from 'react-native';
import axios from 'axios';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Teste2Screen() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para o formulário
  const [notice, setNotice] = useState('');
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);

  useEffect(() => {
    fetchNotices(); // Busca os avisos ao montar o componente
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/general-notices');
      setNotices(response.data);
    } catch (error) {
      console.error('Erro ao buscar avisos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const noticeData = { notice };
      if (selectedNoticeId) {
        // Atualiza um aviso existente
        await axios.put(`http://localhost:3000/general-notices/${selectedNoticeId}`, noticeData);
      } else {
        // Cria um novo aviso
        await axios.post('http://localhost:3000/general-notices', noticeData);
      }
      resetForm();
      fetchNotices(); // Atualiza a lista de avisos
    } catch (error) {
      console.error('Erro ao enviar aviso:', error);
    }
  };

  const handleEdit = (notice) => {
    setNotice(notice.notice);
    setSelectedNoticeId(notice._id); // Armazena o ID do aviso selecionado
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/general-notices/${id}`);
      fetchNotices(); // Atualiza a lista de avisos após a exclusão
    } catch (error) {
      console.error('Erro ao deletar aviso:', error);
    }
  };

  const resetForm = () => {
    setNotice('');
    setSelectedNoticeId(null); // Reseta o ID selecionado
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText>Carregando...</ThemedText>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Tela de Avisos Gerais</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Aviso"
          placeholderTextColor="#fff"
          value={notice}
          onChangeText={setNotice}
        />
        <View style={styles.buttonContainer}>
          <Button title={selectedNoticeId ? "Atualizar Aviso" : "Adicionar Aviso"} onPress={handleSubmit} />
          <View style={styles.buttonSpacer} />
          <Button title="Limpar" onPress={resetForm} />
        </View>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Lista de Avisos:</ThemedText>
        {notices.map(n => (
          <ThemedView key={n._id} style={styles.noticeContainer}>
            <ThemedText style={styles.noticeText}>
              {n.notice}
            </ThemedText>
            <View style={styles.buttonGroup}>
              <Button title="Editar" onPress={() => handleEdit(n)} />
              <Button title="Deletar" onPress={() => handleDelete(n._id)} />
            </View>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonSpacer: {
    width: 10,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  noticeText: {
    flex: 1,
    color: '#FFFFFF',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
});