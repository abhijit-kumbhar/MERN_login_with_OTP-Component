import React, { useState } from 'react'
import avtar from '../assets/profile.png'
import style from'../styles/Login.module.css'
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import {profilevalidate} from '../helper/validate'
import convertToBase64 from '../helper/convert'
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper';
import { useNavigate } from 'react-router-dom';


function ProfileUpdate() {

  const navigate = useNavigate()
  const [file, setFile]=useState();
  const [{ isLoading, apiData, serverError }] = useFetch();

    const formik = useFormik({
        initialValues:{
            firstName: apiData?.firstName || '',
            lastName: apiData?.lastName || '',
            email: apiData?.email || '',
            mobile: apiData?.mobile || '',
            address: apiData?.address || ''
        },
        enableReinitialize: true,
        validate: profilevalidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: async values =>{
          values = await Object.assign(values,{profile : file || apiData?.profile || ''})
            // console.log(values)

            let updatePromise = updateUser(values);

            toast.promise(updatePromise, {
              loading : 'Updating...',
              success : <b>Updated Successfully</b>,
              error : <b>Could not Updated .</b>
            });
        }
    })

    const uploadFile = async e =>{
      const base64 = await convertToBase64(e.target.files[0]);
      setFile(base64);
    }

    //logout handler function
    function userLogout(){
      localStorage.removeItem('token')
      navigate('/')
    }

    if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if (serverError) {
    console.error('Server error:', serverError);
    return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;
  }

  return (
    <div className='container mx auto'>
        
        <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass} style={{height:"660px"}}>
        <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Profile !</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              You can update the details.
            </span>
          </div>
        <form className='py-1' onSubmit={formik.handleSubmit}>

            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
               <img src={apiData?.profile || file || avtar} className={style.profile_img} alt='avtar'/>
              </label>
              <input onChange={uploadFile} className={style.input} type='file' id='profile' name='profile'/>            
            </div>

            <div className='textbox flex flex-col items-center gap-4'>
              <div className='name flex w3/4 gap-8'>
              <input {...formik.getFieldProps('firstName')} type='text' className={style.textbox} style={{width:'200px'}} placeholder='FirstName'/>
              <input {...formik.getFieldProps('lastName')} type='text' className={style.textbox} style={{width:'200px'}} placeholder='LastName'/>
              </div>

              <div className='name flex w3/4 gap-10'>
            <input {...formik.getFieldProps('mobile')} type='text' className={style.textbox} style={{width:'200px'}} placeholder='Mobile_No'/>
            <input {...formik.getFieldProps('email')} type='text' className={style.textbox} style={{width:'200px'}} placeholder='Email'/>
            </div>
            <input {...formik.getFieldProps('address')} type='text' className={style.textbox} style={{width:'440px'}} placeholder='Address'/>
            <button type='submit' className={style.btn} style={{width:'440px'}}>Update</button>
            </div>

            <div className='text-center py-4'>
                <span className='text-gray-500'>Come Back Later ? <button className='text-red-500' onClick={userLogout} to='/'>Logout</button></span>
            </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default ProfileUpdate
