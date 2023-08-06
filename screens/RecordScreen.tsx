import React, {useState} from 'react';
import {Button, Platform, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import RNFetchBlob from 'rn-fetch-blob';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {RootStackParamList} from '../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const audioRecorderPlayer = new AudioRecorderPlayer();

const formTypes = {
  epicrisis: 'Epicrisis adultos y pediatria',
  admisiones: 'Admisiones internación adultos',
  evolucion: 'Evolución',
};

export type Props = NativeStackScreenProps<RootStackParamList, 'Record'>;

const RecordScreen = ({navigation}: Props) => {
  const [uri, setUri] = useState<string | undefined>();
  const [recordState, setRecordState] = useState({
    recordSecs: 0,
    recordTime: '',
  });
  const [selectedForm, setSelectedForm] = useState(formTypes.epicrisis);

  const dirs = RNFetchBlob.fs.dirs;
  const path = Platform.select({
    ios: 'audio.m4a',
    android: `${dirs.CacheDir}/hello.mp3`,
  });

  const onStartRecording = async () => {
    const audioUri = await audioRecorderPlayer.startRecorder(path);
    setUri(audioUri);
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordState({
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });
      return;
    });
    console.log(audioUri);
  };

  const convertToBase64 = async (audioUri: string) => {
    try {
      return await RNFetchBlob.fs.readFile(audioUri.substring(7), 'base64');
    } catch (error) {
      console.error('Error converting to base64:', error);
    }
  };
  const sendAudio = async () => {
    if (uri) {
      // const formData = new FormData();
      const audioFile = await convertToBase64(uri);
      // formData.append('audio', audioFile);
      // formData.append('type', selectedForm);

      try {
        console.log('Requested');
        const response = await fetch(
          'https://0994-152-169-229-189.ngrok-free.app/recognize',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: selectedForm,
              audio: audioFile,
            }),
          },
        );
        const data = await response.text();
        console.log('Upload response:', data);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    // const result =
    //   '{"content": "Nombre: Agustin\nApellido: Bon\nHistoria clinica: [sin especificar]\nStaff a cargo de la internaci\u00f3n: [sin especificar]\nMotivo de admisi\u00f3n: Fractura en el brazo izquierdo\nAntecedentes relevantes: [sin especificar]\nEvaluaci\u00f3n de internaci\u00f3n: [sin especificar]\nEstudios realizados: [sin especificar]\nDiagn\u00f3stico principal de egreso/transferencia: [sin especificar]\nDiagn\u00f3stico secundario de egreso/transferencia: [sin especificar]\nMedicaciones al egreso: Ibuprofeno\nDosis: [sin especificar]\nFrecuencia: [sin especificar]\nDuraci\u00f3n: 1 semana\nV\u00eda: [sin especificar]\nDieta: [sin especificar]\nMedicaci\u00f3n previa del paciente: [sin especificar]\nMedicaci\u00f3n previa del paciente suspendida/modificada: [sin especificar]\nInstrucciones de seguimiento: [sin especificar]\nPautas de alarma: [sin especificar]\nConfecci\u00f3n de epicrisis: [sin especificar]", "role": "assistant"}';
    // const parsedResult = result
    //   .replaceAll('[sin especificar]', 'undefined')
    //   .replaceAll('\n', ',');
    // goToResult(JSON.parse(parsedResult));
  };

  const goToResult = (result: any) => {
    navigation.navigate('Edit', {
      result: result,
    });
  };

  const onStopRecording = async () => {
    console.log('STOP');
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    console.log(result);
  };
  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <View style={{padding: 10}}>
          <Button title={'Record sound'} onPress={() => onStartRecording()} />
        </View>
        <View style={{padding: 10}}>
          <Button title={'Stop recording'} onPress={() => onStopRecording()} />
        </View>
      </View>
      <View>
        <Picker
          style={{width: 400}}
          selectedValue={selectedForm}
          onValueChange={itemValue => setSelectedForm(itemValue)}>
          {Object.values(formTypes).map((formType, index) => (
            <Picker.Item label={formType} value={formType} key={index} />
          ))}
        </Picker>
        <Button title={'Send Aduio'} onPress={() => sendAudio()} />
      </View>
    </View>
  );
};

export default RecordScreen;
