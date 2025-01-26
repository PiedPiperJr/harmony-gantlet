import * as tf from '@tensorflow/tfjs';

async function loadModel() {
    const model = await tf.loadLayersModel('./model_weights.json');
    return model;
}

function main(){
    loadModel().then(
        (model)=>{
            console.log("model loaded with success")
        }
    )

}

main()