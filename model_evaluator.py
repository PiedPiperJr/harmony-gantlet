import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, List, Tuple
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, cohen_kappa_score,
    balanced_accuracy_score, matthews_corrcoef
)
import matplotlib.pyplot as plt
import seaborn as sns
from string import ascii_lowercase
from collections import defaultdict
import json
from datetime import datetime

class ModelEvaluator:
    """Comprehensive evaluation system for letter prediction models."""
    
    def __init__(self, predictor, data_dir: str = "data"):
        """
        Initialize the evaluator.
        
        Args:
            predictor: Instance of LetterPredictor class
            data_dir: Directory containing the training data
        """
        self.predictor = predictor
        self.data_dir = Path(data_dir)
        self.results: Dict = {}
        self.confusion_matrices: Dict = {}
        
    def load_test_data(self) -> Tuple[List[np.ndarray], List[str]]:
        """
        Load test data from the data directory.
        
        Returns:
            Tuple of (X_test, y_test) where X_test is list of input arrays
            and y_test is list of true labels
        """
        X_test = []
        y_test = []
        
        try:
            for letter in ascii_lowercase:
                # Initialize array for all positions of current letter
                letter_data = np.zeros((self.predictor.config.n_snapshots, 
                                     self.predictor.config.n_variables))
                
                # Load data from each position
                for pos in range(self.predictor.config.n_snapshots):
                    file_path = self.data_dir / f"position_{pos}" / f"{letter}.csv"
                    with open(file_path, 'r') as f:
                        data = np.loadtxt(f, delimiter=',')
                        if data.ndim == 1:
                            letter_data[pos] = data
                        else:
                            letter_data[pos] = data[0]  # Take first row if multiple rows
                
                X_test.append(letter_data)
                y_test.append(letter)
                        
            return X_test, y_test
            
        except Exception as e:
            raise Exception(f"Error loading test data: {e}")

    def evaluate_models(self) -> Dict:
        """
        Evaluate both prediction models using multiple metrics.
        
        Returns:
            Dictionary containing evaluation results
        """
        X_test, y_test = self.load_test_data()
        
        # Evaluate both models
        models = {
            'v1': self.predictor.predict_v1,
            'v2': self.predictor.predict_v2
        }
        
        self.results = {}
        for model_name, model_func in models.items():
            try:
                y_pred = [model_func(x) for x in X_test]
                self.results[model_name] = self._compute_metrics(y_test, y_pred)
                self.confusion_matrices[model_name] = confusion_matrix(
                    y_test, y_pred, labels=list(ascii_lowercase)
                )
            except Exception as e:
                print(f"Error evaluating model {model_name}: {e}")
                continue
            
        return self.results
    
    def _compute_metrics(self, y_true: List, y_pred: List) -> Dict:
        """
        Compute comprehensive set of evaluation metrics.
        
        Args:
            y_true: List of true labels
            y_pred: List of predicted labels
            
        Returns:
            Dictionary containing all computed metrics
        """
        metrics = {
            'accuracy': accuracy_score(y_true, y_pred),
            'balanced_accuracy': balanced_accuracy_score(y_true, y_pred),
            'macro_precision': precision_score(y_true, y_pred, average='macro'),
            'macro_recall': recall_score(y_true, y_pred, average='macro'),
            'macro_f1': f1_score(y_true, y_pred, average='macro'),
            'weighted_precision': precision_score(y_true, y_pred, average='weighted'),
            'weighted_recall': recall_score(y_true, y_pred, average='weighted'),
            'weighted_f1': f1_score(y_true, y_pred, average='weighted'),
            'cohen_kappa': cohen_kappa_score(y_true, y_pred),
            'matthews_corr': matthews_corrcoef(y_true, y_pred),
        }
        
        # Per-class metrics
        class_report = classification_report(y_true, y_pred, output_dict=True)
        per_class_metrics = {}
        
        for letter in ascii_lowercase:
            if letter in class_report:
                per_class_metrics[letter] = {
                    'precision': class_report[letter]['precision'],
                    'recall': class_report[letter]['recall'],
                    'f1-score': class_report[letter]['f1-score'],
                    'support': class_report[letter]['support']
                }
        
        metrics['per_class'] = per_class_metrics
        return metrics

    def plot_confusion_matrices(self, save_dir: str = "evaluation_results"):
        """Plot and save confusion matrices for both models."""
        save_path = Path(save_dir)
        save_path.mkdir(exist_ok=True)
        
        plt.figure(figsize=(20, 10))
        
        for idx, (model_name, cm) in enumerate(self.confusion_matrices.items()):
            plt.subplot(1, 2, idx + 1)
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                       xticklabels=list(ascii_lowercase),
                       yticklabels=list(ascii_lowercase))
            plt.title(f'Confusion Matrix - Model {model_name}')
            plt.xlabel('Predicted')
            plt.ylabel('True')
        
        plt.tight_layout()
        plt.savefig(save_path / 'confusion_matrices.png')
        plt.close()

    def generate_report(self, save_dir: str = "evaluation_results") -> None:
        """
        Generate and save comprehensive evaluation report.
        
        Args:
            save_dir: Directory to save the report
        """
        save_path = Path(save_dir)
        save_path.mkdir(exist_ok=True)
        
        report = {
            'evaluation_timestamp': datetime.now().isoformat(),
            'results': self.results,
            'summary': self._generate_summary()
        }
        
        # Save detailed JSON report
        with open(save_path / 'evaluation_report.json', 'w') as f:
            json.dump(report, f, indent=4)
        
        # Save human-readable summary
        with open(save_path / 'evaluation_summary.txt', 'w') as f:
            f.write(self._generate_readable_summary(report))
            
        # Generate plots
        self.plot_confusion_matrices(save_dir)
        self._plot_performance_comparison(save_dir)

    def _generate_summary(self) -> Dict:
        """Generate summary statistics comparing both models."""
        summary = {
            'model_comparison': {
                metric: {
                    'v1': self.results['v1'][metric],
                    'v2': self.results['v2'][metric],
                    'difference': self.results['v2'][metric] - self.results['v1'][metric]
                }
                for metric in ['accuracy', 'balanced_accuracy', 'macro_f1', 'cohen_kappa']
            },
            'best_performing_model': {
                'accuracy': 'v2' if self.results['v2']['accuracy'] > self.results['v1']['accuracy'] else 'v1',
                'macro_f1': 'v2' if self.results['v2']['macro_f1'] > self.results['v1']['macro_f1'] else 'v1'
            }
        }
        return summary

    def _generate_readable_summary(self, report: Dict) -> str:
        """Generate human-readable summary of evaluation results."""
        summary = [
            "Letter Prediction Models Evaluation Summary",
            "=" * 50,
            f"\nEvaluation performed at: {report['evaluation_timestamp']}\n",
            "\nModel Comparison:",
            "-" * 20
        ]
        
        metrics = report['summary']['model_comparison']
        for metric, values in metrics.items():
            summary.append(f"\n{metric}:")
            summary.append(f"  Model V1: {values['v1']:.4f}")
            summary.append(f"  Model V2: {values['v2']:.4f}")
            summary.append(f"  Difference (V2 - V1): {values['difference']:.4f}")
        
        summary.append("\nBest Performing Model:")
        summary.append("-" * 20)
        for metric, model in report['summary']['best_performing_model'].items():
            summary.append(f"\n{metric}: Model {model}")
            
        return "\n".join(summary)

    def _plot_performance_comparison(self, save_dir: str) -> None:
        """Generate and save performance comparison plots."""
        save_path = Path(save_dir)
        
        # Prepare data for plotting
        metrics = ['accuracy', 'macro_precision', 'macro_recall', 'macro_f1']
        v1_scores = [self.results['v1'][m] for m in metrics]
        v2_scores = [self.results['v2'][m] for m in metrics]
        
        # Create bar plot
        plt.figure(figsize=(12, 6))
        x = np.arange(len(metrics))
        width = 0.35
        
        plt.bar(x - width/2, v1_scores, width, label='Model V1')
        plt.bar(x + width/2, v2_scores, width, label='Model V2')
        
        plt.xlabel('Metrics')
        plt.ylabel('Score')
        plt.title('Model Performance Comparison')
        plt.xticks(x, metrics)
        plt.legend()
        
        plt.tight_layout()
        plt.savefig(save_path / 'performance_comparison.png')
        plt.close()

def main():
    """Example usage of the ModelEvaluator class with proper data preparation."""
    from letter_predictor import LetterPredictor, ModelConfig
    
    # Initialize predictor
    config = ModelConfig()
    predictor = LetterPredictor(config)
    
    # 1. First generate the initial dataset
    print("Generating initial dataset...")
    predictor.generate_dataset()
    
    # 2. Then reorganize the data
    print("Reorganizing data by position...")
    predictor.reorganize_data_by_position(
        source_dir="data_generated",  # Original data directory
        target_dir="data"            # Reorganized data directory
    )
    
    # 3. Now load the reorganized data
    print("Loading reorganized data...")
    predictor.load_data("data")  # Load from the reorganized directory
    
    # 4. Compute necessary model parameters
    print("Computing model parameters...")
    predictor.compute_mean_states()
    predictor.compute_mean_positions()
    
    # 5. Initialize and run evaluator
    print("Running evaluation...")
    evaluator = ModelEvaluator(predictor)
    results = evaluator.evaluate_models()
    evaluator.generate_report()
    
    print("Evaluation complete! Check the 'evaluation_results' directory for reports.")

if __name__ == "__main__":
    main()