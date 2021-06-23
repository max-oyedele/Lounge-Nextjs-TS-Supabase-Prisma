import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const CDatePicker = (props) => {
  const { selectedDate, setSelectedDate, minDate={} } = props
     
  return (
    <div className="w-full h-10 flex items-center rounded-md border border-gray-400 px-2">
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        className="w-full bg-transparent"
        placeholderText="Select Date"
        minDate={minDate}
      />
    </div>
  )
}

export default CDatePicker
