import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Button, View, TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'; // Importa o MaskedTextInput
import axios from 'axios';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Teste1Screen() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para o formulário
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [className, setClassName] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Função para buscar dados dos alunos
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/students');
      console.log('Alunos recebidos:', response.data); // Log para verificar a resposta
      setStudents(response.data);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); // Chama a função na montagem do componente
  }, []);

  const handleSubmit = async () => {
    try {
      const studentData = { name, birthDate, registrationNumber, class: className };
      if (selectedStudentId) {
        // Atualiza um aluno existente
        await axios.put(`http://localhost:3000/students/${selectedStudentId}`, studentData);
      } else {
        // Cria um novo aluno
        await axios.post('http://localhost:3000/students', studentData);
      }
      resetForm();
      fetchStudents(); // Atualiza a lista de alunos após adicionar ou editar
    } catch (error) {
      console.error('Erro ao enviar dados do aluno:', error);
    }
  };

  const handleEdit = (student) => {
    setName(student.name);
    setBirthDate(student.birthDate.split('T')[0]);
    setRegistrationNumber(student.registrationNumber);
    setClassName(student.class);
    setSelectedStudentId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/students/${id}`);
      fetchStudents(); // Atualiza a lista de alunos após a exclusão
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setBirthDate('');
    setRegistrationNumber('');
    setClassName('');
    setSelectedStudentId(null);
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
        <ThemedText type="title">Tela de Teste 1</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
        />
        <TextInputMask
          type={'datetime'}
          options={{
            format: 'YYYY-MM-DD', // Formato desejado
          }}
          style={styles.input}
          placeholder="Data de Nascimento (YYYY-MM-DD)"
          placeholderTextColor="#fff"
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Registro"
          placeholderTextColor="#fff"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Classe"
          placeholderTextColor="#fff"
          value={className}
          onChangeText={setClassName}
        />
        <View style={styles.buttonContainer}>
          <Button title={selectedStudentId ? "Atualizar Aluno" : "Adicionar Aluno"} onPress={handleSubmit} />
          <View style={styles.buttonSpacer} />
          <Button title="Limpar" onPress={resetForm} />
        </View>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Lista de Alunos:</ThemedText>
        {students.map(student => (
          <ThemedView key={student._id} style={styles.studentContainer}>
            <ThemedText style={styles.studentText}>
              {student.name} - {student.class} (Registro: {student.registrationNumber})
            </ThemedText>
            <View style={styles.buttonGroup}>
              <Button title="Editar" onPress={() => handleEdit(student)} />
              <Button title="Deletar" onPress={() => handleDelete(student._id)} />
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
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  studentText: {
    flex: 1,
    color: '#FFFFFF',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
});