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

export async function predictTf(model: tf.LayersModel, grid: number[][]) {
    if (!model) {
        alert('Le modèle n\'est pas encore chargé');
        return;
    }

    try {
        // Convertir la grille en tensor 3D (1, 5, 5)
        const input = tf.tensor3d([grid]);
        console.log('Input tensor shape:', input.shape);
        console.log('Input values:', await input.array());

        // Faire la prédiction
        let prediction = model.predict(input);
        console.log('Prédiction brute:', prediction);

        // Obtenir l'index de la classe prédite
        // const predictedIndex = prediction.indexOf(Math.max(...prediction[0]));
        // const predictedLetter = String.fromCharCode(65 + predictedIndex);

        input.dispose();

        return prediction;
    } catch (error) {
        console.error('Erreur lors de la prédiction:', error);
        alert('Erreur lors de la prédiction');
    }
}
