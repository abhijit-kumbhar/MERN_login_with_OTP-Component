import React, { useEffect, useState } from 'react'
import style from '../styles/Login.module.css'
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useNavigate } from 'react-router-dom';

function OtpVerify() {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      // console.log(OTP);
      if (OTP) {
        return toast.success('OTP has been sent to your Email');
      } else {
        return toast.error('Problem while generating OTP!');
      }
    }).catch(error => {
      console.error('Error generating OTP:', error);
      toast.error('Error occurred while generating OTP.');
    });
  }, [username]);

  async function onSubmit(e) {
  e.preventDefault();

  try {
    console.log("Submitting OTP Verification with:", { username, code: OTP });

    let response = await verifyOTP({ username, code: OTP });

    if (response.status === 201) {
      toast.success('Verified Successfully!');
      navigate('/reset');
    } else {
      toast.error('Wrong OTP! Check your email again!');
    }
  } catch (error) {
    console.error('Error verifying OTP:', JSON.stringify(error, null, 2));

    // Handling specific error types or codes
    if (error.response && error.response.status === 400) {
      toast.error('Invalid OTP or username. Please try again.');
    } else {
      toast.error('Error occurred during OTP verification.');
    }
  }
}

  // Handler for resend OTP
  function resendOTP() {
    let sendPromise = generateOTP(username);

    toast.promise(sendPromise, {
      loading: 'Sending...',
      success: <b>OTP has been sent!</b>,
      error: <b>Could not send it!</b>,
    });

    sendPromise.then((OTP) => {
      // console.log(OTP);
    }).catch(error => {
      console.error('Error resending OTP:', error);
      toast.error('Error occurred while resending OTP.');
    });
  }

  return (
    <div className='container mx auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recover Password .
            </span>
          </div>
          <form className='pt-17' onSubmit={onSubmit}>

            <div className='textbox flex flex-col items-center'>
              <span className='py-4 text-sm text-left text-gray-500' >
                Enter 6 digit OTP to your Email address
              </span>
              <input type='text' onChange={(e) => setOTP(e.target.value)} className={style.textbox} placeholder='OTP' />
              <button type='submit' className={style.btn}>Sign Up</button>
            </div>

            <div className='text-center py-4'>
              <span className='text-gray-500'>Can't get OTP ? <button className='text-red-500' onClick={resendOTP} to='/reset'>Resend</button></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OtpVerify
