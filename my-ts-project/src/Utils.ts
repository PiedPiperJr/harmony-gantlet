export class Utils {
  /**
   * Computes weights following a normal distribution
   * @param size - Number of weights to generate
   * @returns Array of weights that sum to 1
   */
  static computeNormalWeights(size: number): number[] {
    const weights: number[] = new Array(size);
    const mean = 0;
    const stdDev = 1;

    // Generate weights using normal distribution
    for (let i = 0; i < size; i++) {
      const x = (i / (size - 1)) * 6 - 3; // Map to [-3, 3]
      weights[i] = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    }

    // Normalize weights to sum to 1
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum);
  }
  /**
   * Compute Euclidean distance between two vectors
   */
  static computeEuclideanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    return Math.sqrt(
      a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
    );
  }
}