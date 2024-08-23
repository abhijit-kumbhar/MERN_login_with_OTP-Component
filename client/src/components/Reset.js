import React, { useEffect } from 'react'
import {Link} from 'react-router-dom'
import style from'../styles/Login.module.css'
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import { resetPasswordValidation} from '../helper/validate'
import { resetPassword } from '../helper/helper';
import { useAuthStore } from '../store/store';
import { useNavigate, Navigate } from 'react-router-dom';
import useFetch from '../hooks/fetch.hook';

function Reset() {

  const {username} = useAuthStore(state => state.auth)
  const navigate = useNavigate();
  const [{isLoading, status, serverError}] = useFetch('createResetSession');

  useEffect(() => {
    // console.log(apiData)
  })

    const formik = useFormik({
        initialValues:{
            password:'',
            confirmpassword:''
        },
        validate: resetPasswordValidation,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: async values =>{

          let resetPromise = resetPassword({username, password : values.password});

          toast.promise(resetPromise, {
            loading : 'Updating...',
            success : <b>Reast Successfully...!</b>,
            error : <b>Could not Reset !</b>
          });

          resetPromise.then(function(){
            navigate('/password')
          })

        }
    });

    if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
    if (serverError) {
      console.error('Server error:', serverError);
      return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;
    }
    if(status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

  return (
    <div className='container mx auto'>
        
        <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass}>
        <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Reset</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
            Enter new Password !
            </span>
          </div>
        <form className='pt-17' onSubmit={formik.handleSubmit}>

            <div className='textbox flex flex-col items-center'>
            <input {...formik.getFieldProps('password')} type='text' className={style.textbox} placeholder='New Password'/>
            <input {...formik.getFieldProps('confirmpassword')} type='text' className={style.textbox} placeholder='Confirm Password'/>
            <button type='submit' className={style.btn}>Reset</button>
            </div>

            <div className='text-center py-4'>
                <span className='text-gray-500'>Forgot Password <Link className='text-red-500' to='/reset'>Recover Now</Link></span>
            </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Reset;
