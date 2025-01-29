import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
    try {
        // Chargement parallèle des deux modèles
        const model = await tf.loadLayersModel("models/tfjs/unnormalized_model/model.json")

        console.log('Les deux modèles ont été chargés avec succès');
        return model;
    } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
    }
}

export async function predictTf(model: tf.LayersModel, grid: number[][], alphabet:string[]) {
    if (!model) {
        console.warn('Le modèle n\'est pas encore chargé');
        return;
    }

    try {
        // Convertir la grille en tensor 3D (1, 5, 5)
        const input = tf.tensor3d([grid]);
        console.log('Input tensor shape:', input.shape);

        // Faire la prédiction
        let prediction = model.predict(input);
        // Convertir le tenseur en tableau JavaScript
        const predictionArray = await prediction.array();
        
        // Libérer la mémoire
        input.dispose();
        prediction.dispose();
        
        // 
        let letter = "0"
        let min = 10000
        
        // predictionArray[0]
        for (let i = 0; i< 26; i++) {
            if (!isNaN(predictionArray[0][i]) && predictionArray[0][i] <= min) {
                min = predictionArray[0][i]
                letter  = alphabet[i]
            }

        }

        return letter;
    } catch (error) {
        console.error('Erreur lors de la prédiction:', error);
        alert('Erreur lors de la prédiction');
    }
}
