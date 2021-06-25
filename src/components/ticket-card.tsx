import moment from 'moment'
import { getFormatPrice } from 'utils'
import ReactPayPal from 'components/react-paypal'

const TicketCard = (props) => {
  const {
    user,
    selectedDate,
    selectedSection,
    selectedPackage,
    guestNames,
    orderDetails,
    setConfirmModal,
    paymentWithStripe,
  } = props

  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold mb-6">~ Reservation ~</span>
      <div className="w-full grid grid-cols-6 gap-2">
        <div className="col-span-2 flex justify-end text-md text-gray-800">Date:</div>
        <div className="col-span-4 text-md text-gray-800">{moment(selectedDate).format('yyyy-MM-DD')}</div>
      </div>
      <div className="w-full grid grid-cols-6 gap-2 mt-4">
        <div className="col-span-2 flex justify-end text-md text-gray-800">Email:</div>
        <div className="col-span-4 text-md text-gray-800">{user.email}</div>
      </div>
      <div className="w-full grid grid-cols-6 gap-2 mt-4">
        <div className="col-span-2 flex justify-end text-md text-gray-800">Section:</div>
        <div className="col-span-4 text-md text-gray-800">{selectedSection?.name}</div>
      </div>
      <div className="w-full grid grid-cols-6 gap-2 mt-4">
        <div className="col-span-2 flex justify-end text-md text-gray-800">Package:</div>
        <div className="col-span-4 text-md text-gray-800">{selectedPackage?.name}</div>
      </div>
      <div className="w-full grid grid-cols-6 gap-2 mt-4">
        <div className="col-span-2 flex justify-end text-md text-gray-800">Guests:</div>
        <div className="col-span-4 text-md text-gray-800">{guestNames.filter((e) => e !== undefined).join(', ')}</div>
      </div>
      {selectedPackage?.packageProducts?.map((item, index) => {
        const isProductSelected = orderDetails.filter((e) => e.productId === item.product.id).length > 0
        if (!isProductSelected) return null
        return (
          <div key={index} className="w-full grid grid-cols-6 gap-2 mt-4">
            <div className="col-span-2 flex justify-end text-md text-gray-800 capitalize">{item.product.name}:</div>
            <div className="col-span-4 flex text-md text-gray-800">
              {item.product.options.map((option, index) => {
                const isProductOptionSelected = orderDetails.filter((e) => e.productOptionId === option.id).length > 0
                if (!isProductOptionSelected) return null
                return (
                  <div key={index} className="text-md text-gray-800 capitalize truncate mr-1 px-1 border rounded-md">
                    {option.name}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="w-full grid grid-cols-6 gap-2 mt-4">
        <div className="col-span-2 flex justify-end text-md text-gray-800">Price:</div>
        <div className="col-span-4 text-md text-gray-800">{getFormatPrice(selectedPackage?.price, 'USD')}</div>
      </div>
      <div className="w-full grid grid-cols-6 gap-2 mt-4">
        <div className="col-span-2 flex justify-end text-md text-gray-800">Gratuity:</div>
        <div className="col-span-4 text-md text-gray-800">{selectedPackage?.gratuity}%</div>
      </div>
      <div className="w-full grid grid-cols-6 gap-2 mt-4">
        <div className="col-span-2 flex justify-end text-md text-gray-800">Total:</div>
        <div className="col-span-4 text-md text-gray-800">
          {getFormatPrice(selectedPackage?.price + (selectedPackage?.price * selectedPackage?.gratuity) / 100, 'USD')}
        </div>
      </div>

      <button
        className={`h-11 hover:bg-blue-500 rounded px-5 py-2 text-md text-white font-semibold mt-10`}
        onClick={() => {
          setConfirmModal(false)
          paymentWithStripe(selectedPackage?.price + (selectedPackage?.price * selectedPackage?.gratuity) / 100)
        }}
        style={{ backgroundColor: '#0070ba' }}
      >
        Pay With Stripe
      </button>

      <div className="mt-4">
        {/* <ReactPayPal amount={selectedPackage?.price + (selectedPackage?.price * selectedPackage?.gratuity) / 100} /> */}
        <ReactPayPal amount={5} />
      </div>
    </div>
  )
}

export default TicketCard
