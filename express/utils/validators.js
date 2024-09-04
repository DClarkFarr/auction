import moment from "moment";

export const isDate = (val) => moment(val).isValid();

export const validatePasswordCriteria = (pw) => {
    return {
        hasNumber: !!pw.match(/\d/),
        hasLowerCase: !!pw.match(/[a-z]/),
        hasUpperCase: !!pw.match(/[A-Z]/),
        hasSpecialChar: !!pw.match(/[^A-Za-z0-9]/),
        isOver8Char: pw.length >= 8,
    };
};

export const validatePassword = (pw) => {
    const criteria = validatePasswordCriteria(pw);

    return Object.values(criteria).every(Boolean);
};
