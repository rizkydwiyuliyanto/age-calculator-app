// https://stackoverflow.com/questions/12251325/javascript-date-to-calculate-age-work-by-the-day-months-years
const getAge = (year, month, date) => {
    var daysInMonth = 30.436875; // Days in a month on average.
    var dob = new Date();
    dob.setFullYear(year);
    dob.setMonth(month),
        dob.setDate(date);
    var aad = new Date();
    var yearAad = aad.getFullYear();
    var yearDob = dob.getFullYear();
    var years = yearAad - yearDob; // Get age in years.
    dob.setFullYear(yearAad); // Set birthday for this year.
    var aadMillis = aad.getTime();
    var dobMillis = dob.getTime();
    if (aadMillis < dobMillis) {
        --years;
        dob.setFullYear(yearAad - 1); // Set to previous year's birthday
        dobMillis = dob.getTime();
    }
    var days = (aadMillis - dobMillis) / 86400000;
    var monthsDec = days / daysInMonth; // Months with remainder.
    var months = Math.floor(monthsDec); // Remove fraction from month.
    days = Math.floor(daysInMonth * (monthsDec - months));
    return {
        years: years,
        months: months,
        days: days
    }
}

const years = document.getElementById("years")
const months = document.getElementById("months")
const days = document.getElementById("days")
const input_years = document.getElementById("inputYears")
const input_months = document.getElementById("inputMonths")
const input_days = document.getElementById("inputDays");

var error = {
    days: true,
    month: true,
    years: true
}
var emptyInput = {
    days: true,
    month: true,
    years: true
}
var monthIsValid = true;
const lightRed = "#ff5757"
const lightGrey = "#dbdbdb";
const smokeGrey = "#716f6f";
const setMessageEmpty = (value, label, message, prop, input) => {
    if (!value) {
        message.innerText = "The field is required"
        label.style.color = "#ff5757";
        input.style.border = "1px solid " + lightRed
        emptyInput = {
            ...emptyInput,
            [prop]: true
        }
    } else {
        message.innerText = ""
        label.style.color = "#716f6f";
        input.style.border = "1px solid " + lightGrey
        emptyInput = {
            ...emptyInput,
            [prop]: false
        }
    }
}
const daysInMonth = (month, year) => {
    return new Date(parseInt(year), parseInt(month), 0).getDate();
}
const setAge = () => {
    console.log(error)
    console.log(emptyInput)
    if (!Object.keys(error).find(prop => { return error[prop] })) {
        const inputs = document.querySelectorAll('.input');
        const labels = document.querySelectorAll('.label');
        var d = daysInMonth(input_months.value, input_years.value);
        let yearsValue = parseInt(input_years.value)
        let monthsValue = parseInt(input_months.value) - 1
        let daysValue = parseInt(input_days.value)
        const age = getAge(yearsValue, monthsValue, daysValue);
        let date = new Date(yearsValue, monthsValue, daysValue);
        console.log(date)
        let isDateValid = false
        let past = false
        if (date.getTime() > new Date().getTime()) {
            past = true;
            document.getElementById("error-year-message").innerText = "Must be in the past"
            inputs.forEach((elem, idx) => {
                // elem.style.display = "none"
                labels[idx].style.color = lightRed
                elem.style.border = "1px solid " + lightRed
            })
        } else {
            document.getElementById("error-year-message").innerText = ""
            inputs.forEach((elem, idx) => {
                labels[idx].style.color = smokeGrey
                elem.style.border = "1px solid " + lightGrey
            })
            if (daysValue > d) {
                document.getElementById("error-days-message").innerText = "Must be a valid date";
                inputs.forEach((elem, idx) => {
                    labels[idx].style.color = lightRed
                    elem.style.border = "1px solid " + lightRed
                })
                isDateValid = false
            } else {
                document.getElementById("error-days-message").innerText = "";
                inputs.forEach((elem, idx) => {
                    labels[idx].style.color = smokeGrey
                    elem.style.border = "1px solid " + lightGrey
                })
                isDateValid = true
            }
        }
        if (isDateValid && !past) {
            years.innerText = age.years;
            months.innerText = age.months;
            days.innerText = age.days;
        }
    }
}

const setValidMonth = () => {
    if (!emptyInput.month) {
        if (input_months.value > 12) {
            document.getElementById("error-months-label").style.color = "#ff5757"
            document.getElementById("error-months-message").innerText = "Must be a valid month";
            document.getElementById("inputMonths").style.border = "1px solid " + lightRed

            error = {
                ...error,
                month: true
            }
            monthIsValid = false
        } else {
            document.getElementById("error-months-label").style.color = smokeGrey
            document.getElementById("error-months-message").innerText = "";
            document.getElementById("inputMonths").style.border = "1px solid " + lightGrey

            error = {
                ...error,
                month: false
            }
            monthIsValid = true;
        }
    }
}

const setValidDay = () => {
    let text = ""
    let color = "#716f6f"
    let borderColor = "#dbdbdb"
    if (!emptyInput.month && !emptyInput.years) {
        if (!emptyInput.days) {
            if (monthIsValid) {
                color = "#ff5757"
                text = "Must be a valid days"
                borderColor = lightRed
            }
            if (input_days.value > 31) {
                document.getElementById("error-days-label").style.color = color
                document.getElementById("error-days-message").innerText = text
                document.getElementById("inputDays").style.border = "1px solid " + borderColor
                error = {
                    ...error,
                    days: true
                }
            } else {
                document.getElementById("error-days-label").style.color = smokeGrey
                document.getElementById("error-days-message").innerText = "";
                document.getElementById("inputDays").style.border = "1px solid " + lightGrey
                error = {
                    ...error,
                    days: false
                }
            }
        }
    }
}

const setValidYear = () => {
    if (!emptyInput.years) {
        error = {
            ...error,
            years: false
        }
    } else {
        error = {
            ...error,
            years: true
        }
    }
}

input_days.onblur = (e) => {
    const errorMessage = document.getElementById("error-days-message")
    const errorLabel = document.getElementById("error-days-label")
    setMessageEmpty(e.target.value, errorLabel, errorMessage, 'days', input_days);
    setValidMonth();
    setValidDay()
    setAge()
}
input_months.onblur = (e) => {
    const errorMessage = document.getElementById("error-months-message")
    const errorLabel = document.getElementById("error-months-label")
    setMessageEmpty(e.target.value, errorLabel, errorMessage, 'month', input_months)
    setValidMonth();
    setValidDay()
    setAge()
}
input_years.onblur = (e) => {
    const errorMessage = document.getElementById("error-year-message")
    const errorLabel = document.getElementById("error-year-label")
    setMessageEmpty(e.target.value, errorLabel, errorMessage, 'years', input_years);
    setValidYear()
    setValidMonth()
    setValidDay()
    setAge()
}

