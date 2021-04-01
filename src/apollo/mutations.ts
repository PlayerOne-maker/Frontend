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


export const SIGN_OUT = gql`
mutation {
  signout{
    message
  }
}
`

export const SIGN_IN = gql`
mutation SIGN_IN($password : String! , $email: String!){
  signin(password:$password,email:$email){
    username
    id
    createdAt
    email
    roles
  }
}

`