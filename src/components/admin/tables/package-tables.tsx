import { useState, useEffect } from 'react'
import { BiNotepad, BiEdit, BiTrash } from 'react-icons/bi'
import { useRouter } from 'next/router'
import CsvDownloader from 'react-csv-downloader'

import { fetchPostJSON } from 'libs/api-helpers'
import Modal from 'components/modal'
import Loading from 'components/loading'
import SelectBox from 'components/admin/selectbox'

export const PackageTable = (props) => {
  const { packages, packagesProducts, products, selectedKeyword = '' } = props
  const router = useRouter()

  const [filteredPackagesProducts, setFilteredPackagesProducts] = useState([])

  useEffect(() => {
    filterPackagesProducts()
  }, [selectedKeyword])

  const filterPackagesProducts = () => {
    let result = packagesProducts
    if (selectedKeyword) {
      result = result.filter(
        (item) =>
          item.package.name.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          item.product.name.toLowerCase().includes(selectedKeyword.toLowerCase()) ||
          item.product.type.toLowerCase().includes(selectedKeyword.toLowerCase()),
      )
    }

    setFilteredPackagesProducts(result)
  }

  useEffect(() => {
    const packagesForSelect = packages?.map((e) => {
      return {
        label: e.name,
        value: e.id,
      }
    })
    setPackagesForSelect(packagesForSelect)

    const productsForSelect = products?.map((e) => {
      return {
        label: e.name,
        value: e.id,
      }
    })
    setProductsForSelect(productsForSelect)

    const productTypesForSelect = [
      { label: 'BOTTLE', value: 'BOTTLE' },
      { label: 'HOOKAH', value: 'HOOKAH' },
    ]
    setProductTypesForSelect(productTypesForSelect)
  }, [])

  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedPackageProduct, setSelectedPackageProduct] = useState(null)
  const [editPackageProductModal, setEditPackageProductModal] = useState(false)
  const [editPackageProductRelationModal, setEditPackageProductRelationModal] = useState(false)
  const [newProductModal, setNewProductModal] = useState(false)
  const [confirmPackageProductModal, setConfirmPackageProductModal] = useState(false)

  const [packagesForSelect, setPackagesForSelect] = useState([])
  const [productsForSelect, setProductsForSelect] = useState([])
  const [selectedPackageForSelect, setSelectedPackageForSelect] = useState(null) //edit relation
  const [selectedProductsForSelect, setSelectedProductsForSelect] = useState([]) //edit relation
  const [productTypesForSelect, setProductTypesForSelect] = useState([]) //add product
  const [selectedProductTypeForSelect, setSelectedProductTypeForSelect] = useState(null) //add product
  const [selectedPackagesForSelect, setSelectedPackagesForSelect] = useState([]) //add product

  useEffect(() => {
    if (selectedPackageForSelect) {
      const filtered = packagesProducts?.filter(
        (e) => e.packageId === selectedPackageForSelect.value && e.isDeleted === false,
      )
      const selectedProductsForSelect = filtered.map((e) => {
        return {
          label: e.product.name,
          value: e.product.id,
        }
      })
      setSelectedProductsForSelect(selectedProductsForSelect)
    }
  }, [selectedPackageForSelect])

  const handleChangeProductName = (e) => {
    const product = { ...selectedProduct, name: e.target.value }
    setSelectedProduct(product)
  }

  const handleChangePackageProductCount = (e) => {
    const packageProduct = { ...selectedPackageProduct, count: e.target.value }
    setSelectedPackageProduct(packageProduct)
  }

  const updatePackageProduct = async () => {
    setLoading(true)
    await fetchPostJSON('/api/updatePackageProduct', {
      packageProduct: {
        packageId: selectedPackageProduct.packageId,
        productId: selectedPackageProduct.productId,
        count: Number(selectedPackageProduct.count),
      },
    })

    setLoading(false)
    setEditPackageProductModal(false)
    router.reload()
  }

  const updatePackageProductRelation = async () => {
    if (selectedPackageForSelect && selectedProductsForSelect.length > 0) {
      setLoading(true)
      Promise.all(
        packagesProducts
          .filter((e) => e.packageId === selectedPackageForSelect.value)
          .map((e) => {
            return new Promise((resolve, reject) => {
              fetchPostJSON('/api/updatePackageProduct', {
                packageProduct: {
                  packageId: e.packageId,
                  productId: e.productId,
                  isDeleted:
                    selectedProductsForSelect.findIndex((ele) => ele.value === e.productId) > -1 ? false : true,
                },
              })
                .then(() => resolve(true))
                .catch((err) => reject(err))
            })
          }),
      )
        .then(() => {
          setLoading(false)
          setEditPackageProductRelationModal(false)
          router.reload()
        })
        .catch((err) => {
          setLoading(false)
          setEditPackageProductRelationModal(false)
          console.log('update package product relation error', err)
        })
    }
  }

  const createProduct = async () => {
    if (selectedProduct?.name && selectedProductTypeForSelect && selectedPackagesForSelect.length > 0) {
      setLoading(true)
      const { data, error } = await fetchPostJSON('/api/createProduct', {
        product: {
          name: selectedProduct.name,
          type: selectedProductTypeForSelect.value,
          // price: '',
          // image: '',
        },
      })
      if (data) {
        const packagesProducts = []
        selectedPackagesForSelect.map((e) => {
          packagesProducts.push({
            packageId: e.value,
            productId: data.id,
            count: 1,
          })
        })
        await fetchPostJSON('/api/createPackageProduct', {
          packagesProducts: packagesProducts,
        })
        setLoading(false)
        setNewProductModal(false)
        router.reload()
      }
      if (error) {
        setLoading(false)
        setNewProductModal(false)
      }
    }
  }

  const deletePackageProduct = async () => {
    setLoading(true)
    await fetchPostJSON('/api/updatePackageProduct', {
      packageProduct: {
        packageId: selectedPackageProduct.packageId,
        productId: selectedPackageProduct.productId,
        isDeleted: true,
      },
    })

    setLoading(false)
    setConfirmPackageProductModal(false)
    router.reload()
  }

  const makeOutputPackage = () => {
    const columns = [
      {
        id: 'package',
        displayName: 'Package',
      },
      {
        id: 'product',
        displayName: 'Product',
      },
      {
        id: 'count',
        displayName: 'Select Count',
      },
    ]

    let datas = []
    filteredPackagesProducts
      ?.filter((e) => e.isDeleted === false)
      .map((packageProduct) => {
        datas.push({
          package: packageProduct.package.name,
          product: packageProduct.product.name,
          count: packageProduct.count,
        })
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
        <span className="text-lg">Packages</span>
        <div className="flex flex-col items-center cursor-pointer border border-gray-400 rounded-md mx-2 p-1">
          <BiNotepad />
          <CsvDownloader
            filename={`products_${new Date()}`}
            extension=".csv"
            separator="-"
            wrapColumnChar="'"
            columns={makeOutputPackage().columns}
            datas={makeOutputPackage().datas}
          >
            <button className="text-xs">Output</button>
          </CsvDownloader>
        </div>
      </div>
      <div className="flex justify-end items-center mt-4">
        <button
          className="px-4 py-2 border rounded-md"
          onClick={() => {
            setEditPackageProductRelationModal(true)
            setSelectedPackageForSelect(null)
            setSelectedProductsForSelect([])
          }}
        >
          Edit Package {'<->'} Product
        </button>
        <button
          className="px-4 py-2 border rounded-md ml-4"
          onClick={() => {
            setNewProductModal(true)
            setSelectedPackagesForSelect([])
            setSelectedProduct(null)
          }}
        >
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="text-sm text-gray-800 text-left font-medium bg-gray-200">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Package</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Select Count</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-normal text-gray-700">
            {filteredPackagesProducts
              ?.filter((e) => e.isDeleted === false)
              .map((packageProduct) => {
                key++
                return (
                  <tr key={key} className="hover:bg-gray-100 border-b border-gray-200 py-10">
                    <td className="px-4 py-4 capitalize">{key}</td>
                    <td className="px-4 py-4 capitalize">{packageProduct.package.name}</td>
                    <td className="px-4 py-4 capitalize">{packageProduct.product.name}</td>
                    <td className="px-4 py-4 capitalize">{packageProduct.product.type}</td>
                    <td className="px-4 py-4">{packageProduct.count}</td>
                    <td className="px-4 py-4 flex">
                      <BiEdit
                        onClick={() => {
                          setSelectedPackageProduct(packageProduct)
                          setEditPackageProductModal(true)
                        }}
                        className="cursor-pointer mr-2"
                      />
                      <BiTrash
                        onClick={() => {
                          setConfirmPackageProductModal(true)
                          setSelectedPackageProduct(packageProduct)
                        }}
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {editPackageProductModal && (
        <Modal setOpenModal={setEditPackageProductModal}>
          <span className="">Update Package's Product Select Count</span>
          <div className="border mt-6">
            <input
              id="count"
              className="w-full py-2 px-3 rounded text-gray-800"
              name="count"
              type="number"
              placeholder="Select Count"
              value={selectedPackageProduct?.count ?? ''}
              onChange={handleChangePackageProductCount}
            />
          </div>
          <button
            className={`bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mt-6`}
            onClick={updatePackageProduct}
          >
            Submit
          </button>
        </Modal>
      )}

      {editPackageProductRelationModal && (
        <Modal setOpenModal={setEditPackageProductRelationModal}>
          <span className="">Edit Package Product Relation</span>
          <div className="w-96 mt-6">
            <div className="mt-4">
              <SelectBox
                id="package-selector"
                options={packagesForSelect}
                selectedOption={selectedPackageForSelect}
                setSelectedOption={setSelectedPackageForSelect}
                backColor="transparent"
                placeholder="Select Package"
              />
            </div>
            <div className="mt-6">
              <SelectBox
                id="products-selector"
                isMulti={true}
                options={productsForSelect}
                selectedOption={selectedProductsForSelect}
                setSelectedOption={setSelectedProductsForSelect}
                backColor="transparent"
                placeholder="Select products"
              />
            </div>
          </div>
          <button
            className={`bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mt-6`}
            onClick={updatePackageProductRelation}
          >
            Submit
          </button>
        </Modal>
      )}

      {newProductModal && (
        <Modal setOpenModal={setNewProductModal}>
          <span className="">Create New Product</span>
          <div className="w-96 mt-6">
            <div className="border">
              <input
                id="product-name"
                className="w-full py-2 px-3 rounded text-gray-800"
                name="product-name"
                type="text"
                placeholder="product name"
                value={selectedProduct?.name ?? ''}
                onChange={handleChangeProductName}
              />
            </div>
            <div className="mt-4">
              <SelectBox
                id="type-selector"
                options={productTypesForSelect}
                selectedOption={selectedProductTypeForSelect}
                setSelectedOption={setSelectedProductTypeForSelect}
                backColor="transparent"
                placeholder="Select type"
              />
            </div>
            <div className="mt-4">
              <SelectBox
                id="package-selector"
                isMulti={true}
                options={packagesForSelect}
                selectedOption={selectedPackagesForSelect}
                setSelectedOption={setSelectedPackagesForSelect}
                backColor="transparent"
                placeholder="Select packages"
              />
            </div>
          </div>
          <button
            className={`bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mt-6`}
            onClick={createProduct}
          >
            Submit
          </button>
        </Modal>
      )}

      {confirmPackageProductModal && (
        <Modal setOpenModal={setConfirmPackageProductModal}>
          <div>
            <span>Are you sure to remove {selectedPackageProduct.product.name}?</span>
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mx-2"
                onClick={() => setConfirmPackageProductModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-700 hover:bg-blue-500 px-4 py-2 rounded-md text-white mx-2"
                onClick={() => deletePackageProduct()}
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
