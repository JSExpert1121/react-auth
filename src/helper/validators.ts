/**
 * validators
 * written by Darko at 2019/08/09
 */


export type ValidatorCallback = (msg: string) => void;
export type ValidateFunc = (txt: string) => Promise<boolean>;
export type VoidFunc = () => void;

// email address validator
export const isValidEmail: ValidateFunc = (txt) => new Promise(resolve => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    resolve(regex.test(txt));
});

// required validator
export const isRequired: ValidateFunc = txt => new Promise(resolve => {
    resolve(!!(txt && txt.length > 0));
});

export const isNumber: ValidateFunc = txt => new Promise(resolve => {
    const regex = /[^0-9]/;
    resolve(!regex.test(txt));
});

// minimum length validator
export const isValidLengthMin: (min: number) => ValidateFunc = min => txt => new Promise(resolve => {
    if (!txt || txt.length < min) resolve(false);
    resolve(true);
});

// maximum length validator
export const isValidLengthMax: (max: number) => ValidateFunc = max => txt => new Promise(resolve => {
    resolve(!(txt.length > max));
});

// character set validator(alphabet, numbers and special characters)
export const isValidChar: ValidateFunc = txt => new Promise(resolve => {
    const regex = /^[~`!@#$%^&*()_+=[\]\\{}|;':",./<>?a-zA-Z0-9-]+$/;
    resolve(regex.test(txt));
});

// matching validator
export const isPasswordMatched: (confirm: string) => ValidateFunc = confirm => txt => new Promise(resolve => {
    resolve((txt === confirm));
});
