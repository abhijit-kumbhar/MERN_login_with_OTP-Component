import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import avtar from '../assets/profile.png'
import style from '../styles/Login.module.css'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik'
import { registerValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert'
import { registerUser } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

// function Register() {

//   const navigate = useNavigate();
//   const [file, setFile]=useState();

//     const formik = useFormik({
//         initialValues:{
//             username:'example123',
//             email:'admin@gmail.com',
//             password:'admin@123'
//         },
//         validate: registerValidation,
//         validateOnBlur:false,
//         validateOnChange:false,
//         onSubmit: async (values) =>{
//           values = await Object.assign(values,{profile : file || ''})

//           let registerPromise = registerUser(values)

//           toast.promise(registerPromise, {
//             loading : 'Creating...',
//             success : <b>Register Successfully...!</b>,
//             error : <b>Could not Register.</b>
//           });

//           registerPromise.then(function(){
//             navigate('/')
//           })
//         }
//     })

//     const uploadFile = async e =>{
//       const base64 = await convertToBase64(e.target.files[0]);
//       setFile(base64);
//     }

//   return (
//     <div className='container mx auto'>

//         <Toaster position='top-center' reverseOrder={false}></Toaster>

//       <div className='flex justify-center items-center h-screen'>
//         <div className={style.glass} style={{height:"650px"}}>
//         <div className="title flex flex-col items-center">
//             <h4 className='text-5xl font-bold'>Register !</h4>
//             <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
//               Happy to Join You !
//             </span>
//           </div>
//         <form className='py-1' onSubmit={formik.handleSubmit}>

//             <div className='profile flex justify-center py-4'>
//               <label htmlFor='profile'>
//                <img src={file || avtar} className={style.profile_img} alt='avtar'/>
//               </label>
//               <input onChange={uploadFile} className={style.input} type='file' id='profile' name='profile'/>            
//             </div>

//             <div className='textbox flex flex-col items-center'>
//             <input {...formik.getFieldProps('username')} type='text' className={style.textbox} placeholder='Username'/>
//             <input {...formik.getFieldProps('email')} type='text' className={style.textbox} placeholder='Email'/>
//             <input {...formik.getFieldProps('password')} type='text' className={style.textbox} placeholder='Password'/>
//             <button type='submit' className={style.btn}>Register</button>
//             </div>

//             <div className='text-center py-4'>
//                 <span className='text-gray-500'>Already Register <Link className='text-red-500' to='/'>Login</Link></span>
//             </div>
//         </form>
//       </div>
//     </div>
//     </div>
//   )
// }

// export default Register


function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin@123',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '' });

      try {
        let registerPromise = registerUser(values);

        toast.promise(registerPromise, {
          loading: 'Creating...',
          success: <b>Register Successfully...!</b>,
          error: <b>Could not Register.</b>,
        });

        registerPromise
          .then(function () {
            navigate('/');
          })
          .catch((error) => {
            console.error('Registration error:', error);
          });
      } catch (error) {
        console.error('Error in onSubmit:', error);
      }
    }
  });

  const uploadFile = async (e) => {
    try {
      const base64 = await convertToBase64(e.target.files[0]);
      setFile(base64);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className={style.glass} style={{ height: '650px' }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register !</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to Join You !
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avtar} className={style.profile_img} alt="avatar" />
              </label>
              <input onChange={uploadFile} className={style.input} type="file" id="profile" name="profile" />
            </div>

            <div className="textbox flex flex-col items-center">
              <input {...formik.getFieldProps('username')} type="text" className={style.textbox} placeholder="Username" />
              <input {...formik.getFieldProps('email')} type="text" className={style.textbox} placeholder="Email" />
              <input {...formik.getFieldProps('password')} type="text" className={style.textbox} placeholder="Password" />
              <button type="submit" className={style.btn}>Register</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered? <Link className="text-red-500" to="/">Login</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
