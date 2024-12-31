// //custom hook
// export default function useFetch(query) {
//     const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

//     useEffect(() => {
//         if (!query) return;

//         const fetchData = async () => {
//             try {
//                 setData(prev => ({ ...prev, isLoading: true }));
//                 const { data, status } = await axios.get(`https://login-with-otp-api.vercel.app/api/${query}`);

//                 if (status === 201) {
//                     setData(prev => ({ ...prev, isLoading: false }));
//                     setData(prev => ({ ...prev, apiData: data, status: status }));

//                 }
//                 setData(prev => ({ ...prev, isLoading: false }));

//             } catch (error) {
//                 setData(prev => ({ ...prev, isLoading: false, serverError: error }));

//             }
//         }
//         fetchData()
//     }, [query]);

//     return [getData, setData];
// }

import axios from "axios";
import { useEffect, useState } from "react";
import {getUsername} from '../helper/helper'


axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
axios.defaults.withCredentials = true;

export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }));

                const { username} =!query ? await getUsername() : '';
                const { data, status } = !query ? await axios.get(`https://login-with-otp-api.vercel.app/api/user/${username}`) : await axios.get(`https://login-with-otp-api.vercel.app/api/${query}`);

                if (status === 200) {
                    setData(prev => ({ ...prev, isLoading: false, apiData: data, status: status }));
                } else {
                    setData(prev => ({ ...prev, isLoading: false }));
                }

            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }));
            }
        };
        fetchData();
    }, [query]);

    return [getData, setData];
}
