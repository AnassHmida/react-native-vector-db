import { MMKVLoader } from 'react-native-mmkv-storage';
import { kdTree } from './kd-tree';

const INDEX_KEY_PREFIX = 'vector_database_index_';
const VECTOR_KEY_PREFIX = 'vector_database_vector_';

class VectorDatabase {
  constructor(databaseName, dimension) {
    this.indexKey = `${INDEX_KEY_PREFIX}${databaseName}`;
    this.vectorKey = `${VECTOR_KEY_PREFIX}${databaseName}`;
    this.MMKV = new MMKVLoader().initialize();
    this.index = new kdTree([], this.euclideanDistance, [
      ...Array.from({ length: dimension }, () => 'x')
    ]);
  }
   euclideanDistance(a, b) {
    let distance = 0;
    for (let i = 0; i < a.length; i++) {
      if (Array.isArray(a[i]) && Array.isArray(b[i])) {
        distance += euclideanDistance(a[i], b[i]) ** 2;
      } else {
        distance += (a[i] - b[i]) ** 2;
      }
    }
    return Math.sqrt(distance);
  }

  async addVector(vectorId, vector) {
    const vectorData = (await this.MMKV.getMapAsync(this.vectorKey)) || {};
    vectorData[vectorId] = vector;
    await this.MMKV.setMapAsync(this.vectorKey, vectorData);
    this.index.insert(vector, vectorId);
    

  }

  async searchWorddVectors(queryVector, k) {
    const results = this.index.nearest(queryVector, k);
    const vectorData = await this.MMKV.getMapAsync(this.vectorKey) || new Map();
    const wordData = await this.MMKV.getMapAsync(this.indexKey) || new Map();
    return results.map(result => {
      const vectorId = result[0];
      const vector = vectorData.get(vectorId);
      const word = wordData.get(vectorId);
      if (!vector || !word) {
        // vectorId not found in vectorData or wordData
        return null;
      }
      const distance = this.euclideanDistance(vector, queryVector);
      console.log("hello , ",distance)
      return { word, distance };
    });
  }
  async getVector(vectorId) {
    const vectorData = (await this.MMKV.getMapAsync(this.vectorKey)) || {};
    return vectorData[vectorId];
  }

 
  async searchVectors(queryVector, k) {
    const results = this.index.nearest(queryVector, k);
    const vectorData = (await this.MMKV.getMapAsync(this.vectorKey)) || {};
    return results.map(result => {
      const vectorId = result[0];
      const distance = result[1];
      const vectorKey = this.findVector(vectorData, vectorId);
      const word = vectorKey ? `Vector ${vectorKey}` : 'Unknown';
      return { vectorId, vector: vectorData[vectorKey], distance, word };
    });
  }

   findVector(vectorData, targetVector) {
    for (const key in vectorData) {
      const vector = vectorData[key];
      if (JSON.stringify(vector) === JSON.stringify(targetVector)) {
        return key;
      }
    }
    return null;
  }

  async updateVector(vectorId, vector) {
    const vectorData = (await this.MMKV.getMapAsync(this.vectorKey)) || {};
    vectorData[vectorId] = vector;
    await this.MMKV.setMapAsync(this.vectorKey, vectorData);
    this.index.remove(vectorId);
    this.index.insert(vector, vectorId);
  }

  async deleteVector(vectorId) {
    const vectorData = (await this.MMKV.getMapAsync(this.vectorKey)) || {};
    delete vectorData[vectorId];
    await this.MMKV.setMapAsync(this.vectorKey, vectorData);
    this.index.remove(vectorId);
  }
}

export default VectorDatabase;