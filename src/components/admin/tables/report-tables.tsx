import { useState, useEffect } from 'react'
import { BiNotepad } from 'react-icons/bi'
import CsvDownloader from 'react-csv-downloader'

import { getSection, getPackage, getServer, getProductOptionSoldAmount } from 'utils/get-data'
import { isSameDate } from 'utils'

export const SalesTable = (props) => {
  const { users, sections, packages, orders, selectedKeyword, selectedDate } = props
  const [filteredOrders, setFilteredOrders] = useState([])

  useEffect(() => {
    filterOrders()
  }, [selectedKeyword, selectedDate])

  const filterOrders = () => {
    let result = orders
    if (selectedKeyword) {
      result = result.filter(
        (e) =>
          getServer(users, e)?.name.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          getSection(sections, e)?.name.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          getPackage(packages, e)?.name.toLowerCase().includes(selectedKeyword.toLowerCase()),
      )
    }
    if (selectedDate) {
      result = result.filter((e) => isSameDate(selectedDate, e.date))
    }
    setFilteredOrders(result)
  }

  const makeOutputSale = () => {
    const columns = [
      {
        id: 'server',
        displayName: 'Server',
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
    ]

    let datas = []
    filteredOrders?.filter((e) => e.serverId).map((order) => {
      datas.push({
        server: getServer(users, order)?.name,
        date: order.date,
        section: getSection(sections, order)?.name,
        package: getPackage(packages, order)?.name,
        people: order.people,
      })
    })

    return {
      columns: columns,
      datas: datas,
    }
  }

  return (
    <div className="bg-white p-4 rounded-md w-full">
      <div className="flex justify-between items-center">
        <span className="text-lg">Sales</span>
        <div className="flex flex-col items-center cursor-pointer border border-gray-400 rounded-md mx-2 p-1">
          <BiNotepad />
          <CsvDownloader
            filename={`sale_${new Date()}`}
            extension=".csv"
            separator="-"
            wrapColumnChar="'"
            columns={makeOutputSale().columns}
            datas={makeOutputSale().datas}
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
              <th className="px-4 py-2">Server</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Section</th>
              <th className="px-4 py-2">Package</th>
              <th className="px-4 py-2">People</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {filteredOrders
              ?.filter((e) => e.serverId)
              .map((order, index) => (
                <tr key={index} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                  <td className="px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4">{getServer(users, order)?.name}</td>
                  <td className="px-4 py-4 capitalize">{order.date}</td>
                  <td className="px-4 py-4 capitalize">{getSection(sections, order)?.name}</td>
                  <td className="px-4 py-4 capitalize">{getPackage(packages, order)?.name}</td>
                  <td className="px-4 py-4 capitalize">{order.people}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const InventoryTable = (props) => {
  const { products, orderDetails } = props

  const makeOutputInventory = () => {
    const columns = [
      {
        id: 'product',
        displayName: 'Product',
      },
      {
        id: 'option',
        displayName: 'Name',
      },
      {
        id: 'sold',
        displayName: 'Sold',
      },
      {
        id: 'balance',
        displayName: 'Balance',
      },
    ]

    let datas = []
    products?.map((product) => {
      product?.options
        ?.filter((e) => e.isDeleted === false)
        .map((option) => {
          datas.push({
            product: product.name,
            option: option.name,
            sold: getProductOptionSoldAmount(orderDetails, option),
            balance: option.balance,
          })
        })
    })

    return {
      columns: columns,
      datas: datas,
    }
  }

  return (
    <div className="bg-white p-4 rounded-md w-full">
      <div className="flex justify-between items-center">
        <span className="text-lg">Inventory</span>
        <div className="flex flex-col items-center cursor-pointer border border-gray-400 rounded-md mx-2 p-1">
          <BiNotepad />
          <CsvDownloader
            filename={`inventory_${new Date()}`}
            extension=".csv"
            separator="-"
            wrapColumnChar="'"
            columns={makeOutputInventory().columns}
            datas={makeOutputInventory().datas}
          >
            <button className="text-xs">Output</button>
          </CsvDownloader>
        </div>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="text-sm text-gray-800 text-left font-medium bg-gray-200">
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Option</th>
              <th className="px-4 py-2">Sold</th>
              <th className="px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {products?.map((product, index) =>
              product?.options
                ?.filter((e) => e.isDeleted === false)
                .map((option, oIndex) => (
                  <tr key={index + '-' + oIndex} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                    <td className="px-4 py-4 capitalize">{product.name}</td>
                    <td className="px-4 py-4 capitalize">{option.name}</td>
                    <td className="px-4 py-4 capitalize">{getProductOptionSoldAmount(orderDetails, option)}</td>
                    <td className="px-4 py-4 capitalize">{option.balance}</td>
                  </tr>
                )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
