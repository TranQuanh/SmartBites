import os
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib

MODEL_PATH = 'knn_recipe_model.joblib'
CSV_PATH = 'output.csv'

def train_and_save_knn_model(csv_path=CSV_PATH, model_path=MODEL_PATH):
    # Load data
    df = pd.read_csv(csv_path)

    # Prepare numerical features
    scaler = StandardScaler()
    X_numerical = scaler.fit_transform(df[['calories', 'fat', 'carbohydrates', 'protein', 'cholesterol', 'sodium', 'fiber']])

    # Prepare ingredient features
    # Convert string list to plain text
    def ingredients_to_text(ingredients):
        # Handles both list-string and plain string
        if isinstance(ingredients, str) and ingredients.startswith('['):
            try:
                import ast
                return ', '.join(ast.literal_eval(ingredients))
            except Exception:
                return ingredients
        return ingredients

    ingredients_text = df['ingredients'].apply(ingredients_to_text)
    vectorizer = TfidfVectorizer()
    X_ingredients = vectorizer.fit_transform(ingredients_text)

    # Combine features
    X_combined = np.hstack([X_numerical, X_ingredients.toarray()])

    # Train KNN
    knn = NearestNeighbors(n_neighbors=3, metric='euclidean')
    knn.fit(X_combined)

    # Save model and objects
    joblib.dump({
        'scaler': scaler,
        'vectorizer': vectorizer,
        'knn': knn,
        'df': df
    }, model_path)
    print(f"Model saved to {model_path}")

def load_knn_model(model_path=MODEL_PATH):
    return joblib.load(model_path)

def recommend_recipes(input_features, model_path=MODEL_PATH):
    if not os.path.exists(model_path):
        train_and_save_knn_model()
    model = load_knn_model(model_path)
    scaler = model['scaler']
    vectorizer = model['vectorizer']
    knn = model['knn']
    df = model['df']
    input_features_scaled = scaler.transform([input_features[:7]])
    input_ingredients_transformed = vectorizer.transform([input_features[7]])
    input_combined = np.hstack([input_features_scaled, input_ingredients_transformed.toarray()])
    distances, indices = knn.kneighbors(input_combined)
    recommendations = df.iloc[indices[0]]
    return recommendations[['recipe_id', 'recipe_name', 'ingredients']]

# Example usage:
input_features = [15, 36, 1, 42, 21, 81, 2, 'pork belly, smoked paprika, kosher salt']
print(recommend_recipes(input_features))
