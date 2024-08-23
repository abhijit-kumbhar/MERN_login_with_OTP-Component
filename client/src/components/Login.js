import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import avtar from '../assets/profile.png'
import style from'../styles/Login.module.css'
import {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import {usernameValidate} from '../helper/validate'
import { useAuthStore } from '../store/store';

function Login() {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => (state.setUsername))

  const formik = useFormik({
    initialValues:{
      username:'admin'
    },
    validate: usernameValidate,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit: async values =>{
      //const m= await values.username;
      setUsername(values.username)
      // console.log(values)
      navigate('/password')
    }
    })


  return (
    <div className='container mx auto'>
        
        <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass}>
        <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello Again!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>
        <form className='py-1' onSubmit={formik.handleSubmit}>

            <div className='profile flex justify-center py-4'>
                <img src={avtar} className={style.profile_img} alt='avtar'/>
            </div>

            <div className='textbox flex flex-col items-center'>
            <input {...formik.getFieldProps('username')} type='text' className={style.textbox} placeholder='Username'/>
            <button type='submit' className={style.btn}>Lets GO</button>
            </div>

            <div className='text-center py-4'>
                <span className='text-gray-500'>Not a Member <Link className='text-red-500' to='/register'>Register Now</Link></span>
            </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Login
