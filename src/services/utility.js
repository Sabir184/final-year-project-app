
import firebase from '@react-native-firebase/app';

import  { db, auth, storage } from './firebaseConfig';

import { _storeData, _retrieveData } from './AsyncFuncs';

 
export async function getAllOfCollection(collection) {
  let data = [];
  let querySnapshot = await db.collection(collection).get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push(doc.data());
    } else { 
      console.log('No document found!');
    }
  });
  return data; 
}

export async function saveData(collection, doc, jsonObject) {
  await db.collection(collection).doc(doc).set(jsonObject, { merge: true }).catch(function (error) {
    console.error("Error writing document: ", error);
  });
  //console.log("Document successfully written!"); 
}
export async function saveDataWithoutDocId(collection, jsonObject) {
  let docRef = await db.collection(collection).doc();
  docRef.set(jsonObject);
  return docRef;
}

export async function addToArray(collection, doc, array, value) {
  let docRef = await
    db.collection(collection).doc(doc);
  let docData = await docRef.get();
  if (docData.exists && (docData.data()[array] != undefined)) {
    docRef.update({
      [array]: firebase.firestore.FieldValue.arrayUnion(value)
    });
  }
  else {
    saveData(collection, doc, { [array]: [value] });
  }
}


export async function getAllOfCollection2(collection) {
  let data = [];
  let querySnapshot = await firebase.firestore().collection(collection).get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      //console.log(doc.data());
      data.push({ item: doc.data(), id: doc.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export function getData(collection, doc, objectKey) {
  // check if data exists on the given path
  if (objectKey === undefined) {
    return db.collection(collection).doc(doc).get().then(function (doc) {
      if (doc.exists) {
        return doc.data();
      } else {
        return false;
      }
    })
  }
  else {
    return db.collection(collection).doc(doc).get().then(function (doc) {
      if (doc.exists && (doc.data()[objectKey] != undefined)) {
        return (doc.data()[objectKey]);
      } else {
        return false;
      }
    })
  }
}

// export function getDataOrderBy(collection, doc, objectKey) {
//   // check if data exists on the given path
//   if (objectKey === undefined) {
//     return firebase.firestore().collection(collection).doc(doc).get().then(function (doc) {
//       if (doc.exists) {
//         return doc.data();
//       } else {
//         return false;
//       }
//     }) 
//   }
//   else {
//     return firebase.firestore().collection(collection).doc(doc).get().then(function (doc) {
//       if (doc.exists && (doc.data()[objectKey] != undefined)) {
//         return (doc.data()[objectKey]);
//       } else {
//         return false;
//       }
//     })
//   }
// }

export async function getDocRefByKeyValue(collection, key, value) {
  return db.collection(collection)
    .where(key, '==', value).get().then(function (querySnapshot) {
      return querySnapshot.docs[0];
    });
}

export async function getDocByKeyValue(collection, key, value) {
  let data = [];
  let querySnapshot = await db.collection(collection).where(key, "==", value).get();
  await querySnapshot.forEach(function (doc) {
    // console.log('doc id=>',doc.id)
    data.push(doc.data());
  });
  return data; 
}
export async function getDocByKeyValueOR(collection, key, value) {
  let data = [];
  let querySnapshot = await db.collection(collection).where(key, "in", value).get();
  await querySnapshot.forEach(function (doc) {
    // console.log('doc id=>',doc.id)
    data.push(doc.data());
  });
  return data;
}
// export async function getDocByKeyValueDocID(collection, key, value) {
//   let data = [];
//   let querySnapshot = await firebase.firestore().collection(collection).where(key, "==", value).get();
//   await querySnapshot.forEach(function (doc) {
//     // console.log('doc id=>',doc.id)
//     data.push({ item: doc.data(), id: doc.id });
//   });
//   return data;
// }

// export async function getDocByKeyValue2(collection, key, value) {
//   let data = [];
//   let querySnapshot = await firebase.firestore().collection(collection).where(key, "==", value).get();
//   await querySnapshot.forEach(function (doc) {
//     data.push({ item: doc.data(), id: doc.id });
//   });
//   return data;
// }
// export async function getDocWithinRange(collection, doc, strSearch) {
//   let strlength = strSearch.length;
//   let strFrontCode = strSearch.slice(0, strlength - 1);
//   let strEndCode = strSearch.slice(strlength - 1, strSearch.length);

//   let startcode = strSearch;
//   let endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

//   return firebase.firestore().collection(collection)
//     .where(doc, '>=', startcode)
//     .where(doc, '<', endcode).get().then(function (querySnapshot) {
//       querySnapshot.forEach(function (doc) {
//         console.log(doc.data());
//       });
//     });
// }


// export async function saveData(collection, doc, jsonObject) {
//   await firebase.firestore().collection(collection).doc(doc).set(jsonObject, { merge: true }).catch(function (error) {
//     console.error("Error writing document: ", error);
//   });
//   //console.log("Document successfully written!");

// }

// export async function saveDataWithoutDocId(collection, jsonObject) {
//   let docRef = await firebase.firestore().collection(collection).doc();
//   docRef.set(jsonObject);
//   return docRef;
// }

// export async function addToArray(collection, doc, array, value) {
//   let docRef = await
//     db.collection(collection).doc(doc);
//   // console.log('Value',value)
//   let docData = await docRef.get();
//   if (docData.exists && (docData.data()[array] != undefined)) {
//     // console.log('update',value)
//     docRef.update({
//       [array]: db.FieldValue.arrayUnion(value)
//     });

//   }
//   else {
//     // console.log('saveData',value)
//     saveData(collection, doc, { [array]: [value] });
//   }
// }

export async function updateArray(collection, doc, array, value, index) {
  let docRef = await db.collection(collection).doc(doc);
  let docData = await docRef.get();

  if (docData.exists && (docData.data()[array][index] != undefined)) {
    docRef.update({
      [array]: firebase.firestore.FieldValue.arrayRemove(docData.data()[array][index]),

    }).then(async () => {
      let docRef1 = await db.collection(collection).doc(doc);
      let docData1 = await docRef1.get();
      if (docData1.exists && (docData1.data()[array] != undefined)) {
        docRef1.update({
          [array]: firebase.firestore.FieldValue.arrayUnion(value),
        })
      }

    });
  }
}
export async function removeItemfromArray(collection, doc, array, index) {
  let docRef = await db.collection(collection).doc(doc);
  let docData = await docRef.get();

  if (docData.exists && (docData.data()[array][index] != undefined)) {
    docRef.update({
      [array]: firebase.firestore.FieldValue.arrayRemove(docData.data()[array][index]),

    })
  }
}

export async function addToArrayUpdate(collection, doc, array, value) {
  let docRef = await
    db.collection(collection).doc(doc);
  let docData = await docRef.get();
  if (docData.exists && (docData.data()[array] != undefined)) {
    docRef.set({
      [array]: firebase.firestore.FieldValue.arrayUnion(value)
    });
  }

}
export async function downloadImage(folder, imageName) {
  var storageRef = storage.ref();
  var pathRef = storageRef.child(folder + '/' + imageName);

  let url = await pathRef.getDownloadURL()
  return url;
}
// export async function downloadImage2(imageName) {
//   var storageRef = firebase.storage().ref();
//   var pathRef = storageRef.child('/' + imageName);

//   let url = await pathRef.getDownloadURL()
//   return url;
// }

export async function deleteDoc(collection, doc) {
  let db = firebase.firestore();
  await db.collection(collection).doc(doc).delete().catch(function (error) {
    console.error("Error removing document: ", error);
  });
}

// export async function updateField(collection, doc, field, fieldValue) {
//   // console.log('field',[field])
//   let db = firebase.firestore();
//   db.collection(collection).doc(doc).update({
//     [field]: fieldValue
//   }).catch(function (error) {
//     console.error("Error removing document: ", error);
//   });
// }
export async function uriToBlob(uri) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };
    // this helps us get a blob
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);

    xhr.send(null);
  });
}
export async function UpdloadImageToDb(response) {
  var today = new Date();
  var mili = today.getMilliseconds()
  let kk = Date.parse(today)
  kk = kk + mili
  let progress = 0
  let file = await uriToBlob(response.uri)
  response.fileName = kk + response.fileName
  let url = null
  const uploadTask = storage.ref(`StarImage/${response.fileName}`).put(file);
  uploadTask.on('state_changed',
    (snapshot) => {
      progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      if (progress == 100) {
        console.log('progress', progress);
      }
    }, (error) => {
      console.log('error 1', error);
    },
    async () => { return await downloadImage('StarImage', response.fileName) })

}

// export async function DeleteDBAfter24 (collection){
//   var yesterday = firebase.firestore.Timestamp.now();
//   yesterday.seconds = yesterday.seconds - (24 * 60 * 60);
//   db.collection(collection).where("date",">",yesterday)
//       .get().then(function(querySnapshote) {
//         querySnapshote.forEach(function(doc) {
//           console.log(doc.id," => ",doc.data());
//         });
//       })
//   .catch(function(error) {
//         console.log("Error getting documents: ", error);
//   });

//   db.collection(collection).where("date","<",yesterday)
//     .get().then(function(querySnapshote) {
//       querySnapshote.forEach(element => {
//         element.ref.delete();
//       });
//     })
// }

// db.collection('cities')
// .where('regions', 'array-contains','west_coast')
// .get().then(function(snap) {
//   if (snap) {
//     console.log(snap.docs)
//     snap.docs.forEach(function (doc) {
//        console.log(doc.id);
//       console.log(doc.data());
//     });
//   }
// });