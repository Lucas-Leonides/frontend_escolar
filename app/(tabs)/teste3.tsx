import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Button, View, TextInput } from 'react-native';
import axios from 'axios';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Teste3Screen() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para o formulário
  const [announcement, setAnnouncement] = useState('');
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);

  useEffect(() => {
    fetchAnnouncements(); // Busca as anotações ao montar o componente
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:3000/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Erro ao buscar anotações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const announcementData = { announcement };
      if (selectedAnnouncementId) {
        // Atualiza uma anotação existente
        await axios.put(`http://localhost:3000/announcements/${selectedAnnouncementId}`, announcementData);
      } else {
        // Cria uma nova anotação
        await axios.post('http://localhost:3000/announcements', announcementData);
      }
      resetForm();
      fetchAnnouncements(); // Atualiza a lista de anotações
    } catch (error) {
      console.error('Erro ao enviar anotação:', error);
    }
  };

  const handleEdit = (announcement) => {
    setAnnouncement(announcement.announcement);
    setSelectedAnnouncementId(announcement._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/announcements/${id}`);
      fetchAnnouncements(); // Atualiza a lista de anotações após a exclusão
    } catch (error) {
      console.error('Erro ao deletar anotação:', error);
    }
  };

  const resetForm = () => {
    setAnnouncement('');
    setSelectedAnnouncementId(null);
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
        <ThemedText type="title">Tela de Anotações de Aula</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Anotação"
          placeholderTextColor="#fff"
          value={announcement}
          onChangeText={setAnnouncement}
        />
        <View style={styles.buttonContainer}>
          <Button title={selectedAnnouncementId ? "Atualizar Anotação" : "Adicionar Anotação"} onPress={handleSubmit} />
          <View style={styles.buttonSpacer} />
          <Button title="Limpar" onPress={resetForm} />
        </View>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Lista de Anotações:</ThemedText>
        {announcements.map(a => (
          <ThemedView key={a._id} style={styles.announcementContainer}>
            <ThemedText style={styles.announcementText}>
              {a.announcement}
            </ThemedText>
            <View style={styles.buttonGroup}>
              <Button title="Editar" onPress={() => handleEdit(a)} />
              <Button title="Deletar" onPress={() => handleDelete(a._id)} />
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
  announcementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  announcementText: {
    flex: 1,
    color: '#FFFFFF',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
});