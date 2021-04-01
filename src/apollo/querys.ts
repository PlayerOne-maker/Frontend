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