import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pickle
import json
import warnings

warnings.filterwarnings("ignore")


# Load Dataset
df = pd.read_csv("../data/loan_default_dataset.csv")


# Convert Categorical Values
gender_map = {'Male': 0, 'Female': 1}

employment_map = {
    'Unemployed': 0,
    'Self-employed': 1,
    'Part-time': 2,
    'Full-time': 3
}

marital_map = {
    'Single': 0,
    'Married': 1,
    'Divorced': 2,
    'Widowed': 3
}

defaulted_map = {
    'No': 0,
    'Yes': 1
}


df['GenderNumeric'] = df['Gender'].map(gender_map)

df['EmploymentNumeric'] = df['EmploymentStatus'].map(employment_map)

df['MaritalNumeric'] = df['MaritalStatus'].map(marital_map)

df['DefaultedNumeric'] = df['Defaulted'].map(defaulted_map)


# Features
X = df[
    [
        'GenderNumeric',
        'Age',
        'Income',
        'LoanAmount',
        'LoanTerm',
        'CreditScore',
        'EmploymentNumeric',
        'MaritalNumeric',
        'PreviousDefaults'
    ]
]


# Target
y = df['DefaultedNumeric']


# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Model
dtc_model = DecisionTreeClassifier(
    random_state=42
)


# Train
dtc_model.fit(X_train, y_train)


# Predictions
y_pred = dtc_model.predict(X_test)


# Metrics
metrics = {
    "accuracy": round(accuracy_score(y_test, y_pred) * 100, 2),
    "precision": round(precision_score(y_test, y_pred) * 100, 2),
    "recall": round(recall_score(y_test, y_pred) * 100, 2),
    "f1_score": round(f1_score(y_test, y_pred) * 100, 2)
}


print(metrics)


# Save Model
with open("trained_model.pkl", "wb") as fh:
    pickle.dump(dtc_model, fh)


# Save Metrics
with open("metrics.json", "w") as file:
    json.dump(metrics, file)