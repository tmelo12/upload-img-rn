import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import * as ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'rn-fetch-blob'
var base64 = require('base-64');
var utf8 = require('utf8');

/*
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}*/

export default function App() {
  const [foto, setFoto] = useState();
  const [fileImage, setFileImage] = useState();

  //função recebe a string da imagem convertida em base64 e retorna um file
  function imgBase64toFile(imgBase64) {

    //splitar a string da img e base64
    let arrImg = imgBase64.split(',');

    //com a string 'splitada' temos: 
    //em arrImg[0] o type (data:image/png;base64)
    //em arrImg[1] a string da imagem convertida (strign gigante)

    //capturando o type da imagem
    let type = 'image/png';

    //convertendo a string gigante de arrImg[1] em base64

    //usando bibliotecas utf8 e base 64
    var imgBytes = utf8.encode(arrImg[1]);
    var imgEncoded = base64.encode(imgBytes); //atob


    //usando o import RNFetchBlob
    let imgDataConvertedB64 = ''
    RNFetchBlob.fs.readStream(
      // file path
      arrImg[1],
      // encoding, should be one of `base64`, `utf8`, `ascii`
      'base64'
    )
      .then((ifstream) => {
        console.log("IFSTREAM => ", ifstream)
        ifstream.open()
        ifstream.onData((chunk) => {
          // when encoding is `ascii`, chunk will be an array contains numbers
          // otherwise it will be a string
          imgDataConvertedB64 += chunk
        })
        ifstream.onError((err) => {
          console.log('Error encoding image ', err)
        })
        ifstream.onEnd(() => {
          let imageBase64 = `data:${type},base64` + imgDataConvertedB64;

          let n = imageBase64.length;
          let u8arr = new Uint8Array(n);

          //convertendo caracteres da img "atobada"
          while (n--) {
            u8arr[n] = imageBase64.charCodeAt(n);
          }
          
          //criando o arquivo que vai no formData
          let ohMyFile = new File([u8arr], 'image', {type: type});

          setFileImage(ohMyFile);
          //return ohMyFile;
        })
      })

    //tamanho da string
    let tamanho = imgEncoded.length;

    let u8arr = new Uint8Array(tamanho);

    //convertendo caracteres da img "atobada"
    while (tamanho--) {
      u8arr[tamanho] = imgEncoded.charCodeAt(tamanho);
    }

    //criando o arquivo que vai no formData
    let ohMyFile = new File([u8arr], 'image', {type: type})

    setFileImage(ohMyFile);
    //return ohMyFile;
  }

  const requestUpload = async (imgFile) => {
    let formData = new FormData();
    formData.append('image', imgFile, imgFile.name);
    await fetch("http://10.46.6.185:4000/upload", {
      method: "patch",
      body: formData,
      //body: JSON.stringify(data._parts[0]),
      headers: {
        //"Content-type": "application/json; charset=UTF-8",
        'Content-Type': 'multipart/form-data;charset=utf-8',
      },
    });
  }

  const requisicao = async () => {
    //console.log(foto.assets[0])

    var bytes = utf8.encode(foto.assets[0].uri);
    var encoded = base64.encode(bytes);
    let imgBase64 = `data:${foto.assets[0].type},base64` + encoded
    console.log("img in base64 => ", imgBase64);

    /*let ohMyBlob = dataURItoBlob(foto.assets[0].uri)
    console.log("My blob => ", ohMyBlob)
    /*const data = new FormData();
    data.append('file', {
      name: foto.assets[0].fileName,
      type: foto.assets[0].type,
      uri: Platform.OS === 'ios' ?
        foto.assets[0].uri.replace('file://', '')
        : foto.assets[0].uri,
    });

    console.log("sending image in formdata")

    console.log("photo => ",foto)

    await fetch("http://192.168.0.21:3000/upload", {
      method: "post",
      body: data,
      //body: JSON.stringify(data._parts[0]),
      headers: {
        //"Content-type": "application/json; charset=UTF-8",
        'Content-Type': 'multipart/form-data;charset=utf-8',
      },
    });*/
  }

  const testando = async () => {
    if (!foto) {
      console.log("No image provided!");
      return;
    }
    console.log("My state image => ", foto)
    console.log("URI => ", foto.assets[0].uri)

    //Tratamento da string uri para ios
    const uriIos = Platform.OS === 'ios' ? foto.assets[0].uri.replace('file://', '') : foto.assets[0].uri
    let data = ''
    RNFetchBlob.fs.readStream(
      // file path
      foto.assets[0].uri,
      // encoding, should be one of `base64`, `utf8`, `ascii`
      'base64'
    )
      .then((ifstream) => {
        console.log("IFSTREAM => ", ifstream)
        ifstream.open()
        ifstream.onData((chunk) => {
          // when encoding is `ascii`, chunk will be an array contains numbers
          // otherwise it will be a string
          data += chunk
        })
        ifstream.onError((err) => {
          console.log('Error encoding image ', err)
        })
        ifstream.onEnd(() => {
          let imgBase64 = `data:${foto.assets[0].type},base64` + data
          //console.log("Image in base64 => ", imgBase64)
        })
      })
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop: 20 }}>
        <View>
          <TouchableOpacity style={styles.btnFoto}
            onPress={() =>
              ImagePicker.launchCamera(
                {
                  mediaType: 'photo',
                  includeBase64: false,
                  maxHeight: 1000,
                  maxWidth: 1000,
                },
                (foto) => {
                  console.log("My image from camera: ", foto);
                  setFoto(foto);
                },
              )
            }
          >
            <Text style={{ color: 'white' }}>Foto da Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnFoto}
            onPress={() =>
              ImagePicker.launchImageLibrary(
                {
                  mediaType: 'photo',
                  includeBase64: false,
                  maxHeight: 1000,
                  maxWidth: 1000,
                },
                (foto) => {
                  console.log("My image in gallery: ", foto);
                  setFoto(foto);
                },
              )
            }
          >
            <Text style={{ color: 'white' }}>Foto da Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop: 20 }}>
        <TouchableOpacity style={styles.btnSalvar} onPress={testando}>
          <Text style={{ color: 'white' }}>Salvar</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop: 20 }}>
        <TouchableOpacity style={styles.btnSalvar} onPress={requisicao}>
          <Text style={{ color: 'white' }}>Requisicao</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnSalvar: {
    borderWidth: 1,
    borderColor: '#00b33c',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00b33c',
    borderRadius: 10
  },
  btnCancelar: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#ff3333',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3333',
    borderRadius: 10
  },
  btnFoto: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#1a75ff',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a75ff',
    borderRadius: 10
  },
  container: {
    flex: 1,
    alignItems: "center"
  },
});