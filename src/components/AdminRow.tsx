import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from 'react-loader-spinner'

import { User, Role } from '../types'
import { isSuperAdmin } from '../helpers/authHelpers'
import { DELETE_USER, UPDATE_USERROLE } from '../apollo/mutations'
import { USER } from '../apollo/querys'

interface Props {
  user: User
  admin: User | null
}

const DeleteBtn = styled.button`
  background: red;
  color: white;
  &:hover {
    background: orange;
  }
`

const AdminRow: React.FC<Props> = ({ user, admin }) => {
  const { roles } = user
  const initialState = {
    CLIENT: roles.includes('CLIENT'),
    ITEMEDITOR: roles.includes('ITEMEDITOR'),
    ADMIN: roles.includes('ADMIN'),
  }

  const [isEditing, setIsEditing] = useState(false)
  const [roleState, setRoleState] = useState(initialState)

  let [updateRoles, { loading, error }] = useMutation<
    { updateRoles: User },
    { userId: string; newRoles: Role[] }
  >(UPDATE_USERROLE)


  let [deleteUser, delete_res] = useMutation<
    { deleteUser: { massage: string } },
    { userId: string }
  >(DELETE_USER)

  const handleDeteleUser = async (userId: string) => {
    try {
      const res = await deleteUser({
        variables: { userId },
        refetchQueries: [{ query: USER }]
      })

      if(res.data?.deleteUser.massage) {
        alert(res.data?.deleteUser.massage)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (error)
      alert(error.graphQLErrors[0]?.message || 'Sorry, something went wrong')
  }, [error])

  const handleSubmitUpdateRoles = async (userId: string) => {
    try {
      const newRoles: Role[] = []

      Object.entries(roleState).forEach(([k, v]) =>
        v ? newRoles.push(k as Role) : null
      ) // {ITEMEDITOR: true, ADMIN: false} --> [[ITEMEDITOR, true], [ADMIN, false]]

      // Check if the user.roles array has not been changed --> do not call to backend
      if (user.roles.length === newRoles.length) {
        const checkRoles = user.roles.map((role) => newRoles.includes(role))

        if (!checkRoles.includes(false)) {
          alert('Nothing change')
          return
        }
      }

      const response = await updateRoles({ variables: { userId, newRoles },refetchQueries: [{query:USER}] })

      if (response.data?.updateRoles) {
        setIsEditing(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <tr key={user.id}>
      {/* Name */}
      <td>{user.username}</td>

      {/* Email */}
      <td>{user.email}</td>

      {/* CreatedAt */}
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>

      {/* Manage Roles Section */}
      {/* client role */}
      {isSuperAdmin(admin) && (
        <>
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
          >
            <FontAwesomeIcon
              icon={['fas', 'check-circle']}
              className='true'
              size='lg'
              style={{ color: 'black', cursor: 'not-allowed' }}
            />
          </td>

          {/* item editor role */}
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
            onClick={
              isEditing
                ? () =>
                  setRoleState((prev) => ({
                    ...prev,
                    ITEMEDITOR: !prev.ITEMEDITOR,
                  }))
                : undefined
            }
          >
            {roleState.ITEMEDITOR ? (
              <FontAwesomeIcon
                icon={['fas', 'check-circle']}
                className='true'
                size='lg'
                style={{ color: !isEditing ? 'black' : undefined }}
              />
            ) : (
              <FontAwesomeIcon
                icon={['fas', 'times-circle']}
                className='false'
                size='lg'
                style={{ color: !isEditing ? 'lightgray' : undefined }}
              />
            )}
          </td>

          {/* admin role */}
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
            onClick={
              isEditing
                ? () =>
                  setRoleState((prev) => ({ ...prev, ADMIN: !prev.ADMIN }))
                : undefined
            }
          >
            <>
              {roleState.ADMIN ? (
                <FontAwesomeIcon
                  icon={['fas', 'check-circle']}
                  className='true'
                  size='lg'
                  style={{ color: !isEditing ? 'black' : undefined }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={['fas', 'times-circle']}
                  className='false'
                  size='lg'
                  style={{ color: !isEditing ? 'lightgray' : undefined }}
                />
              )}
            </>
          </td>

          {/* super admin role */}
          <td>
            {isSuperAdmin(user) && (
              <FontAwesomeIcon
                style={{ cursor: 'not-allowed' }}
                icon={['fas', 'check-circle']}
                size='lg'
              />
            )}
          </td>

          {/* action */}
          {loading ? (
            <td>
              <Loader
                type='Oval'
                color='teal'
                width={30}
                height={30}
                timeout={30000}
              />
            </td>
          ) : isEditing ? (
            <td>
              <p className='role_action'>
                <button>
                  <FontAwesomeIcon
                    icon={['fas', 'times']}
                    color='red'
                    onClick={() => {
                      setRoleState(initialState)
                      setIsEditing(false)
                    }}
                    size='lg'
                  />
                </button>
                <button onClick={() => handleSubmitUpdateRoles(user.id)}>
                  <FontAwesomeIcon
                    icon={['fas', 'check']}
                    color='teal'
                    size='lg'
                  />
                </button>
              </p>
            </td>
          ) : (
            <td>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </td>
          )}
          {!isSuperAdmin(user) && (
            <td>
              <DeleteBtn 
                onClick={() => {
                  if(!confirm('Are you sure to delete.')) return

                  handleDeteleUser(user.id)
                }}
                style={{ cursor: isEditing ? 'not-allowed' : undefined }}
                disabled={isEditing}
              >
                {delete_res.loading ? (              <Loader
                type='Oval'
                color='teal'
                width={30}
                height={30}
                timeout={30000}
              />)
              : (<FontAwesomeIcon icon={['fas', 'trash-alt']} size='lg' />)}
              </DeleteBtn>
            </td>
          )}
        </>
      )}
    </tr>
  )
}

export default AdminRow