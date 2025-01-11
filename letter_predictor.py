import os
import csv
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union
import numpy as np
from scipy.stats import norm
from string import ascii_lowercase
from dataclasses import dataclass
from enum import Enum


class DecisionStrategy(Enum):
    """Available strategies for letter prediction."""
    VOTE = "vote"
    MEAN_DISTANCE = "mean_distance"  # Added as an alternative strategy


@dataclass
class ModelConfig:
    """Configuration parameters for the letter prediction model."""
    n_samples_per_letter: int = 10      # Number of samples per letter
    n_snapshots: int = 7                # Number of snapshots per sample
    # Number of variables (5 flex + 6 accelerations)
    n_variables: int = 11
    # Range for normal distribution
    normal_dist_range: Tuple[float, float] = (-3, 3)
    data_dir: str = "data_generated"
    result_dir: str = "result"
    use_normal_law = False


class LetterPredictor:
    """Main class for letter prediction system."""

    def __init__(self, config: ModelConfig):
        self.config = config
        self.data: Dict[str, np.ndarray] = {}
        self.mean_states: Dict[str, np.ndarray] = {}
        self.mean_positions: Dict[str, np.ndarray] = {}

    def generate_dataset(self) -> None:
        """Generate synthetic dataset for training."""
        base_dir = Path(self.config.data_dir)
        base_dir.mkdir(exist_ok=True)

        for letter in ascii_lowercase:
            letter_dir = base_dir / letter
            letter_dir.mkdir(exist_ok=True)

            self._generate_letter_samples(letter_dir)

    def _generate_letter_samples(self, letter_dir: Path) -> None:
        """Generate samples for a specific letter."""
        for k in range(self.config.n_samples_per_letter):
            file_path = letter_dir / f"sample_{k}.csv"

            with open(file_path, 'w', newline='') as f:
                writer = csv.writer(f)

                for _ in range(self.config.n_snapshots):
                    row = np.concatenate([
                        np.random.normal(450, 100, size=4).astype(
                            int).clip(100, 800),
                        np.random.uniform(100, 800, size=4).astype(int),
                        np.random.exponential(scale=200, size=3).astype(
                            int).clip(100, 800)
                    ])
                    writer.writerow(row)

    def load_data(self, base_dir: Optional[str] = None) -> None:
        """Load data from CSV files into memory."""
        if base_dir is None:
            base_dir = self.config.data_dir

        self.data = {letter: np.zeros((self.config.n_snapshots,
                                       self.config.n_samples_per_letter,
                                       self.config.n_variables))
                     for letter in ascii_lowercase}

        try:
            for letter in ascii_lowercase:
                for k in range(self.config.n_snapshots):
                    sample_path = Path(base_dir) / \
                        f"position_{k}" / f"{letter}.csv"
                    self.data[letter][k] = np.loadtxt(
                        sample_path, delimiter=',')
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Failed to load data: {e}")

    def compute_population_mean(self) -> Dict[str, np.ndarray]:
        """Compute mean population for each letter."""
        return {letter: np.mean(self.data[letter], axis=1)
                for letter in ascii_lowercase}

    def compute_mean_states(self) -> None:
        """Compute mean states for each letter."""
        population_mean = self.compute_population_mean()

        if not self.config.use_normal_law:
            self.mean_states = {letter: np.average(population_mean[letter], axis=0)
                                for letter in ascii_lowercase}
            return

        weights = self._compute_normal_law_weights(
            size=self.config.n_snapshots)

        self.mean_states = {letter: np.average(population_mean[letter],
                                               axis=0,
                                               weights=weights)
                            for letter in ascii_lowercase}

    def compute_mean_positions(self) -> None:
        """Compute mean positions for each letter."""
        if not self.config.use_normal_law:
            self.mean_positions = {letter: np.average(self.data[letter], axis=1)
                                   for letter in ascii_lowercase}
            return

        weights = self._compute_normal_law_weights(
            size=self.config.n_samples_per_letter)
        self.mean_positions = {letter: np.average(self.data[letter],
                                                  axis=1,
                                                  weights=weights)
                               for letter in ascii_lowercase}

    def _compute_normal_law_weights(self, size: int) -> None:
        x = np.linspace(self.config.normal_dist_range[0],
                        self.config.normal_dist_range[1],
                        size)
        weights = norm.pdf(x, loc=0, scale=1)
        weights /= np.sum(weights)
        return weights

    def save_results(self):
        result_dir = Path(self.config.result_dir)
        result_dir.mkdir(exist_ok=True)
        file_name = "mean_states__uniform_law.json"
        if self.config.use_normal_law:
            file_name = "mean_states__normal_law.json"

        with open(result_dir/file_name, mode="w") as file:
            states = dict()
            for letter in ascii_lowercase:
                states[letter] = self.mean_states[letter].tolist()
            file.write(json.dumps(states, indent=2))

        file_name = "mean_positions__uniform_law.json"
        if self.config.use_normal_law:
            file_name = "mean_positions__normal_law.json"

        with open(result_dir/file_name, mode="w") as file:
            positions = dict()
            for letter in ascii_lowercase:
                positions[letter] = self.mean_positions[letter].tolist()
            file.write(json.dumps(positions, indent=2))

    def predict_v1(self, input_data: np.ndarray) -> str:
        """
        Predict letter using mean states approach.

        Args:
            input_data: Input data array of shape (n_snapshots, n_variables) or (n_variables,)

        Returns:
            str: Predicted letter
        """
        if self.mean_states is None:
            raise ValueError(
                "Model not trained. Call compute_mean_states first.")

        # Ensure input is 2D array
        if input_data.ndim == 1:
            input_data = input_data.reshape(1, -1)

        # Calculate mean across snapshots if multiple snapshots provided
        mean_input = np.average(
            input_data, axis=0, weights=self._compute_normal_law_weights(self.config.n_snapshots))

        if mean_input.shape != next(iter(self.mean_states.values())).shape:
            raise ValueError(f"Input shape mismatch. Expected {next(iter(self.mean_states.values())).shape}, "
                             f"got {mean_input.shape}")

        distances = {letter: np.linalg.norm(mean_input - self.mean_states[letter])
                     for letter in ascii_lowercase}
        return min(distances, key=distances.get)

    def predict_v2(self, input_data: np.ndarray,
                   strategy: str = "vote") -> str:
        """
        Predict letter using mean positions approach.

        Args:
            input_data: Input data array of shape (n_snapshots, n_variables) or (n_variables,)
            strategy: Decision strategy ('vote' or 'mean_distance')

        Returns:
            str: Predicted letter
        """
        if self.mean_positions is None:
            raise ValueError(
                "Model not trained. Call compute_mean_positions first.")

        # Ensure input is 2D array
        if input_data.ndim == 1:
            input_data = input_data.reshape(1, -1)

        # Calculate distances for each position
        distances = np.array([
            [np.linalg.norm(input_data[pos] - self.mean_positions[letter][pos])
             for letter in ascii_lowercase]
            for pos in range(len(input_data))
        ])

        predictions = [ascii_lowercase[i]
                       for i in np.argmin(distances, axis=1)]

        if strategy == "vote":
            return max(predictions, key=predictions.count)
        elif strategy == "mean_distance":
            mean_distances = np.mean(distances, axis=0)
            return ascii_lowercase[np.argmin(mean_distances)]
        else:
            raise ValueError(f"Unknown decision strategy: {strategy}")

    def reorganize_data_by_position(self, source_dir: str = None, target_dir: str = None) -> None:
        """
        Reorganize data files by position instead of by letter.

        Args:
            source_dir: Directory containing the original data structure
            target_dir: Directory where reorganized data will be stored
        """
        source_dir = Path(source_dir or self.config.data_dir)
        target_dir = Path(target_dir or "data")

        try:
            # Create target directory structure
            target_dir.mkdir(exist_ok=True)
            position_dirs = [target_dir / f"position_{pos}"
                             for pos in range(self.config.n_snapshots)]

            for dir_path in position_dirs:
                dir_path.mkdir(exist_ok=True)

            # Process each position
            for pos in range(self.config.n_snapshots):
                self._process_position(pos, source_dir, target_dir)

        except OSError as e:
            raise OSError(f"Error reorganizing data: {e}")

    def _process_position(self, position: int, source_dir: Path, target_dir: Path) -> None:
        """
        Process data for a specific position across all letters.

        Args:
            position: The snapshot position to process
            source_dir: Source directory containing original data
            target_dir: Target directory for reorganized data
        """
        for letter in ascii_lowercase:
            letter_data = []
            letter_dir = source_dir / letter

            # Collect data for this position from all samples
            for sample_idx in range(self.config.n_samples_per_letter):
                sample_path = letter_dir / f"sample_{sample_idx}.csv"

                try:
                    with open(sample_path, 'r') as f:
                        reader = csv.reader(f)
                        for idx, row in enumerate(reader):
                            if idx == position:
                                letter_data.append(row)
                                break
                except FileNotFoundError:
                    print(f"Warning: Sample file not found: {sample_path}")
                    continue
                except csv.Error as e:
                    print(f"Warning: CSV error in file {sample_path}: {e}")
                    continue

            # Save collected data for this letter at this position
            if letter_data:
                output_path = target_dir / \
                    f"position_{position}" / f"{letter}.csv"
                try:
                    with open(output_path, 'w', newline='') as f:
                        writer = csv.writer(f)
                        writer.writerows(letter_data)
                except OSError as e:
                    print(f"Warning: Could not write to {output_path}: {e}")


