import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

export type Props = NativeStackScreenProps<RootStackParamList, 'Edit'>;
interface SectionInterface {
  title: string;
  value: string;
  onChangeText: (key: string, value: string) => void;
}
const Section = ({title, value, onChangeText}: SectionInterface) => {
  return (
    <View>
      <Text style={{marginBottom: 6}}>{title}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={v => onChangeText(title, v)}
      />
    </View>
  );
};
const EditResultScreen = ({route}: Props) => {
  const {result} = route.params;
  const jsonForm = JSON.parse(`{${result.content}}`);
  const [form, setForm] = useState(jsonForm);
  const onUpdateForm = (key: string, value: string) => {
    setForm({
      ...form,
      [key]: value,
    });
  };
  return (
    <View>
      {Object.entries(form).map(([key, value], index) => (
        <Section
          key={index}
          title={key}
          value={`${value}`}
          onChangeText={onUpdateForm}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default EditResultScreen;
