import moment from 'moment'
import { getFormatPrice } from 'utils'
import ReactPayPal from 'components/react-paypal'

const TicketCard = (props) => {
  const {
    user,
    selectedDate,
    selectedSection,
    selectedPackage,
    selectedPeople,
    orderDetails,
    setConfirmModal,
    paymentWithStripe,
  } = props

  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold">~ Reservation ~</span>
      <div className="flex space-x-2">
        <div className="flex flex-col items-end">
          <span className="block h-6 text-md mt-4">Date:</span>
          <span className="block h-6 text-md mt-4">Email Account:</span>
          <span className="block h-6 text-md mt-4">Section:</span>
          <span className="block h-6 text-md mt-4">Package:</span>
          <span className="block h-6 text-md mt-4">Number of Guests:</span>
          <span className="block h-6 text-md mt-4">Products:</span>
          <span className="block h-6 text-md mt-4">Price:</span>
          <span className="block h-6 text-md mt-4">Gratuity:</span>
          <span className="block h-6 text-md mt-4">Total:</span>
          {/* {selectedPackage?.packageProducts?.map((item, index) => {
            const isProductSelected = orderDetails.filter((e) => e.productId === item.product.id).length > 0
            if (!isProductSelected) return null
            return (
              <span key={index} className="block h-6 text-md capitalize mt-4">
                {item.product.name}:
              </span>
            )
          })} */}
        </div>
        <div className="flex flex-col font-semibold">
          <span className="block h-6 text-md mt-4">{moment(selectedDate).format('yyyy-MM-DD')}</span>
          <span className="block h-6 text-md mt-4">{user.email}</span>
          <span className="block h-6 text-md mt-4 capitalize">{selectedSection?.name}</span>
          <span className="block h-6 text-md mt-4 capitalize">{selectedPackage?.name}</span>
          <span className="block h-6 text-md mt-4">{selectedPeople}</span>
          <div className="h-6 flex items-center mt-4">
            {selectedPackage?.packageProducts?.map((item, index) => {
              const isProductSelected = orderDetails.filter((e) => e.productId === item.product.id).length > 0
              if (!isProductSelected) return null
              return (
                <div key={index} className="text-md capitalize truncate mx-1 px-1 border rounded-md">
                  {item.product.name}
                </div>
              )
            })}
          </div>
          <span className="block h-6 text-md mt-4">{getFormatPrice(selectedPackage?.price, 'USD')}</span>
          <span className="block h-6 text-md mt-4 capitalize">{selectedPackage?.gratuity}%</span>
          <span className="block h-6 text-md mt-4">
            {getFormatPrice(selectedPackage?.price + (selectedPackage?.price * selectedPackage?.gratuity) / 100, 'USD')}
          </span>
          {/* {selectedPackage?.packageProducts?.map((item, index) => {
            const isProductSelected = orderDetails.filter((e) => e.productId === item.product.id).length > 0
            if (!isProductSelected) return null
            return (
              <div key={index} className="h-6 flex items-center mt-4">
                {item.product.options.map((option, index) => {
                  const isProductOptionSelected = orderDetails.filter((e) => e.productOptionId === option.id).length > 0
                  if (!isProductOptionSelected) return null
                  return (
                    <div key={index} className="text-md capitalize truncate mx-1 px-1 border rounded-md">
                      {option.name}
                    </div>
                  )
                })}
              </div>
            )
          })} */}
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
