
export const hasUppercaseLetter = (password) => {
    return /[A-Z]/.test(password);
};

export const hasNumber = (password) => {
    return /\d/.test(password);
};

export const hasSpecialCharacter = (password) => {
    return /[!@#$%^&*()_+{}[\]:;<>,.?~\\\-=/|]/.test(password);
};

export const hasMinimumLength = (password) => {
    return password.length <= 8;
};