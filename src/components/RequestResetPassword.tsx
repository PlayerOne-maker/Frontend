import React from 'react'
import { useMutation } from '@apollo/client'
import { useForm, ErrorMessage } from 'react-hook-form'
import Loader from 'react-loader-spinner'
import Modal from './modal/Modal'
import {
  FormContainer,
  StyledError,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
} from './SignUp'
import { REQUEST_RESET_PASSWORD } from '../apollo/mutations'

interface Props { }

const RequestResetPassword: React.FC<Props> = () => {

  const { register, handleSubmit, errors } = useForm<{ email: string }>()

  const [requestResetPassword, { data, loading, error }] = useMutation<{ requestResetPassword: { message: string } },
    { email: string }>(REQUEST_RESET_PASSWORD)

  const handleresetpassword = handleSubmit(async ({ email }) => {
    
    try {
      await requestResetPassword({
        variables: {
          email
        }
      })
    } catch (error) {
      console.log(error)
    }

  })

  return (
    <Modal>
      <FormContainer>
        {!data ? (
        <Header>
          <h4>Enter your email below to reset password.</h4>
        </Header>
        ) : (<Header>
        <h4>{data.requestResetPassword.message}</h4>
      </Header>)}
        {!data && 
        <StyledForm onSubmit={handleresetpassword}>
          <InputContainer>
            <label>Email</label>

            <Input
              type='text'
              name='email'
              id='email'
              placeholder='Your email'
              autoComplete='new-password'
              ref={register({
                required: 'Email is required.',
              })}
            />

            <ErrorMessage errors={errors} name='email'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>
          <Button
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'point' }}
          >{loading ? <Loader type='Oval' color='white' height={30} width={30}
            timeout={30000} /> : "Submit"}</Button>
          {error && <StyledError>{error.graphQLErrors[0]?.message || 'Sorry, Someting wrong'}</StyledError>}
          
          {/* ถ้ากำลัง loading ให้แสดง Loader ถ้าไม่ใช่ให้แสดง submit */}
        </StyledForm>
        }
      </FormContainer>
    </Modal>
  )
}

export default RequestResetPassword
