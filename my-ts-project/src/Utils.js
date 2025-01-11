"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /**
     * Computes weights following a normal distribution
     * @param size - Number of weights to generate
     * @returns Array of weights that sum to 1
     */
    Utils.computeNormalWeights = function (size) {
        var weights = new Array(size);
        var mean = 0;
        var stdDev = 1;
        // Generate weights using normal distribution
        for (var i = 0; i < size; i++) {
            var x = (i / (size - 1)) * 6 - 3; // Map to [-3, 3]
            weights[i] = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        }
        // Normalize weights to sum to 1
        var sum = weights.reduce(function (a, b) { return a + b; }, 0);
        return weights.map(function (w) { return w / sum; });
    };
    /**
     * Compute Euclidean distance between two vectors
     */
    Utils.computeEuclideanDistance = function (a, b) {
        if (a.length !== b.length) {
            throw new Error('Vectors must have the same length');
        }
        return Math.sqrt(a.reduce(function (sum, val, i) { return sum + Math.pow(val - b[i], 2); }, 0));
    };
    return Utils;
}());
exports.Utils = Utils;
