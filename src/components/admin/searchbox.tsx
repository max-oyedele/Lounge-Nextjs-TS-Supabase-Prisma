import { BiSearch } from 'react-icons/bi'

const SearchBox = (props) => {
  const { selectedKeyword, setSelectedKeyword } = props

  return (
    <div className="w-full h-10 flex items-center">
      <BiSearch className="text-gray-500 m-2" />
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent text-gray-800 pl-2"
        value={selectedKeyword??''}
        onChange={(e) => setSelectedKeyword(e.target.value)}
      />
    </div>
  )
}

export default SearchBox
