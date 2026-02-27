import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
from xgboost import XGBClassifier
import joblib

# Load dataset
df = pd.read_csv("farmers_dataset.csv")

# Drop ID
df = df.drop("farmer_id", axis=1)

# Encode categorical
df = pd.get_dummies(df, columns=["irrigation_type", "crop_type"], drop_first=True)

# Split
X = df.drop("past_default", axis=1)
y = df["past_default"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = XGBClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.05,
    eval_metric="logloss",
    random_state=42
)

model.fit(X_train, y_train)

# Evaluation
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, y_prob))
print(classification_report(y_test, y_pred))

# Save model
joblib.dump(model, "credit_model.pkl")

print("Model saved as credit_model.pkl")