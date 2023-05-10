import MMKVStorage, { create, MMKVLoader } from 'react-native-mmkv-storage';
import MMKV from 'react-native-mmkv-storage';
import { kdTree } from './kd-tree';

const INDEX_KEY_PREFIX = 'vector_database_index_';
const VECTOR_KEY_PREFIX = 'vector_database_vector_';

class VectorDatabase {

    
  constructor(databaseName, dimension) {
    this.databaseName = databaseName;
    this.dimension = dimension;
    this.indexKey = `${INDEX_KEY_PREFIX}${this.databaseName}`;
    this.vectorKey = `${VECTOR_KEY_PREFIX}${this.databaseName}`;
    this.MMKV = new MMKVLoader().initialize();
    this.index = new kdTree([], this.euclideanDistance, [
      ...Array.from({ length: this.dimension }, () => 'x')
    ]);
  }

  
  levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // calculate Levenshtein distance
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }


  euclideanDistance(a, b) {
    let distance = 0;
    for (let i = 0; i < a.length; i++) {
      distance += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(distance);
  }

  async addVector(vectorId, vector) {
    const vectorData = await this.MMKV.getArrayAsync(this.vectorKey) || [];
    vectorData[vectorId] = vector;
    await this.MMKV.setArrayAsync(this.vectorKey, vectorData);
    this.index.insert(vector, vectorId);

  }

  async getVector(vectorId) {
    const vectorData = await this.MMKV.getArrayAsync(this.vectorKey) || [];
    return vectorData[vectorId];
  }

  async searchVectors(queryVector, k) {
    const results = this.index.nearest(queryVector, k);
    const vectorData = await this.MMKV.getArrayAsync(this.vectorKey) || [];
    return results.map(result => {
      const vectorId = result[0];
      const distance = result[1];
      const vector = vectorData[vectorId];
      return { vectorId, vector, distance };
    });
  }

  async addWordVector(vectorId, vector) {
    const vectorData = await this.MMKV.getArrayAsync(this.vectorKey) || [];
    vectorData.push([vectorId, ...vector]);
    await this.MMKV.setArrayAsync(this.vectorKey, vectorData);
    this.index.insert(vector, vectorId);
  }

  async searchWordVectors(queryVector, k) {

    const queryVectorLowerCase = queryVector.map(word => word.toLowerCase()); // convert to lowercase before searching
    const results = this.index.nearest(queryVectorLowerCase, k);
    console.log(results);
    const vectorData = await this.MMKV.getArrayAsync(this.vectorKey) || [];

    return results.map(result => {
      const vectorId = result[0];
      const distance = result[1];
      const vector = vectorData[vectorId];
      return { vectorId, vector, distance };
    });

  }

  async updateVector(vectorId, vector) {
    const vectorData = await MMKV.getArrayAsync(this.vectorKey) || [];
    vectorData[vectorId] = vector;
    await this.MMKV.setArrayAsync(this.vectorKey, vectorData);
    this.index.remove(vectorId);
    this.index.insert(vector, vectorId);
  }

  async deleteVector(vectorId) {
    const vectorData = await this.MMKV.getArrayAsync(this.vectorKey) || [];
    delete vectorData[vectorId];
    await this.MMKV.setArrayAsync(this.vectorKey, vectorData);
    this.index.remove(vectorId);
  }
}

export default VectorDatabase;