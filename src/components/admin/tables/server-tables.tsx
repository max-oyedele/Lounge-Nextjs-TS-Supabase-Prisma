import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchPostJSON } from 'libs/api-helpers'
import Modal from 'components/modal'
import Loading from 'components/loading'
import { BiTrash } from 'react-icons/bi'

export const ServerTable = (props) => {
  const { users, selectedKeyword } = props
  const router = useRouter()

  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    filterUsers()
  }, [selectedKeyword])

  const filterUsers = () => {
    let result = users.filter((e) => e.isDeleted === false)
    if (selectedKeyword) {
      result = result.filter(
        (e) =>
          e.name?.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          e.email?.toLowerCase().includes(selectedKeyword.toLowerCase()),
      )
    }
    setFilteredUsers(result)
  }

  const [newServerModal, setNewServerModal] = useState(false)
  const [newServer, setNewServer] = useState(null)
  const [emailValid, setEmailValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addServerError, setAddServerError] = useState(null)
  const [addServerSuccess, setAddServerSuccess] = useState(null)

  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteUser, setDeleteUser] = useState(null)

  const handleChangeEmail = (e) => {
    const server = { ...newServer, email: e.target.value }
    setNewServer(server)

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (emailPattern.test(e.target.value)) {
      setEmailValid(true)
    } else {
      setEmailValid(false)
    }
  }

  const addServer = async () => {
    setLoading(true)
    if (!users || users.findIndex((e) => e.email === newServer.email) == -1) {
      const { data, error } = await fetchPostJSON('/api/addServer', {
        email: newServer.email,
      })
      if (error) setAddServerError(error)
      if (data) {
        await fetchPostJSON('/api/updateUser', {
          user: { userId: data.id, role: 'SERVER' },
        })
        setAddServerSuccess('Server has added but He/She has to verify email.')
      }
    } else if (users?.findIndex((e) => e.email === newServer.email) > -1) {
      await fetchPostJSON('/api/updateUser', {
        user: { userId: users.find((e) => e.email === newServer.email)?.userId, isDeleted: false },
      })
      setAddServerSuccess('Server has added.')
    }

    setLoading(false)
    setNewServerModal(false)
    router.reload()
  }

  const deleteServer = async () => {
    setLoading(true)
    await fetchPostJSON('/api/updateUser', {
      user: { userId: deleteUser.userId, isDeleted: true },
    })

    setLoading(false)
    setConfirmModal(false)
    router.reload()
  }

  return (
    <div className="bg-white p-4 rounded-md w-full">
      <Loading loading={loading} />
      <div className="flex justify-between items-center">
        <span className="text-lg">Servers</span>
        <button
          className="px-4 py-2 border rounded-md"
          onClick={() => {
            setNewServerModal(true)
            setNewServer(null)
            setEmailValid(false)
          }}
        >
          Add Server
        </button>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="text-sm text-gray-800 text-left font-medium bg-gray-200">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2 flex justify-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {filteredUsers?.map((user, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">{index + 1}</td>
                <td className="px-4 py-4">{user.name}</td>
                <td className="px-4 py-4">{user.email}</td>
                <td className="px-4 py-4">
                  {user.image && (
                    <img
                      src={user.image}
                      className="object-contain w-12 h-12 rounded-full cursor-pointer"
                      alt="avatar"
                    />
                  )}
                </td>
                <td className="px-4 py-4 flex justify-center">
                  <BiTrash
                    onClick={() => {
                      setConfirmModal(true)
                      setDeleteUser(user)
                    }}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {newServerModal && (
        <Modal setOpenModal={setNewServerModal}>
          <span className="">Please Enter New Server's Email</span>
          <div className="border mt-6">
            <input
              id="email"
              className="w-full py-2 px-3 rounded text-gray-800"
              name="email"
              type="email"
              placeholder=""
              onChange={handleChangeEmail}
            />
          </div>
          <button
            className={`bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mt-6 ${
              emailValid ? '' : 'cursor-not-allowed'
            }`}
            onClick={addServer}
            disabled={!emailValid}
          >
            Submit
          </button>
        </Modal>
      )}

      {confirmModal && (
        <Modal setOpenModal={setConfirmModal}>
          <div>
            <span>Are you sure to delete this server?</span>
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mx-2"
                onClick={() => setConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mx-2"
                onClick={() => deleteServer()}
              >
                Yes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {addServerSuccess && (
        <Modal setOpenModal={setAddServerSuccess}>
          <div>
            <span>{addServerSuccess}</span>
          </div>
        </Modal>
      )}
      {addServerError && (
        <Modal setOpenModal={setAddServerError}>
          <div>
            <span>{addServerError}</span>
          </div>
        </Modal>
      )}
    </div>
  )
}
