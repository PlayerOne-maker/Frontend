import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useForm, ErrorMessage } from 'react-hook-form'
import {useMutation} from '@apollo/client'
import {SIGN_IN} from '../apollo/mutations'
import Router from 'next/router'
import Loader from 'react-loader-spinner'
import Modal from './modal/Modal'
import { AuthContext } from '../context/AuthContextProvider'
import {
  FormContainer,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
  StyledSwitchAction,
  Divider,
  StyledSocial,
  StyledError,
} from './SignUp'
import { SigninArgs, User } from '../types'
import { isAdmin } from '../helpers/authHelpers'

interface Props { }

const SignIn: React.FC<Props> = () => {
  const { handleAuthAction ,setAuthUser} = useContext(AuthContext)

  const { register, handleSubmit, errors } = useForm<SigninArgs>()

  const [signin,{loading,error}] = useMutation<{signin: User}, SigninArgs>(SIGN_IN)

  const handlesignin = handleSubmit( async ({email,password}) => {

    try {
      const res = await signin({variables: {
        email,
        password
      }})

      if(res?.data?.signin){
        const user = res.data.signin
        handleAuthAction('close')

        setAuthUser(user)

        if(isAdmin(user)){
          Router.push('/admin')
        }else{
          Router.push('/dashboard')
        }

        
      }
    } catch (error) {
      setAuthUser(null)
    }
    
  })

  return (
    <Modal>
      <FormContainer >
        <Header>
          <h2>Sign In</h2>
        </Header>

        <StyledSocial>
          <button className='facebook'>
            <FontAwesomeIcon icon={['fab', 'facebook-f']} size='lg' />
            <a>Sign in with Facebook</a>
          </button>
          <button className='google'>
            <FontAwesomeIcon icon={['fab', 'google']} />
            <a>Sign in with Google</a>
          </button>
        </StyledSocial>

        <Divider />

        <StyledForm onSubmit={handlesignin}>
          <p className='email_section_label'>or sign in with an email</p>
          <InputContainer>
            <label>Email</label>

            <Input
              type='text'
              name='email'
              id='email'
              placeholder='Your email'
              autoComplete='new-password'
              ref={register({
                required: 'Email is required.'
              })}
            />

            <ErrorMessage errors={errors} name='email'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <label>Password</label>

            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Your password'
              ref={register({
                required: 'Password is required.'
              })}
            />

            <ErrorMessage errors={errors} name='password'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>
          <Button
            disabled={loading}
            style={{cursor: loading ? 'not-allowed' : 'point'}}
          >{loading ? <Loader type='Oval' color='white' height={30} width={30}
            timeout={30000} /> : "Submit"}</Button> 
            {error && <StyledError>{error.graphQLErrors[0]?.message || 'Sorry, Someting wrong'}</StyledError>}
            {/* ถ้ากำลัง loading ให้แสดง Loader ถ้าไม่ใช่ให้แสดง submit */}
        </StyledForm>
        <StyledSwitchAction>
          <p>
            Don't have an account yet?{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('signup')}
            >
              sign up
            </span>{' '}
            instead.
          </p>
          <p>
            Forgot password? click{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('request')}
            >
              here.
            </span>
          </p>
        </StyledSwitchAction>
      </FormContainer>
    </Modal>
  )
}

export default SignIn
