import { Axis } from './types';
import { Utils } from './Utils';

export class Matrix2D {
  data: number[][];
  row_number: number;
  col_number: number;

  constructor(row_number: number, col_number: number, data?: Array<Array<number>>) {
    this.row_number = row_number;
    this.col_number = col_number;

    if (data && this.isValidMatrixSize(this.row_number, this.col_number, data)) {
      this.data = data;
    } else {
      console.warn('Les données entrée ne correspondent pas à la taille de la matrice;');
      console.info('Initilisation avec la matrice nulle');
      this.data = [];
      for (let i = 0; i < this.row_number; i++) {
        this.data[i] = [];
        for (let j = 0; j < this.col_number; j++)
          this.data[i][j] = 0;
      }
    }
  }

  static  fromData(data: number[][]): Matrix2D {
    const r = data.length;
    const c = data[0].length
    return new Matrix2D(r, c, data);
  }

  isValidMatrixSize(row_number: number, col_number: number, data: Array<Array<number>>): boolean {
    if (data.length != row_number)
      return false;
    for (const row of data)
      if (row.length != col_number)
        return false;
    return true;
  }

  computeMean(axis: Axis, useNormalLaw?: boolean): number[] {
    if (axis == Axis.x)
      return this._computeXMean(useNormalLaw);
    else
      return this._computeYMean(useNormalLaw);
  }

  /**
   * Retourne un vecteur de la taille de [this.col_number]
   */
  private _computeXMean(useNormalLaw: boolean = false): number[] {
    const weights = useNormalLaw ?
      Utils.computeNormalWeights(this.row_number) :
      Array(this.row_number).fill(1 / this.row_number);

    const result = new Array(this.col_number).fill(0);

    for (let j = 0; j < this.col_number; j++)
      for (let i = 0; i < this.row_number; i++)
        result[j] += this.data[i][j] * weights[i];

    return result;
  }

  /**
   * Retourne un vecteur de la taille de [this.row_number]
   */
  private _computeYMean(useNormalLaw: boolean = false): number[] {
    const weights = useNormalLaw ?
      Utils.computeNormalWeights(this.col_number) :
      Array(this.col_number).fill(1 / this.col_number);

    const result = new Array(this.row_number).fill(0);

    for (let i = 0; i < this.row_number; i++)
      for (let j = 0; j < this.col_number; j++)
        result[i] += this.data[i][j] * weights[j];

    return result;
  }

  // New methods added below

  /**
   * Get a specific row from the matrix
   */
  getRow(index: number): number[] {
    if (index < 0 || index >= this.row_number) {
      throw new Error(`Row index ${index} out of bounds`);
    }
    return [...this.data[index]];
  }

  /**
   * Get a specific column from the matrix
   */
  getColumn(index: number): number[] {
    if (index < 0 || index >= this.col_number) {
      throw new Error(`Column index ${index} out of bounds`);
    }
    return this.data.map(row => row[index]);
  }

  /**
   * Get all rows of the matrix
   */
  rows(): number[][] {
    return this.data.map(row => [...row]);
  }

  /**
   * Get all columns of the matrix
   */
  columns(): number[][] {
    return Array.from({ length: this.col_number }, (_, i) => this.getColumn(i));
  }

  /**
   * Subtract another matrix from this one
   */
  subtract(other: Matrix2D): Matrix2D {
    if (this.row_number !== other.row_number || this.col_number !== other.col_number) {
      throw new Error('Matrix dimensions must match for subtraction');
    }

    const resultData = this.data.map((row, i) =>
      row.map((val, j) => val - other.data[i][j]),
    );

    return new Matrix2D(this.row_number, this.col_number, resultData);
  }

  /**
   * Add another matrix to this one
   */
  add(other: Matrix2D): Matrix2D {
    if (this.row_number !== other.row_number || this.col_number !== other.col_number) {
      throw new Error('Matrix dimensions must match for addition');
    }

    const resultData = this.data.map((row, i) =>
      row.map((val, j) => val + other.data[i][j]),
    );

    return new Matrix2D(this.row_number, this.col_number, resultData);
  }

  /**
   * Multiply matrix by a scalar
   */
  multiply(scalar: number): Matrix2D {
    const resultData = this.data.map(row =>
      row.map(val => val * scalar),
    );

    return new Matrix2D(this.row_number, this.col_number, resultData);
  }

  /**
   * Create a copy of the matrix
   */
  clone(): Matrix2D {
    return new Matrix2D(
      this.row_number,
      this.col_number,
      this.data.map(row => [...row]),
    );
  }

  /**
   * Calculate the Frobenius norm of the matrix
   */
  norm(): number {
    return Math.sqrt(
      this.data.reduce((sum, row) =>
        sum + row.reduce((rowSum, val) =>
          rowSum + val * val, 0), 0),
    );
  }

  /**
   * Calculate the norm along a specific axis
   */
  normAlongAxis(axis: Axis): number[] {
    if (axis === Axis.x) {
      return this.columns().map(col =>
        Math.sqrt(col.reduce((sum, val) => sum + val * val, 0)),
      );
    } else {
      return this.rows().map(row =>
        Math.sqrt(row.reduce((sum, val) => sum + val * val, 0)),
      );
    }
  }

  /**
   * Convert matrix to string representation
   */
  toString(): string {
    return this.data.map(row => row.join('\t')).join('\n');
  }
}