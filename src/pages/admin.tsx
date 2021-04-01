import Admin from '../components/Admin'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Loader from 'react-loader-spinner'

import { AuthContext } from '../context/AuthContextProvider'
import {isAdmin} from '../helpers/authHelpers'

export default function AdminPage() {
  const { loggedInUser } = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    // If user in not authenticated, push to home page
    if (!loggedInUser) {
      router.push('/')
    }else{
      const user = isAdmin(loggedInUser)
      
      if(!user){
        router.push('/dashboard')
      }
    }
  }, [loggedInUser])

  return !isAdmin(loggedInUser) ?  (
    <Loader type='Oval' color='teal' height={30} width={30} timeout={30000} />
  ) : (
    <Admin></Admin>
  )
}
