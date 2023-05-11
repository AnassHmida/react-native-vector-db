import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';

class ImageProcess {
  async getFeatureVectorsFromImage(uri) {
    await tf.ready();
    const model = await mobilenet.load();
    const response = await fetch(uri, {}, { isBinary: true });
    const imageData = await response.arrayBuffer();
    const imageTensor = decodeJpeg(new Uint8Array(imageData));
    const reshapedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const processedImage = tf.cast(reshapedImage, 'float32');
    const featureTensor = await model.infer(processedImage, true);
    return featureTensor.dataSync();
  }
}

export default ImageProcess;