import { useState } from 'react'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { getCandidateByToken, login } from '../core/requests/_requests'
import { useAuth } from '../../../../app/modules/auth/core/Auth'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    validateOnChange: false, // prevents validation on each field change
    validateOnBlur: true, // ensures validation when user leaves a field
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data: auth } = await login(values.email, values.password)
        saveAuth(auth)
        const { data: user } = await getCandidateByToken()
        setCurrentUser(user)
      } catch (error) {
        saveAuth(undefined)
        setStatus('The login details are incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='text-center mb-11'>
        <h1 className='text-gray-900 fw-bolder mb-3'>Sign In</h1>
        <div className='text-gray-500 fw-semibold fs-6'>
          Your credentials to access your account.
        </div>
      </div>

      {/* Display submission status or helper text */}
      
      {formik.status ? (
        <div className='mb-lg-10 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : <div></div>
      }
        
      {/* Email field */}
      <div className='fv-row mb-8'>
        <div className="form-floating mb-7">
          <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className='form-control'
          type='text'
          name='email'
          autoComplete='off'/>
          <label>Email Address</label>
        </div>
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
     
      {/* Password field */}
      <div className='fv-row mb-3'>
        <div className="form-floating mb-7">
          <input 
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className='form-control'/>
          <label>Password</label>
        </div> 
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Link */}
      {/* <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        <Link to='/auth/forgot-password' className='link-danger'>
          Forgot Password ?
        </Link>
      </div> */}

      {/* Submit Button */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-danger'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
    </form>
  )
}
