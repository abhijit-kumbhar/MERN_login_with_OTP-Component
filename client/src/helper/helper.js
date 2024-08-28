import axios from 'axios';
import {jwtDecode} from 'jwt-decode'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
axios.defaults.withCredentials = true;

/*Make api request*/

//to get username from token

export async function getUsername() {
    const token = localStorage.getItem('token');
    if(!token) return Promise.reject("Cannot find token");
    let decode = jwtDecode(token);
    return decode;
}


/* authenticate function*/
export async function authenticate(username) {
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error: "Username doesn't exist...!" }
    }
}

/* get user details*/
export async function getUser({username}) {
    try {
        const {data}  = await axios.get(`/api/user/${username}`);
        return {data} ;
    } catch (error) {
        return { error: "Password doesn't Match...!" }
    }
}

/* register user*/
export async function registerUser(credentials) {
    try {
        const { data: { msg }, status } = await axios.post('/api/register', credentials);
        let { username, email } = credentials;

        // send email
        if (status === 201) {
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg })
        }
        return Promise.resolve(msg)

    } catch (error) {
        return Promise.reject({ error })
    }
}

//login function 
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post('/api/login', { username, password })
            return Promise.resolve({ data });
        }

    } catch (error) {
        return Promise.reject({ error: "Password doesn't Match...! " })
    }
}

//update user function 
export async function updateUser(responce) {
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', responce, { headers: { "Authorization": `Bearer ${token}` } })
        return Promise.resolve({ data });

    } catch (error) {
        return Promise.reject({ error: "Couldn't update Profile...!" })
    }
}

// generate OTP
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get(`/api/generateOTP?${username}`, { params: { username }});
        //send mail with the OTP
        if (status === 201) {
            let { data: { email } } = await getUser({ username })
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your Password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password Recovery OTP" })
            return Promise.resolve(code);
        }

    } catch (error) {
        return Promise.reject({ error })
    }
}

//verify OTP
export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } });
        return { data, status };

    } catch (error) {
        return Promise.reject(error)
    }
}

//reset the Password function
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({ error })
    }
}