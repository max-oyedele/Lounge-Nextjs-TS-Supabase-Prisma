import { getFormatPrice } from 'utils'

const PackageCard = (props) => {
  const { packageItem } = props
  const {
    selectedPackage,
    setSelectedPackage,
    selectedPeople,
    setSelectedPeople,
    selectedProductIds,
    setSelectedProductIds,
    selectedProductOptionIds,
    setSelectedProductOptionIds,
  } = props

  const textToneColor =
    packageItem.name === 'silver'
      ? 'text-gray-700'
      : packageItem.name === 'gold'
      ? 'text-yellow-700'
      : 'text-purple-700'
  const bgToneColor =
    packageItem.name === 'silver' ? 'bg-gray-700' : packageItem.name === 'gold' ? 'bg-yellow-700' : 'bg-purple-700'
  const borderToneColor =
    packageItem.name === 'silver'
      ? 'border-gray-700'
      : packageItem.name === 'gold'
      ? 'border-yellow-700'
      : 'border-purple-700'

  return (
    <div
      className={`relative flex flex-col items-center border-2 border-dashed rounded-lg mt-6 p-2 pb-32 cursor-pointer transition duration-200 ease-in-out transform hover:-translate-y-2 ${borderToneColor} ${
        selectedPackage?.id === packageItem.id ? 'ring-2 ring-offset-2 ring-green-700' : ''
      }`}
      onClick={() => {
        if (selectedPackage?.id !== packageItem.id) {
          setSelectedPackage(packageItem)
          setSelectedPeople(null)
          setSelectedProductIds([])
          setSelectedProductOptionIds([])
        }
      }}
    >
      <span className={`text-3xl font-bold uppercase ${textToneColor}`}>{packageItem.name}</span>
      <hr className="w-11/12 my-2" />
      <div className="w-full flex flex-col items-center">
        <span className="text-lg">
          Max Number of People: <b>{packageItem.maxPeople}</b>
        </span>
        <span className="text-lg mt-2">
          Number of Bootles:{' '}
          <b>{packageItem.packageProducts?.filter((item) => item.product.type === 'BOTTLE').length}</b>
        </span>
        <span className="text-lg mt-2">
          Number of Hookahs:{' '}
          <b>{packageItem.packageProducts?.filter((item) => item.product.type === 'HOOKAH').length}</b>
        </span>

        <hr className="w-11/12 my-2" />
        <div className="flex flex-wrap">
          {Array(packageItem.maxPeople)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`w-6 h-6 flex justify-center items-center rounded-full cursor-pointer m-2 ${
                  selectedPackage?.id === packageItem.id && selectedPeople == index + 1 ? 'bg-green-700' : 'bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedPackage?.id !== packageItem.id) {
                    setSelectedPackage(packageItem)
                    setSelectedProductIds([])
                    setSelectedProductOptionIds([])
                    setSelectedPeople(index + 1)
                  } else setSelectedPeople(index + 1)
                }}
              >
                {index + 1}
              </div>
            ))}
        </div>

        <hr className="w-11/12 mt-2" />
        {packageItem.packageProducts?.map((item, index) => {
          const existedIndex = selectedProductIds?.findIndex((e) => e === item.product.id)
          const isSelected = packageItem.id === selectedPackage?.id && existedIndex > -1

          return (
            <div key={index} className="mt-4">
              <div className="flex justify-center items-center">
                <div
                  className={`flex justify-center items-center border border-gray-300 rounded-md cursor-pointer capitalize px-2 py-1 ${
                    isSelected ? 'bg-green-700 text-white' : ''
                  }`}
                  onClick={() => {
                    const existedIndex = selectedProductIds?.findIndex((e) => e == item.product.id)
                    if (existedIndex > -1) {
                      // already selected => remove
                      const newArr = selectedProductIds
                      newArr.splice(existedIndex, 1)
                      setSelectedProductIds(newArr)
                    } else {
                      // add new product
                      const newArr = selectedProductIds
                      setSelectedProductIds([...newArr, item.product.id])
                    }
                  }}
                >
                  {item.product.image && (
                    <img src={item.product.image} className="object-contain w-12 h-12 mr-2" alt="product" />
                  )}
                  
                  {item.count} {item.product.name ?? item.product.type + (index + 1)}
                </div>
              </div>
              <div className="flex flex-wrap justify-center">
                {item.product.options?.map((option, index) => {
                  const isSelected =
                    selectedPackage?.id === packageItem.id && selectedProductOptionIds?.includes(option.id)
                  return (
                    <div
                      key={index}
                      className={`flex justify-center items-center rounded-md cursor-pointer capitalize m-2 px-2 py-1 ${
                        isSelected ? 'bg-green-700 text-white' : ''
                      }`}
                      // onClick={() => {
                      //   if (selectedPackage?.id !== packageItem.id) {
                      //     setSelectedPackage(packageItem)
                      //     setSelectedPeople(null)
                      //     setSelectedProductIds([])
                      //     setSelectedProductOptionIds([])
                      //   } else {
                      //     const existedIndex = selectedProductOptionIds?.findIndex((e) => e == option.id)
                      //     if (existedIndex > -1) {
                      //       // already selected => remove
                      //       const newArr = selectedProductOptionIds
                      //       newArr.splice(existedIndex, 1)
                      //       setSelectedProductOptionIds(newArr)
                      //     } else {
                      //       //remove other option ids on the same product
                      //       const newArr = selectedProductOptionIds

                      //       item.product.options.forEach((everyOption) => {
                      //         if (option.id != everyOption.id) {
                      //           const everyIndex = selectedProductOptionIds?.findIndex((e) => e == everyOption.id)
                      //           if (everyIndex > -1) newArr.splice(everyIndex, 1)
                      //         }
                      //       })
                      //       //push new optionId
                      //       setSelectedProductOptionIds([...newArr, option.id])
                      //     }
                      //   }
                      // }}
                    >
                      {option.name}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className={`absolute bottom-0 w-full flex justify-center items-center rounded-lg p-3 ${bgToneColor}`}>
        <span className={`text-2xl text-white font-semibold pl-2`}>{getFormatPrice(packageItem.price, 'USD')}</span>
      </div>
    </div>
  )
}

export default PackageCard
