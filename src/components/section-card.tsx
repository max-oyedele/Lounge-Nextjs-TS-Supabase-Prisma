const SectionCard = (props) => {
  const { section } = props
  const { reserved, selectedSection, setSelectedSection } = props

  return (
    <div
      className={`grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 border rounded-xl transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
        reserved ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={() => {
        !reserved && setSelectedSection(section)
      }}
    >
      <div className="">
        <img src={section.image} className="object-cover w-full h-full rounded-l-xl" alt="section_image" />
      </div>
      <div className="relative flex flex-col justify-center items-center">
        {reserved && (
          <img src="/icons/section_reserved.svg" className="absolute top-1 right-2 object-cover w-8" alt="reserved" />
        )}
        {section.id === selectedSection?.id && (
          <img src="/icons/section_selected.svg" className="absolute top-1 right-2 object-cover w-8" alt="selected" />
        )}
        <span className="font-bold text-3xl capitalize truncate">{section.name}</span>
      </div>
    </div>
  )
}

export default SectionCard
