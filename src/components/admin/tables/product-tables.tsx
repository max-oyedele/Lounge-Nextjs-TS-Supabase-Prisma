import { useState, useEffect } from 'react'
import { BiNotepad, BiEdit, BiTrash } from 'react-icons/bi'
import { useRouter } from 'next/router'
import CsvDownloader from 'react-csv-downloader'

import { fetchPostJSON } from 'libs/api-helpers'
import Modal from 'components/modal'
import Loading from 'components/loading'
import SelectBox from 'components/admin/selectbox'

export const ProductTable = (props) => {
  const { products, selectedKeyword = '' } = props
  const router = useRouter()

  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    filterProducts()
  }, [selectedKeyword])

  const filterProducts = () => {
    let result = products
    if (selectedKeyword) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          product.options.filter((e) => e.name.toLowerCase().includes(selectedKeyword.toLowerCase())),
      )
    }
    setFilteredProducts(result)
  }

  useEffect(()=>{
    const productsForSelect = products.map(e=>{return {
      label: e.name,
      value: e.id
    }})
    setProductsForSelect(productsForSelect)
  }, [])

  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [editProductModal, setEditProductModal] = useState(false)
  const [editOptionModal, setEditOptionModal] = useState(false)
  const [confirmProductModal, setConfirmProductModal] = useState(false)
  const [confirmOptionModal, setConfirmOptionModal] = useState(false)
  
  const [newOptionModal, setNewOptionModal] = useState(false)
  const [productsForSelect, setProductsForSelect] = useState([])
  const [selectedProductForSelect, setSelectedProductForSelect] = useState(null)

  const handleChangeProductName = (e) => {
    const product = { ...selectedProduct, name: e.target.value }
    setSelectedProduct(product)
  }

  const handleChangeOptionName = (e) => {
    const option = { ...selectedOption, name: e.target.value }
    setSelectedOption(option)
  }

  const handleChangeBalance = (e) => {
    const option = { ...selectedOption, balance: e.target.value }
    setSelectedOption(option)
  }

  const updateProduct = async () => {
    setLoading(true)
    await fetchPostJSON('/api/updateProduct', {
      product: { id: selectedProduct.id, name: selectedProduct.name },
    })

    setLoading(false)
    setEditProductModal(false)
    router.reload()
  }

  const updateOption = async () => {
    setLoading(true)
    await fetchPostJSON('/api/updateProductOption', {
      option: { id: selectedOption.id, name: selectedOption.name, balance: Number(selectedOption.balance) },
    })

    setLoading(false)
    setEditOptionModal(false)
    router.reload()
  }

  const createOption = async () => {
    if (selectedProductForSelect && selectedOption?.name) {
      setLoading(true)
      await fetchPostJSON('/api/createProductOption', {
        option: {
          name: selectedOption.name,
          balance: Number(selectedOption.balance),
          productId: selectedProductForSelect.value,
          isDeleted: false,
        },
      })

      setLoading(false)
      setNewOptionModal(false)
      router.reload()
    }
  }

  const deleteProduct = async () => {
    setLoading(true)
    await fetchPostJSON('/api/updateProduct', {
      product: { id: selectedProduct.id, isDeleted: true },
    })

    setLoading(false)
    setConfirmProductModal(false)
    router.reload()
  }

  const deleteOption = async () => {
    setLoading(true)
    await fetchPostJSON('/api/updateProductOption', {
      option: { id: selectedOption.id, isDeleted: true },
    })

    setLoading(false)
    setConfirmOptionModal(false)
    router.reload()
  }

  const makeOutputProduct = () => {
    const columns = [
      {
        id: 'product',
        displayName: 'Product',
      },
      {
        id: 'option',
        displayName: 'Product Option',
      },
      {
        id: 'balance',
        displayName: 'Balance',
      },
    ]

    let datas = []
    filteredProducts
      ?.filter((e) => e.isDeleted === false)
      .map((product) => {
        const isOptionsExisted = product.options.filter((e) => e.isDeleted === false).length > 0
        if (isOptionsExisted) {
          product.options
            .filter((e) => e.isDeleted === false)
            .map((option) => {
              datas.push({
                product: product.name,
                option: option.name,
                balance: option.balance,
              })
            })
        } else {
          datas.push({
            product: product.name,
          })
        }
      })

    return {
      columns: columns,
      datas: datas,
    }
  }

  let key = 0

  return (
    <div className="bg-white p-4 rounded-md w-full">
      <Loading loading={loading} />
      <div className="flex justify-between items-center">
        <span className="text-lg">Products</span>
        <div className="flex flex-col items-center cursor-pointer border border-gray-400 rounded-md mx-2 p-1">
          <BiNotepad />
          <CsvDownloader
            filename={`products_${new Date()}`}
            extension=".csv"
            separator="-"
            wrapColumnChar="'"
            columns={makeOutputProduct().columns}
            datas={makeOutputProduct().datas}
          >
            <button className="text-xs">Output</button>
          </CsvDownloader>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4">
        <button
          className="px-4 py-2 border rounded-md"
          onClick={() => {
            setNewOptionModal(true)
            setSelectedProductForSelect(null)
            setSelectedOption(null)
          }}
        >
          Add Option
        </button>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="text-sm text-gray-800 text-left font-medium bg-gray-200">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Option</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {filteredProducts
              ?.filter((e) => e.isDeleted === false)
              .map((product) => {
                const isOptionsExisted = product.options.filter((e) => e.isDeleted === false).length > 0
                if (isOptionsExisted) {//product having options
                  return product.options
                    .filter((e) => e.isDeleted === false)
                    .map((option) => {
                      key++
                      return (
                        <tr key={option.id} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                          <td className="px-4 py-4 capitalize">{key}</td>
                          <td className="px-4 py-4 capitalize">{product.name}</td>
                          <td className="px-4 py-4 capitalize">{option.name}</td>
                          <td className="px-4 py-4">{option.balance}</td>
                          <td className="px-4 py-4 flex">
                            <BiEdit
                              onClick={() => {
                                setEditOptionModal(true)
                                setSelectedOption(option)
                              }}
                              className="cursor-pointer mr-2"
                            />
                            <BiTrash
                              onClick={() => {
                                setConfirmOptionModal(true)
                                setSelectedOption(option)
                              }}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      )
                    })
                } else {//only product
                  key++
                  return (
                    <tr key={product.id} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                      <td className="px-4 py-4 capitalize">{key}</td>
                      <td className="px-4 py-4 capitalize">{product.name}</td>
                      <td className="px-4 py-4 capitalize">{}</td>
                      <td className="px-4 py-4">{}</td>
                      <td className="px-4 py-4 flex">
                        <BiEdit
                          onClick={() => {
                            setEditProductModal(true)
                            setSelectedProduct(product)
                          }}
                          className="cursor-pointer mr-2"
                        />
                        {/* <BiTrash
                          onClick={() => {
                            setConfirmProductModal(true)
                            setSelectedProduct(product)
                          }}
                          className="cursor-pointer"
                        /> */}
                      </td>
                    </tr>
                  )
                }
              })}
          </tbody>
        </table>
      </div>

      {editProductModal && (
        <Modal setOpenModal={setEditProductModal}>
          <span className="">Update Product's Name</span>
          <div className="border mt-6">
            <input
              id="product-name"
              className="w-full py-2 px-3 rounded text-gray-800"
              name="product-name"
              type="text"
              placeholder="product name"
              value={selectedProduct?.name}
              onChange={handleChangeProductName}
            />
          </div>
          <button
            className={`bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mt-6`}
            onClick={updateProduct}
          >
            Submit
          </button>
        </Modal>
      )}

      {editOptionModal && (
        <Modal setOpenModal={setEditOptionModal}>
          <span className="">Update Option's Name and Balance</span>
          <div className="border mt-6">
            <input
              id="name"
              className="w-full py-2 px-3 rounded text-gray-800"
              name="name"
              type="text"
              placeholder="name"
              value={selectedOption?.name}
              onChange={handleChangeOptionName}
            />
          </div>
          <div className="border mt-6">
            <input
              id="balance"
              className="w-full py-2 px-3 rounded text-gray-800"
              name="balance"
              type="number"
              placeholder="balance"
              value={selectedOption?.balance}
              onChange={handleChangeBalance}
            />
          </div>
          <button
            className={`bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mt-6`}
            onClick={updateOption}
          >
            Submit
          </button>
        </Modal>
      )}

      {newOptionModal && (
        <Modal setOpenModal={setNewOptionModal}>
          <span className="">Create New Option</span>
          <div className="mt-6">
            <SelectBox
              id="type-selector"
              options={productsForSelect}
              selectedOption={selectedProductForSelect}
              setSelectedOption={setSelectedProductForSelect}
              backColor="transparent"
              placeholder="Select product"
            />
          </div>
          <div className="border mt-6">
            <input
              id="option-name"
              className="w-full py-2 px-3 rounded text-gray-800"
              name="option-name"
              type="text"
              placeholder="option name"
              value={selectedOption?.name ?? ''}
              onChange={handleChangeOptionName}
            />
          </div>
          <div className="border mt-6">
            <input
              id="balance"
              className="w-full py-2 px-3 rounded text-gray-800"
              name="balance"
              type="number"
              placeholder="balance"
              value={selectedOption?.balance ?? ''}
              onChange={handleChangeBalance}
            />
          </div>
          <button
            className={`bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mt-6`}
            onClick={createOption}
          >
            Submit
          </button>
        </Modal>
      )}

      {confirmProductModal && (
        <Modal setOpenModal={setConfirmProductModal}>
          <div>
            <span>Are you sure to delete {selectedProduct.name}?</span>
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mx-2"
                onClick={() => setConfirmProductModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mx-2"
                onClick={() => deleteProduct()}
              >
                Yes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmOptionModal && (
        <Modal setOpenModal={setConfirmOptionModal}>
          <div>
            <span>Are you sure to delete {selectedOption.name}?</span>
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mx-2"
                onClick={() => setConfirmOptionModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mx-2"
                onClick={() => deleteOption()}
              >
                Yes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
