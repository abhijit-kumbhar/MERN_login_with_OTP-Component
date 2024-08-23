
// function Password() {

//   const navigate = useNavigate();

//   const {username} = useAuthStore(state => state.auth)
//   const [{isLoading, apiData, serverError}] = useFetch(`/user/${username}`)

//     const formik = useFormik({
//         initialValues:{
//             password:'admin@1234'
//         },
//         validate: passwordValidate,
//         validateOnBlur:false,
//         validateOnChange:false,
//         onSubmit: async values =>{
//             // console.log(values)
//             let loginPromise = verifyPassword({username, password: values.password});

//             toast.promise(loginPromise,{
//               loading: 'Checking...',
//               error : <b>Password Not Match !</b>,
//               success: <b>Login Successfully...!</b>
//             });

//             loginPromise.then((res) =>{
//               let {token} = res.data;
//               localStorage.setItem('token', token);
//               navigate('/profile')
//             })
//         }
//     })

//     if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
//     if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
//     // console.log(apiData?.firstName)

//   return (
//     <div className='container mx auto'>
        
//         <Toaster position='top-center' reverseOrder={false}></Toaster>

//       <div className='flex justify-center items-center h-screen'>
//         <div className={style.glass}>
//         <div className="title flex flex-col items-center">
//             <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
//             <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
//               Explore More by connecting with us.
//             </span>
//           </div>
//         <form className='py-1' onSubmit={formik.handleSubmit}>

//             <div className='profile flex justify-center py-4'>
//                 <img src={apiData?.profile || avtar} className={style.profile_img} alt='avtar'/>
//             </div>

//             <div className='textbox flex flex-col items-center'>
//             <input {...formik.getFieldProps('password')} type='text' className={style.textbox} placeholder='Password'/>
//             <button type='submit' className={style.btn}>Sign Up</button>
//             </div>

//             <div className='text-center py-4'>
//                 <span className='text-gray-500'>Forgot Password <Link className='text-red-500' to='/otpRecovery'>Recover Now</Link></span>
//             </div>
//         </form>
//       </div>
//     </div>
//     </div>
//   )
// }

// export default Password

import React from 'react';
import { Link } from 'react-router-dom';
import avtar from '../assets/profile.png';
import style from '../styles/Login.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import { verifyPassword } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: 'admin@123',
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let loginPromise = verifyPassword({ username, password: values.password });

        toast.promise(loginPromise, {
          loading: 'Checking...',
          success: <b>Login Successfully...!</b>,
          error: <b>Password Not Match!</b>,
        });

        loginPromise.then((res) => {
          let { token } = res.data;
          localStorage.setItem('token', token);
          navigate('/profile');
        }).catch(error => {
          console.error('Login error:', error);
        });
      } catch (error) {
        console.error('Error in onSubmit:', error);
      }
    }
  });

  if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if (serverError) {
    console.error('Server error:', serverError);
    return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;
  }

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={apiData?.profile || avtar} className={style.profile_img} alt='avatar' />
            </div>
            <div className='textbox flex flex-col items-center'>
              <input {...formik.getFieldProps('password')} type='text' className={style.textbox} placeholder='Password' />
              <button type='submit' className={style.btn}>Sign Up</button>
            </div>
            <div className='text-center py-4'>
              <span className='text-gray-500'>Forgot Password <Link className='text-red-500' to='/otpRecovery'>Recover Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Password;
