import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export async function _storeData(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log("Storage error: " + error);
  }
}

export async function _storeMultipleData(array) {
  try {
    const value = await AsyncStorage.multiSet(array);
  } catch (error) {
    console.log("Error in storing multiple data: " + error);
  }
}

export async function _retrieveData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log("Error in retrieving: " + error);
  }
}

export async function _retrieveMultipleData() {
  var keys = [];
  var values = [];
  for (let i = 0; i < arguments.length; ++i) keys[i] = arguments[i];
  try {
    const value = await AsyncStorage.multiGet(keys);
    if (value !== null) {
      for (let i = 0; i < value.length; ++i) {
        values.push(value[i][1]);
      }
      return values;
    }
  } catch (error) {
    console.log("Error in retrieving: " + error);
  }
}

export async function _removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Remove");
    return true;
  } catch (exception) {
    return false;
  }
}

export async function _removeAll() {
  if (Platform.OS === "android") {
    await AsyncStorage.clear();
  } else {
    AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
  }
}
