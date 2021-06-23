import { useState, useEffect } from 'react'
import moment from 'moment'

export const GuestTable = (props) => {
  const { users, selectedKeyword } = props

  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    filterUsers()
  }, [selectedKeyword])

  const filterUsers = () => {
    let result = users
    if (selectedKeyword) {
      result = result.filter(
        (e) =>
          e.name?.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          e.email?.toLowerCase().includes(selectedKeyword.toLowerCase()),
      )
    }
    setFilteredUsers(result)
  }

  return (
    <div className="bg-white p-4 rounded-md w-full">
      <div className="flex justify-between items-center">
        <span className="text-lg">Guests</span>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="text-sm text-gray-800 text-left font-medium bg-gray-200">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Created Date</th>
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
                <td className="px-4 py-4">{moment(user.createdAt).format('yyyy-MM-DD')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
