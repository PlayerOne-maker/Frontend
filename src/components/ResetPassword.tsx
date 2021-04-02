import React from 'react'
import Modal from './modal/Modal'
import { useForm, ErrorMessage } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import { useMutation } from '@apollo/client'

import {
  FormContainer,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
  StyledError,
} from './SignUp'
import { RESET_PASSWORD } from '../apollo/mutations'



const ResetPassword: React.FC<{token:string}> = ({token}) => {

  const { register, handleSubmit, errors } = useForm<{ password: string }>()

const [resetPassword, { data, loading, error }] = useMutation <{ resetPassword:{ message: string }},{ token: string; password: string}> (RESET_PASSWORD)

const handleSubmitResetPassword = handleSubmit(async ({ password }) => {
  
  try {
    await resetPassword({variables:{
      password,
      token
    }})
  } catch (error) {
    
  }
})
  return (
    <Modal>
      <FormContainer>
        {!data ? (<Header>
          <h4>Enter your new password below.</h4>
        </Header>):(
          <Header>
          <h4>{data?.resetPassword.message}</h4>
          </Header>
        )}
        {!data &&
        <StyledForm onSubmit={handleSubmitResetPassword}>
          <InputContainer>
            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Your password'
              ref={register({
                required: 'Password is required.',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters.',
                },
                maxLength: {
                  value: 50,
                  message: 'Password must be not more than 50 characters.',
                },
              })}
            />

            <ErrorMessage errors={errors} name='password'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>
          <Button
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'point' }}
          >{loading ? <Loader type='Oval' color='white' height={30} width={30}
            timeout={30000} /> : "Submit"}</Button>
          {error && <StyledError>{error.graphQLErrors[0]?.message || 'Sorry, Someting wrong'}</StyledError>}
          
        </StyledForm>
        }
      </FormContainer>
    </Modal>
  )
}

export default ResetPassword
