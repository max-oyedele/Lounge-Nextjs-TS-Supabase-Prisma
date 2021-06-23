import ClickAwayListener from 'react-click-away-listener';

const Modal = (props) => {
  const handleClickAway = () => {
    props.setOpenModal(false)
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col justify-center items-center z-10 bg-gray-400 bg-opacity-50">
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="flex flex-col justify-center items-center bg-white rounded-md p-10">
          {props.children}
        </div>
      </ClickAwayListener>
    </div>
  )
}

export default Modal