"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predict_v1 = predict_v1;
exports.predict_v2 = predict_v2;
var mean_states__normal_law_1 = require("./mean_states__normal_law");
var mean_positions__uniform_law_1 = require("./mean_positions__uniform_law");
var types_1 = require("./types");
var Matrix2D_1 = require("./Matrix2D");
var Utils_1 = require("./Utils");
var fs = require("fs");
function predict_v1(inputData, meanStates, useNormalLaw) {
    var inputMean = inputData.computeMean(types_1.Axis.x, useNormalLaw);
    var distances = {};
    for (var _i = 0, alphabetLetters_1 = types_1.alphabetLetters; _i < alphabetLetters_1.length; _i++) {
        var alphabetLetter = alphabetLetters_1[_i];
        distances[alphabetLetter] = Utils_1.Utils.computeEuclideanDistance(inputMean, meanStates[alphabetLetter]);
    }
    // return inputMean
    return Object.entries(distances)
        .reduce(function (min, _a) {
        var k = _a[0], v = _a[1];
        return v < min[1] ? [k, v] : min;
    }, ['', Infinity])[0];
}
function predict_v2(inputData, meanPositions, decisionStrategy) {
    if (decisionStrategy === void 0) { decisionStrategy = 'vote'; }
    // Compute distances for each position
    var distances = [];
    var _loop_1 = function (letter) {
        var letterDistances = inputData.rows().map(function (row, pos) {
            return Utils_1.Utils.computeEuclideanDistance(row, meanPositions[letter].getRow(pos));
        });
        distances.push(letterDistances);
    };
    for (var _i = 0, alphabetLetters_2 = types_1.alphabetLetters; _i < alphabetLetters_2.length; _i++) {
        var letter = alphabetLetters_2[_i];
        _loop_1(letter);
    }
    // Get predictions for each position
    var predictions = distances[0].map(function (_, posIndex) {
        var positionDistances = distances.map(function (letterDistances) { return letterDistances[posIndex]; });
        var minIndex = positionDistances.indexOf(Math.min.apply(Math, positionDistances));
        return types_1.alphabetLetters[minIndex];
    });
    if (decisionStrategy === 'vote') {
        // Count occurrences of each letter
        var counts = predictions.reduce(function (acc, letter) {
            acc[letter] = (acc[letter] || 0) + 1;
            return acc;
        }, {});
        // Find letter(s) with maximum count
        var maxCount_1 = Math.max.apply(Math, Object.values(counts));
        var mostFrequentLetters = Object.entries(counts)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(function (_a) {
            var _ = _a[0], count = _a[1];
            return count === maxCount_1;
        })
            .map(function (_a) {
            var letter = _a[0];
            return letter;
        });
        // In case of tie, return first letter alphabetically
        return mostFrequentLetters.sort()[0];
    }
    else { // mean_distance strategy
        var meanDistances = types_1.alphabetLetters.map(function (_, letterIndex) {
            return distances[letterIndex].reduce(function (sum, d) { return sum + d; }, 0) / distances[letterIndex].length;
        });
        var minMeanIndex = meanDistances.indexOf(Math.min.apply(Math, meanDistances));
        return types_1.alphabetLetters[minMeanIndex];
    }
}
function convert(meanPos) {
    var result = {};
    for (var _i = 0, alphabetLetters_3 = types_1.alphabetLetters; _i < alphabetLetters_3.length; _i++) {
        var alphabetLetter = alphabetLetters_3[_i];
        result[alphabetLetter] = Matrix2D_1.Matrix2D.fromData(meanPos[alphabetLetter]);
    }
    return result;
}
var inputData = new Matrix2D_1.Matrix2D(7, 11, [
    [467, 452, 493, 458, 771, 638, 408, 229, 100, 333, 201],
    [415, 498, 514, 559, 442, 605, 763, 576, 455, 443, 173],
    [563, 416, 443, 337, 756, 283, 508, 112, 100, 100, 223],
    [444, 321, 607, 334, 685, 576, 435, 647, 129, 278, 203],
    [513, 411, 437, 402, 360, 484, 259, 343, 519, 100, 100],
    [284, 591, 535, 456, 149, 176, 173, 378, 206, 290, 100],
    [414, 434, 485, 488, 523, 725, 308, 669, 211, 230, 100],
]);
var prediction_v1 = predict_v1(inputData, mean_states__normal_law_1.default);
fs.writeFileSync('./v1.txt', prediction_v1);
var prediction_v2 = predict_v2(inputData, convert(mean_positions__uniform_law_1.default));
process.stdout.write(prediction_v2);
