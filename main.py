from typing import Dict, List, Literal, TypeAlias, Union, TypedDict
import numpy as np
from string import ascii_lowercase
from numpy.typing import NDArray

# Type Aliases
LetterStates: TypeAlias = Dict[str, NDArray[np.float64]]
Strategy = Literal["vote", "mean_distance"]
InputArray = NDArray[np.float64]

# Default configurations
DEFAULT_NORMAL_DIST_RANGE = (-3.0, 3.0)

class PredictionConfig(TypedDict):
    normal_dist_range: tuple[float, float]
    use_normal_law: bool

def compute_population_mean(data: Dict[str, NDArray[np.float64]]) -> LetterStates:
    """Compute mean population for each letter."""
    return {letter: np.mean(letter_data, axis=1) for letter, letter_data in data.items()}

def compute_mean_states(
    data: Dict[str, NDArray[np.float64]], 
    config: PredictionConfig = {"normal_dist_range": DEFAULT_NORMAL_DIST_RANGE, "use_normal_law": True}
) -> LetterStates:
    """Compute mean states for each letter."""
    population_mean = compute_population_mean(data)
    
    if not config["use_normal_law"]:
        return {letter: np.average(pop_mean, axis=0) for letter, pop_mean in population_mean.items()}
    
    x = np.linspace(config["normal_dist_range"][0], config["normal_dist_range"][1], 
                    population_mean[ascii_lowercase[0]].shape[0])
    weights = norm.pdf(x, loc=0, scale=1)
    weights /= np.sum(weights)
    
    return {letter: np.average(pop_mean, axis=0, weights=weights) 
            for letter, pop_mean in population_mean.items()}

def predict_v1(
    input_data: InputArray,
    mean_states: LetterStates
) -> str:
    """Predict letter using mean states approach."""
    mean_input = np.mean(input_data, axis=0) if input_data.ndim > 1 else input_data
    distances = {letter: np.linalg.norm(mean_input - state) 
                for letter, state in mean_states.items()}
    return min(distances, key=distances.get)

def predict_v2(
    input_data: InputArray,
    mean_positions: LetterStates,
    strategy: Strategy = "vote"
) -> str:
    """Predict letter using mean positions approach."""
    if input_data.ndim == 1:
        input_data = input_data.reshape(1, -1)
        
    distances = np.array([[np.linalg.norm(input_data[pos] - mean_positions[letter][pos])
                          for letter in ascii_lowercase]
                         for pos in range(len(input_data))])
    
    if strategy == "vote":
        predictions = [ascii_lowercase[i] for i in np.argmin(distances, axis=1)]
        return max(predictions, key=predictions.count)
    
    mean_distances = np.mean(distances, axis=0)
    return ascii_lowercase[np.argmin(mean_distances)]