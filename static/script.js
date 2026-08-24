/* =========================================================
   LOANGUARD THEME CONTROLLER
   ========================================================= */

(function () {

    const html = document.documentElement;

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    const themeLabel =
        document.getElementById("themeLabel");


    function updateThemeUI(theme) {

        if (!themeIcon || !themeLabel) {
            return;
        }

        if (theme === "dark") {

            themeIcon.textContent = "☀";
            themeLabel.textContent = "Light";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to light mode"
            );

        } else {

            themeIcon.textContent = "☾";
            themeLabel.textContent = "Dark";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to dark mode"
            );
        }
    }


    function applyTheme(theme) {

        html.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem(
            "loanguard-theme",
            theme
        );

        updateThemeUI(theme);
    }


    function getInitialTheme() {

        const savedTheme =
            localStorage.getItem(
                "loanguard-theme"
            );

        if (
            savedTheme === "dark" ||
            savedTheme === "light"
        ) {
            return savedTheme;
        }

        if (
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {
            return "dark";
        }

        return "light";
    }


    applyTheme(getInitialTheme());


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            function () {

                const currentTheme =
                    html.getAttribute(
                        "data-theme"
                    );

                const newTheme =
                    currentTheme === "dark"
                        ? "light"
                        : "dark";

                applyTheme(newTheme);
            }
        );
    }


    /* =====================================================
       FORM VALIDATION
       ===================================================== */

    const form =
        document.getElementById(
            "predictionForm"
        );


    if (!form) {
        return;
    }


    const age =
        document.getElementById("age");

    const income =
        document.getElementById("income");

    const loanAmount =
        document.getElementById("loan_amt");

    const loanTerm =
        document.getElementById("loan_term");

    const credit =
        document.getElementById("credit");

    const previousDefaults =
        document.getElementById("prev_defaults");


    const gender =
        document.getElementById("gender");

    const employment =
        document.getElementById("emp_status");

    const marital =
        document.getElementById("marital");


    /* =====================================================
       ERROR HANDLING
       ===================================================== */

    function setError(input, errorId, message) {

        input.classList.add("input-invalid");

        const errorElement =
            document.getElementById(errorId);

        if (errorElement) {
            errorElement.textContent = message;
        }
    }


    function clearError(input, errorId) {

        input.classList.remove("input-invalid");

        const errorElement =
            document.getElementById(errorId);

        if (errorElement) {
            errorElement.textContent = "";
        }
    }


    function clearAllErrors() {

        document
            .querySelectorAll(".input-error")
            .forEach(function (element) {

                element.textContent = "";

            });


        document
            .querySelectorAll(
                ".input-invalid"
            )
            .forEach(function (element) {

                element.classList.remove(
                    "input-invalid"
                );

            });
    }


    /* =====================================================
       POSITIVE INTEGER VALIDATION
       ===================================================== */

    function isPositiveInteger(value) {

        return /^\d+$/.test(value) &&
               Number(value) > 0;
    }


    function isNonNegativeInteger(value) {

        return /^\d+$/.test(value) &&
               Number(value) >= 0;
    }


    /* =====================================================
       INDIAN CURRENCY FORMATTING
       ===================================================== */

    function formatIndianCurrency(value) {

        let digits =
            value.replace(/\D/g, "");

        if (!digits) {
            return "";
        }


        digits =
            digits.replace(/^0+(?=\d)/, "");


        if (digits.length <= 3) {
            return digits;
        }


        const lastThree =
            digits.slice(-3);

        const remaining =
            digits.slice(0, -3);

        const formattedRemaining =
            remaining.replace(
                /\B(?=(\d{2})+(?!\d))/g,
                ","
            );

        return formattedRemaining +
               "," +
               lastThree;
    }


    function removeCommas(value) {

        return value.replace(
            /,/g,
            ""
        );
    }


    function setupCurrencyInput(input) {

        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            function () {

                const cursorPosition =
                    input.selectionStart;

                const oldValue =
                    input.value;

                const digitsBeforeCursor =
                    oldValue
                        .slice(0, cursorPosition)
                        .replace(/\D/g, "")
                        .length;


                const formatted =
                    formatIndianCurrency(
                        oldValue
                    );


                input.value = formatted;


                let newCursorPosition = 0;

                let digitCount = 0;


                for (
                    let i = 0;
                    i < formatted.length;
                    i++
                ) {

                    if (
                        /\d/.test(
                            formatted[i]
                        )
                    ) {

                        digitCount++;

                    }

                    newCursorPosition++;


                    if (
                        digitCount >=
                        digitsBeforeCursor
                    ) {
                        break;
                    }
                }


                input.setSelectionRange(
                    newCursorPosition,
                    newCursorPosition
                );

            }
        );


        input.addEventListener(
            "blur",
            function () {

                input.value =
                    formatIndianCurrency(
                        input.value
                    );

            }
        );
    }


    setupCurrencyInput(income);

    setupCurrencyInput(loanAmount);


    /* =====================================================
       VALIDATE FORM
       ===================================================== */

    form.addEventListener(
        "submit",
        function (event) {

            clearAllErrors();


            let isValid = true;

            let firstInvalidInput = null;


            /* -----------------------------
               Gender
               ----------------------------- */

            if (!gender.value) {

                setError(
                    gender,
                    "genderError",
                    "Please select a gender."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    gender;
            }


            /* -----------------------------
               Age
               ----------------------------- */

            if (
                !isPositiveInteger(
                    age.value
                )
            ) {

                setError(
                    age,
                    "ageError",
                    "Age must be a positive whole number."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    age;
            }


            /* -----------------------------
               Income
               ----------------------------- */

            const incomeValue =
                removeCommas(
                    income.value
                );


            if (
                !isPositiveInteger(
                    incomeValue
                )
            ) {

                setError(
                    income,
                    "incomeError",
                    "Annual income must be a positive whole number."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    income;
            }


            /* -----------------------------
               Employment Status
               ----------------------------- */

            if (!employment.value) {

                setError(
                    employment,
                    "empStatusError",
                    "Please select employment status."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    employment;
            }


            /* -----------------------------
               Marital Status
               ----------------------------- */

            if (!marital.value) {

                setError(
                    marital,
                    "maritalError",
                    "Please select marital status."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    marital;
            }


            /* -----------------------------
               Loan Amount
               ----------------------------- */

            const loanAmountValue =
                removeCommas(
                    loanAmount.value
                );


            if (
                !isPositiveInteger(
                    loanAmountValue
                )
            ) {

                setError(
                    loanAmount,
                    "loanAmtError",
                    "Loan amount must be a positive whole number."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    loanAmount;
            }


            /* -----------------------------
               Loan Term
               ----------------------------- */

            if (
                !isPositiveInteger(
                    loanTerm.value
                )
            ) {

                setError(
                    loanTerm,
                    "loanTermError",
                    "Loan term must be a positive whole number."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    loanTerm;
            }


            /* -----------------------------
               Credit Score
               ----------------------------- */

            const creditValue =
                Number(
                    credit.value
                );


            if (
                !Number.isInteger(
                    creditValue
                ) ||
                creditValue < 300 ||
                creditValue > 900
            ) {

                setError(
                    credit,
                    "creditError",
                    "Credit score must be between 300 and 900."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    credit;
            }


            /* -----------------------------
               Previous Defaults
               ----------------------------- */

            if (
                !isNonNegativeInteger(
                    previousDefaults.value
                )
            ) {

                setError(
                    previousDefaults,
                    "prevDefaultsError",
                    "Previous defaults must be zero or a positive whole number."
                );

                isValid = false;

                firstInvalidInput =
                    firstInvalidInput ||
                    previousDefaults;
            }


            /* =================================================
               STOP FORM SUBMISSION
               ================================================= */

            if (!isValid) {

                event.preventDefault();


                if (firstInvalidInput) {

                    firstInvalidInput.focus();

                    firstInvalidInput.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

                return;
            }


            /* =================================================
               REMOVE CURRENCY COMMAS BEFORE FLASK RECEIVES DATA
               ================================================= */

            income.value =
                removeCommas(
                    income.value
                );

            loanAmount.value =
                removeCommas(
                    loanAmount.value
                );


            /* =================================================
               SUBMITTING STATE
               ================================================= */

            const submitButton =
                form.querySelector(
                    ".submit-btn"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.style.opacity =
                    "0.75";

                submitButton.style.cursor =
                    "wait";

                submitButton.innerHTML =
                    'Analyzing Loan Risk <span>...</span>';
            }

        }
    );


    /* =====================================================
       CLEAR ERROR WHEN USER CORRECTS INPUT
       ===================================================== */

    age.addEventListener(
        "input",
        function () {

            if (
                isPositiveInteger(
                    age.value
                )
            ) {

                clearError(
                    age,
                    "ageError"
                );

            }
        }
    );


    income.addEventListener(
        "input",
        function () {

            if (
                isPositiveInteger(
                    removeCommas(
                        income.value
                    )
                )
            ) {

                clearError(
                    income,
                    "incomeError"
                );

            }
        }
    );


    loanAmount.addEventListener(
        "input",
        function () {

            if (
                isPositiveInteger(
                    removeCommas(
                        loanAmount.value
                    )
                )
            ) {

                clearError(
                    loanAmount,
                    "loanAmtError"
                );

            }
        }
    );


    loanTerm.addEventListener(
        "input",
        function () {

            if (
                isPositiveInteger(
                    loanTerm.value
                )
            ) {

                clearError(
                    loanTerm,
                    "loanTermError"
                );

            }
        }
    );


    previousDefaults.addEventListener(
        "input",
        function () {

            if (
                isNonNegativeInteger(
                    previousDefaults.value
                )
            ) {

                clearError(
                    previousDefaults,
                    "prevDefaultsError"
                );

            }
        }
    );


    credit.addEventListener(
        "input",
        function () {

            const value =
                Number(credit.value);


            if (
                Number.isInteger(value) &&
                value >= 300 &&
                value <= 900
            ) {

                clearError(
                    credit,
                    "creditError"
                );

            }

        }
    );


    gender.addEventListener(
        "change",
        function () {

            if (gender.value) {

                clearError(
                    gender,
                    "genderError"
                );

            }
        }
    );


    employment.addEventListener(
        "change",
        function () {

            if (employment.value) {

                clearError(
                    employment,
                    "empStatusError"
                );

            }
        }
    );


    marital.addEventListener(
        "change",
        function () {

            if (marital.value) {

                clearError(
                    marital,
                    "maritalError"
                );

            }
        }
    );

})();