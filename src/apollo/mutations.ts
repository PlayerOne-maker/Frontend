import { gql } from '@apollo/client'

export const SIGN_UP = gql`
    mutation SIGN_UP($username: String!, $email: String!, $password: String!) {
    signup(
      username: $username
        password:$password
      email:$email
    ){
      id
      username
      password
      email
      roles
      createdAt
    }
  }
`
