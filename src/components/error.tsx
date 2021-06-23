import React from "react"
import Modal from './modal'

const Error = props => {
  const {error, setError} = props
  return (
    <Modal setOpenModal={setError}>
      <div className="flex flex-col items-center rounded-lg">
        <img src="/icons/error.svg" alt="error" className="w-10 h-10"/>
        <span className="text-lg mt-4">{error}</span>
      </div>
    </Modal>
  )
}

export default Error