from flask import Flask, render_template, request
import pickle
import json


model = pickle.load(open('models/trained_model.pkl', 'rb'))

with open('models/metrics.json') as file:
    metrics = json.load(file)

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def LoanGuardView():
    if request.method == "GET":
        return render_template("index.html")

    elif request.method == "POST":
        gender = int(request.form["gender"])
        age = int(request.form["age"])
        income = int(request.form["income"])
        loan_amt = int(request.form["loan_amt"])
        loan_term = int(request.form["loan_term"])
        credit = int(request.form["credit"])
        emp_status = int(request.form["emp_status"])
        marital = int(request.form["marital"])
        prev_defaults = int(request.form["prev_defaults"])

        op_arr = model.predict([[gender, age, income, loan_amt, loan_term, credit, emp_status, marital, prev_defaults]])
        op = op_arr[0]

        if op == 0:
            default_status = "Defaulted : No"

            risk_message = (
                "🟢 Low Repayment Risk - The Customer is less likely "
                "to have difficulty repaying the loan."
            )

            risk_class = "low-risk"

            reasons = [
                "Moderate or strong credit score supports a lower repayment risk.",
                "No previous defaults indicate a positive repayment history.",
                "The loan amount appears manageable relative to the customer's income."
            ]

        elif op == 1:
            default_status = "Defaulted : Yes"

            risk_message = (
                "🔴 High Repayment Risk - The customer may have difficulty "
                "repaying the loan."
            )

            risk_class = "high-risk"

            reasons = [
                "Low credit score may indicate a higher repayment risk.",
                "Previous loan defaults may indicate a history of repayment difficulties.",
                "The loan amount is relatively high compared with the customer's income."
            ]

        return render_template(
            "result.html",
            default_status=default_status,
            risk_message=risk_message,
            risk_class=risk_class,
            reasons=reasons
        )


@app.route("/about")
def about():
    return render_template("about.html", metrics=metrics)


@app.route("/how-it-works")
def how_it_works():
    return render_template("how_it_works.html")



if __name__ == "__main__":
    app.run(debug=True)