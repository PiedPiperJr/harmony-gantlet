import meanStatesDataU from './mean_states__normal_law';
import meanPositionsDataU from './mean_positions__uniform_law';
import { alphabetLetters, Axis, } from './types';
import { Matrix2D } from './Matrix2D';
import { Utils } from './Utils';
import * as fs from 'fs';
export function predict_v1(inputData, meanStates, useNormalLaw) {
    const inputMean = inputData.computeMean(Axis.x, useNormalLaw);
    const distances = {};
    for (const alphabetLetter of alphabetLetters)
        distances[alphabetLetter] = Utils.computeEuclideanDistance(inputMean, meanStates[alphabetLetter]);
    // return inputMean
    return Object.entries(distances)
        .reduce((min, [k, v]) => v < min[1] ? [k, v] : min, ['', Infinity])[0];
}
export function predict_v2(inputData, meanPositions, decisionStrategy = 'vote') {
    // Compute distances for each position
    const distances = [];
    for (const letter of alphabetLetters) {
        const letterDistances = inputData.rows().map((row, pos) => Utils.computeEuclideanDistance(row, meanPositions[letter].getRow(pos)));
        distances.push(letterDistances);
    }
    // Get predictions for each position
    const predictions = distances[0].map((_, posIndex) => {
        const positionDistances = distances.map(letterDistances => letterDistances[posIndex]);
        const minIndex = positionDistances.indexOf(Math.min(...positionDistances));
        return alphabetLetters[minIndex];
    });
    if (decisionStrategy === 'vote') {
        // Count occurrences of each letter
        const counts = predictions.reduce((acc, letter) => {
            acc[letter] = (acc[letter] || 0) + 1;
            return acc;
        }, {});
        // Find letter(s) with maximum count
        const maxCount = Math.max(...Object.values(counts));
        const mostFrequentLetters = Object.entries(counts)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, count]) => count === maxCount)
            .map(([letter]) => letter);
        // In case of tie, return first letter alphabetically
        return mostFrequentLetters.sort()[0];
    }
    else { // mean_distance strategy
        const meanDistances = alphabetLetters.map((_, letterIndex) => distances[letterIndex].reduce((sum, d) => sum + d, 0) / distances[letterIndex].length);
        const minMeanIndex = meanDistances.indexOf(Math.min(...meanDistances));
        return alphabetLetters[minMeanIndex];
    }
}
function convert(meanPos) {
    const result = {};
    for (const alphabetLetter of alphabetLetters)
        result[alphabetLetter] = Matrix2D.fromData(meanPos[alphabetLetter]);
    return result;
}
const inputData = new Matrix2D(7, 11, [
    [467, 452, 493, 458, 771, 638, 408, 229, 100, 333, 201],
    [415, 498, 514, 559, 442, 605, 763, 576, 455, 443, 173],
    [563, 416, 443, 337, 756, 283, 508, 112, 100, 100, 223],
    [444, 321, 607, 334, 685, 576, 435, 647, 129, 278, 203],
    [513, 411, 437, 402, 360, 484, 259, 343, 519, 100, 100],
    [284, 591, 535, 456, 149, 176, 173, 378, 206, 290, 100],
    [414, 434, 485, 488, 523, 725, 308, 669, 211, 230, 100],
]);
const prediction_v1 = predict_v1(inputData, meanStatesDataU);
fs.writeFileSync('./v1.txt', prediction_v1);
const prediction_v2 = predict_v2(inputData, convert(meanPositionsDataU));
process.stdout.write(prediction_v2);
