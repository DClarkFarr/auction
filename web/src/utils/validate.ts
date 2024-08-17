export const validateEmail = (email: string) => {
    return !!email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePassword = (pw: string) => {
    return {
        hasNumber: !!pw.match(/\d/),
        hasLowerCase: !!pw.match(/[a-z]/),
        hasUpperCase: !!pw.match(/[A-Z]/),
        hasSpecialChar: !!pw.match(/[^A-Za-z0-9]/),
        isOver8Char: pw.length >= 8,
    };
};
