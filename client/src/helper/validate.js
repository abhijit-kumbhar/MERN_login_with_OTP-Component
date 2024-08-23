import toast from 'react-hot-toast'
import { authenticate } from './helper';

const specialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const newemail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** validate login page */
export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);
    if(values.username){
        const {status} = await authenticate(values.username)

        if(status !== 200){
            errors.exist = toast.error('User does not exist...!')
        }
    }
    return errors;
}

/*validate profile page */
export async function profilevalidate(values){
    const errors = emailVerify({}, values);
    return errors;
}

/*validate register page */
export async function registerValidation(values) {
    const errors = usernameVerify({}, values);
    emailVerify(errors, values)
    passwordVerify(errors, values)
    return errors;
}

/*validate reset password */
export async function resetPasswordValidation(values) {
    const errors = passwordVerify({}, values)

    if (values.password !== values.confirmpassword) {
        errors.exist = toast.error("Password not Match...!")
    }
    return errors
}

/*validate passowrd page */
export async function passwordValidate(values) {
    const errors = passwordVerify({}, values)
    return errors;
}

/*validate password */
function passwordVerify(error = {}, values) {
    if (!values.password) {
        error.password = toast.error("Enter Password...!")
    } else if (values.password.includes(" ")) {
        error.password = toast.error("Wrong Password...!")
    } else if (values.password.length < 4) {
        error.password = toast.error("Password must be more then 4 Character Long...!")
    } else if (!specialChar.test(values.password)) {
        error.password = toast.error("Password must be Special Character...!")
    }
    return error;
}

/** validate username */
function usernameVerify(error = {}, values) {
    if (!values.username) {
        error.username = toast.error('Username Required...!')
    } else if (values.username.includes(" ")) {
        error.username = toast.error("Invalid Username...!")
    }
    return error;
}

/*validate for email */
function emailVerify(error = {}, values) {
    if (!values.email) {
        error.email = toast.error("Email Required...!")
    } else if (values.email.includes(" ")) {
        error.email = toast.error("Wrong Email...!")
    } else if (!specialChar.test(values.email)) {
        error.email = toast.error("Invalid Email Address...!")
    }
    return error;

}