def main():
    """Example usage of the LetterPredictor class with data reorganization."""
    # Initialize configuration
    config = ModelConfig()

    # Create predictor instance
    predictor = LetterPredictor(config)

    # Generate synthetic dataset
    predictor.generate_dataset()

    # Reorganize data by position
    predictor.reorganize_data_by_position()

    # Load reorganized data
    predictor.load_data("data")  # Load from reorganized directory

    # Compute mean states and positions
    predictor.compute_mean_states()
    predictor.compute_mean_positions()

    # Store predictors data
    predictor.save_results()

    # Example input data
    example_input = np.array([
        [467, 452, 493, 458, 771, 638, 408, 229, 100, 333, 201],
        [415, 498, 514, 559, 442, 605, 763, 576, 455, 443, 173],
        [563, 416, 443, 337, 756, 283, 508, 112, 100, 100, 223],
        [444, 321, 607, 334, 685, 576, 435, 647, 129, 278, 203],
        [513, 411, 437, 402, 360, 484, 259, 343, 519, 100, 100],
        [284, 591, 535, 456, 149, 176, 173, 378, 206, 290, 100],
        [414, 434, 485, 488, 523, 725, 308, 669, 211, 230, 100]
    ])

    # Make predictions
    prediction_v1 = predictor.predict_v1(example_input)
    prediction_v2 = predictor.predict_v2(example_input)

    print(f"Prediction V1: {prediction_v1}")
    print(f"Prediction V2: {prediction_v2}")


if __name__ == "__main__":
    main()
