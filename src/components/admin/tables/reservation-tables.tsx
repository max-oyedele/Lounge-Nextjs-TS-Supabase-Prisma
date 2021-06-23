import { useState, useEffect } from 'react'
import { BiNotepad } from 'react-icons/bi'
import CsvDownloader from 'react-csv-downloader'

import { getSection, getPackage, getUser, getProductOption } from 'utils/get-data'
import { isSameDate } from 'utils'

export const ReservationTable = (props) => {
  const { users, sections, packages, orders, productOptions, selectedKeyword, selectedDate } = props
  const [filteredOrders, setFilteredOrders] = useState([])

  useEffect(() => {
    filterOrders()
  }, [selectedKeyword, selectedDate])

  const filterOrders = () => {
    let result = orders
    if (selectedKeyword) {
      result = result.filter(
        (e) =>
          getUser(users, e)?.name.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          getSection(sections, e)?.name.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          getPackage(packages, e)?.name.toLowerCase().includes(selectedKeyword.toLowerCase()),
      )
    }
    if (selectedDate) {
      result = result.filter((e) => isSameDate(selectedDate, e.date))
    }
    setFilteredOrders(result)
  }

  const makeOutputReservation = () => {
    const columns = [
      {
        id: 'user',
        displayName: 'Client',
      },
      {
        id: 'date',
        displayName: 'Reservation Date',
      },
      {
        id: 'section',
        displayName: 'Section',
      },
      {
        id: 'package',
        displayName: 'Package',
      },
      {
        id: 'people',
        displayName: 'People Number',
      },
      {
        id: 'product',
        displayName: 'Product',
      },
    ]

    let datas = []
    filteredOrders.map((order) => {
      datas.push({
        user: getUser(users, order)?.name,
        date: order.date,
        section: getSection(sections, order)?.name,
        package: getPackage(packages, order)?.name,
        people: order.people,
        product: order.orderDetails.map((detail) => getProductOption(productOptions, detail)?.name).join(';'),
      })
    })

    return {
      columns: columns,
      datas: datas,
    }
  }

  return (
    <div className="bg-white p-4 rounded-md w-full mt-10">
      <div className="flex justify-between items-center">
        <span className="text-lg">Reservation</span>
        <div className="flex flex-col items-center cursor-pointer border border-gray-400 rounded-md mx-2 p-1">
          <BiNotepad />
          <CsvDownloader
            filename={`reservation_${new Date()}`}
            extension=".csv"
            separator="-"
            wrapColumnChar="'"
            columns={makeOutputReservation().columns}
            datas={makeOutputReservation().datas}
          >
            <button className="text-xs">Output</button>
          </CsvDownloader>
        </div>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="text-sm text-gray-800 text-left font-medium bg-gray-200">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Section</th>
              <th className="px-4 py-2">Package</th>
              <th className="px-4 py-2">People</th>
              <th className="px-4 py-2 text-center">Product</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {filteredOrders?.map((order, index) => (
              <tr key={index} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                <td className="px-4 py-4">{index + 1}</td>
                <td className="px-4 py-4">{getUser(users, order)?.name}</td>
                <td className="px-4 py-4">{order.date}</td>
                <td className="px-4 py-4 capitalize">{getSection(sections, order)?.name}</td>
                <td className="px-4 py-4 capitalize">{getPackage(packages, order)?.name}</td>
                <td className="px-4 py-4">{order.people}</td>
                <td className="px-4 py-4">
                  {getPackage(packages, order)?.packageProducts?.map((item, index) => {
                    const isProductSelected = order.orderDetails.find((e) => e.productId === item.product.id)
                    if (!isProductSelected) return null
                    return (
                      <div key={index} className="mt-2">
                        <div className="flex justify-center items-center">
                          <span className="text-md capitalize">
                            {item.product.name ?? item.product.type + (index + 1)}
                          </span>
                        </div>
                        <div className="flex flex-wrap justify-center">
                          {item.product.options?.map((option, index) => {
                            const isProductOptionSelected = order.orderDetails.find(
                              (e) => e.productOptionId === option.id,
                            )
                            return (
                              <div
                                key={index}
                                className={`flex justify-center items-center border border-gray-200 rounded-md capitalize text-xs m-1 px-2 py-1 ${
                                  isProductOptionSelected ? 'bg-green-700 text-white' : ''
                                }`}
                              >
                                {option.name}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
