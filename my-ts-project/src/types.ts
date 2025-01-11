import { Matrix2D } from './Matrix2D';

export enum Axis {
  x, y
}

export type MeanStates = Record<AlphabetLetter, number[]>;
export type MeanPositions = Record<AlphabetLetter, Matrix2D>;

export const alphabetLetters: AlphabetLetter[] = 'abcdefghijklmnopqrstuvwxyz'.split('') as AlphabetLetter[];

export type DecisionStrategy = 'vote' | 'mean_distance';

export type AlphabetLetter =
  'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

