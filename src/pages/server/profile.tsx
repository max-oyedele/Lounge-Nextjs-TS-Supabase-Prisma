import React, { useState, useEffect } from 'react'

import { GetServerSideProps } from 'next'
import supabase from 'libs/supabase'
import prisma from 'libs/prisma'

import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import MainLayout from 'components/server/main-layout'
import Logo from 'components/server/logo'
import Error from 'components/error'
import Avatar from 'components/avatar'
import Loading from 'components/loading'
import { fetchPostJSON } from 'libs/api-helpers'

const Profile = (props) => {
  const { user } = props
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [passwordChange, setPasswordChange] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (avatarFile) {
      setAvatarUrl((window.URL ? URL : webkitURL).createObjectURL(avatarFile))
    }
  }, [avatarFile])

  return (
    <MainLayout>
      <Logo />
      <Avatar />

      {loading && <Loading loading={loading} />}
      {error && <Error error={error} setError={setError} />}

      <div className="w-full md:w-1/2 p-2 md:p-10">
        <Formik
          initialValues={{
            username: user?.name,
            email: user?.email,
            image: user?.image,
            passwordChange: passwordChange,
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={() =>
            Yup.object().shape({
              newPassword:
                passwordChange &&
                Yup.string()
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    'Password must be a minimum eight characters, with at least one uppercase letter, one lowercase letter, and one number',
                  )
                  .required('Password is required'),
              confirmPassword:
                passwordChange &&
                Yup.string()
                  .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                  .required('Confirm Password is required'),
            })
          }
          onSubmit={async ({ username, newPassword }) => {
            setLoading(true)

            let avatarRemoteURL;
            if (avatarFile) {
              await supabase.storage.from('images').remove([`avatars/${user.userId}`])

              const { data, error } = await supabase.storage.from('images').upload(`avatars/${user.userId}`, avatarFile)
              if (data) {
                const { signedURL } = await supabase.storage
                  .from('images')
                  .createSignedUrl(`avatars/${user.userId}`, 60)

                avatarRemoteURL = signedURL
              } else if (error) {
                setError('Image upload Failed')
              }
            }

            if (passwordChange) {
              const { error } = await supabase.auth.update({ password: newPassword })
              if (error) setError(error.message)
            }

            {
              const {data, error} = await fetchPostJSON('/api/updateUser', {
                user: { ...user, name: username, image: avatarRemoteURL ?? user.image},
              })
              if(data){

              }
              if(error){
                setError(error)
              }
              setLoading(false)
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="rounded-lg shadow-lg p-4 border">
              <section className="flex justify-center">
                <label htmlFor="avatar">
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="hidden"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                  />
                  <img
                    src={avatarUrl ? avatarUrl : user?.image ? user.image : '/images/profile_server.svg'}
                    className="object-contain w-44 h-44 rounded-full cursor-pointer"
                    alt="avatar"
                  />
                </label>
              </section>

              <section className="mt-6">
                <label className="block text-gray-400 text-sm" htmlFor="email">
                  Your name
                </label>
                <input
                  id="username"
                  className="w-full border border-gray-200 py-2 px-3 rounded text-gray-800"
                  name="username"
                  type="text"
                  placeholder=""
                  value={values.username}
                  onChange={handleChange}
                />
                <ErrorMessage name="username">{(msg) => <span className="text-red-700">{msg}</span>}</ErrorMessage>
              </section>

              <section className="mt-6">
                <label className="block text-gray-400 text-sm" htmlFor="email">
                  Your Email
                </label>
                <input
                  id="email"
                  className="w-full border border-gray-200 py-2 px-3 rounded text-gray-800 bg-white cursor-not-allowed"
                  name="email"
                  type="text"
                  placeholder=""
                  value={user?.email}
                  onChange={handleChange}
                  disabled
                />
                <ErrorMessage name="email">{(msg) => <span className="text-red-700">{msg}</span>}</ErrorMessage>
              </section>

              <div className="flex items-center mt-6">
                <input
                  id="password-change"
                  name="passwordChange"
                  type="checkbox"
                  onChange={(e) => setPasswordChange(e.target.checked)}
                />
                <label htmlFor="password-change" className="text-sm text-gray-800 ml-1">
                  Change Password
                </label>
              </div>

              {passwordChange && (
                <>
                  <section className="mt-6">
                    <label className="block text-gray-400 text-sm" htmlFor="new-password">
                      New Password<span className="text-red-900"> *</span>
                    </label>
                    <input
                      id="new-password"
                      className="w-full border border-gray-200 py-2 px-3 rounded text-gray-800"
                      name="newPassword"
                      type="password"
                      placeholder=""
                      onChange={handleChange}
                    />
                    <ErrorMessage name="newPassword">
                      {(msg) => <span className="text-red-700">{msg}</span>}
                    </ErrorMessage>
                  </section>

                  <section className="mt-6">
                    <label className="block text-gray-400 text-sm" htmlFor="confirm-password">
                      Confirm Password<span className="text-red-900"> *</span>
                    </label>
                    <input
                      id="confirm-password"
                      className="w-full border border-gray-200 py-2 px-3 rounded text-gray-800"
                      name="confirmPassword"
                      type="password"
                      placeholder=""
                      onChange={handleChange}
                    />
                    <ErrorMessage name="confirmPassword">
                      {(msg) => <span className="text-red-700">{msg}</span>}
                    </ErrorMessage>
                  </section>
                </>
              )}

              <div className="w-full flex justify-center mt-10">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 w-40 h-10 rounded-md text-white"
                  disabled={loading}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>

    </MainLayout>
  )
}

export default Profile

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)
  if (!user) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }

  try {
    const publicUser = await prisma.user.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (publicUser.role !== 'SERVER') {
      return {
        redirect: {
          destination: '/' + publicUser.role.toLowerCase(),
          permanent: false,
        },
      }
    }

    return {
      props: {
        user: JSON.parse(JSON.stringify(publicUser)),
      },
    }
  } catch (err) {
    return {
      props: {
        error: 'Something wrong in Profile. Please try again',
      },
    }
  }
}
