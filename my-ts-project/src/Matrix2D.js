"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix2D = void 0;
var types_1 = require("./types");
var Utils_1 = require("./Utils");
var Matrix2D = /** @class */ (function () {
    function Matrix2D(row_number, col_number, data) {
        this.row_number = row_number;
        this.col_number = col_number;
        if (data && this.isValidMatrixSize(this.row_number, this.col_number, data)) {
            this.data = data;
        }
        else {
            console.warn('Les données entrée ne correspondent pas à la taille de la matrice;');
            console.info('Initilisation avec la matrice nulle');
            this.data = [];
            for (var i = 0; i < this.row_number; i++) {
                this.data[i] = [];
                for (var j = 0; j < this.col_number; j++)
                    this.data[i][j] = 0;
            }
        }
    }
    Matrix2D.fromData = function (data) {
        var r = data.length;
        var c = data[0].length;
        return new Matrix2D(r, c, data);
    };
    Matrix2D.prototype.isValidMatrixSize = function (row_number, col_number, data) {
        if (data.length != row_number)
            return false;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var row = data_1[_i];
            if (row.length != col_number)
                return false;
        }
        return true;
    };
    Matrix2D.prototype.computeMean = function (axis, useNormalLaw) {
        if (axis == types_1.Axis.x)
            return this._computeXMean(useNormalLaw);
        else
            return this._computeYMean(useNormalLaw);
    };
    /**
     * Retourne un vecteur de la taille de [this.col_number]
     */
    Matrix2D.prototype._computeXMean = function (useNormalLaw) {
        if (useNormalLaw === void 0) { useNormalLaw = false; }
        var weights = useNormalLaw ?
            Utils_1.Utils.computeNormalWeights(this.row_number) :
            Array(this.row_number).fill(1 / this.row_number);
        var result = new Array(this.col_number).fill(0);
        for (var j = 0; j < this.col_number; j++)
            for (var i = 0; i < this.row_number; i++)
                result[j] += this.data[i][j] * weights[i];
        return result;
    };
    /**
     * Retourne un vecteur de la taille de [this.row_number]
     */
    Matrix2D.prototype._computeYMean = function (useNormalLaw) {
        if (useNormalLaw === void 0) { useNormalLaw = false; }
        var weights = useNormalLaw ?
            Utils_1.Utils.computeNormalWeights(this.col_number) :
            Array(this.col_number).fill(1 / this.col_number);
        var result = new Array(this.row_number).fill(0);
        for (var i = 0; i < this.row_number; i++)
            for (var j = 0; j < this.col_number; j++)
                result[i] += this.data[i][j] * weights[j];
        return result;
    };
    // New methods added below
    /**
     * Get a specific row from the matrix
     */
    Matrix2D.prototype.getRow = function (index) {
        if (index < 0 || index >= this.row_number) {
            throw new Error("Row index ".concat(index, " out of bounds"));
        }
        return __spreadArray([], this.data[index], true);
    };
    /**
     * Get a specific column from the matrix
     */
    Matrix2D.prototype.getColumn = function (index) {
        if (index < 0 || index >= this.col_number) {
            throw new Error("Column index ".concat(index, " out of bounds"));
        }
        return this.data.map(function (row) { return row[index]; });
    };
    /**
     * Get all rows of the matrix
     */
    Matrix2D.prototype.rows = function () {
        return this.data.map(function (row) { return __spreadArray([], row, true); });
    };
    /**
     * Get all columns of the matrix
     */
    Matrix2D.prototype.columns = function () {
        var _this = this;
        return Array.from({ length: this.col_number }, function (_, i) { return _this.getColumn(i); });
    };
    /**
     * Subtract another matrix from this one
     */
    Matrix2D.prototype.subtract = function (other) {
        if (this.row_number !== other.row_number || this.col_number !== other.col_number) {
            throw new Error('Matrix dimensions must match for subtraction');
        }
        var resultData = this.data.map(function (row, i) {
            return row.map(function (val, j) { return val - other.data[i][j]; });
        });
        return new Matrix2D(this.row_number, this.col_number, resultData);
    };
    /**
     * Add another matrix to this one
     */
    Matrix2D.prototype.add = function (other) {
        if (this.row_number !== other.row_number || this.col_number !== other.col_number) {
            throw new Error('Matrix dimensions must match for addition');
        }
        var resultData = this.data.map(function (row, i) {
            return row.map(function (val, j) { return val + other.data[i][j]; });
        });
        return new Matrix2D(this.row_number, this.col_number, resultData);
    };
    /**
     * Multiply matrix by a scalar
     */
    Matrix2D.prototype.multiply = function (scalar) {
        var resultData = this.data.map(function (row) {
            return row.map(function (val) { return val * scalar; });
        });
        return new Matrix2D(this.row_number, this.col_number, resultData);
    };
    /**
     * Create a copy of the matrix
     */
    Matrix2D.prototype.clone = function () {
        return new Matrix2D(this.row_number, this.col_number, this.data.map(function (row) { return __spreadArray([], row, true); }));
    };
    /**
     * Calculate the Frobenius norm of the matrix
     */
    Matrix2D.prototype.norm = function () {
        return Math.sqrt(this.data.reduce(function (sum, row) {
            return sum + row.reduce(function (rowSum, val) {
                return rowSum + val * val;
            }, 0);
        }, 0));
    };
    /**
     * Calculate the norm along a specific axis
     */
    Matrix2D.prototype.normAlongAxis = function (axis) {
        if (axis === types_1.Axis.x) {
            return this.columns().map(function (col) {
                return Math.sqrt(col.reduce(function (sum, val) { return sum + val * val; }, 0));
            });
        }
        else {
            return this.rows().map(function (row) {
                return Math.sqrt(row.reduce(function (sum, val) { return sum + val * val; }, 0));
            });
        }
    };
    /**
     * Convert matrix to string representation
     */
    Matrix2D.prototype.toString = function () {
        return this.data.map(function (row) { return row.join('\t'); }).join('\n');
    };
    return Matrix2D;
}());
exports.Matrix2D = Matrix2D;
