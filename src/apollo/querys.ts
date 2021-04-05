import {gql} from '@apollo/client'

export const ME = gql`
query{
    me
    {
        id
        username
        createdAt 
        email
        roles
    }
  }
`

export const USER = gql`
query {
  users{
    username
    password
    email
    id
    createdAt
    roles
  }
}
`