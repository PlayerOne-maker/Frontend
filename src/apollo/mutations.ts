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

export const REQUEST_RESET_PASSWORD = gql`
  mutation REQUEST_RESET_PASSWORD(
    $email : String!
    ){
    requestResetPassword(
      email:$email
      ){
      message
    }
  }
`

export const RESET_PASSWORD = gql`
mutation RESET_PASSWORD($token:String!,$password:String!){
  resetPassword(token:$token,password:$password){
    message
  }
}
`

export const UPDATE_USERROLE = gql`
mutation UPDATE_USERROLE(
  $userId: String! ,$newRoles: [String!]!
  ){
  updateRoles(
    userId:$userId
    newRoles:$newRoles
  ){
    id
    username
    email
    roles
    createdAt
  }
}
`

export const DELETE_USER = gql`
mutation DELETE_USER($userId: String!){
  deleteUser(userId:$userId){
    message
  }
}
` 