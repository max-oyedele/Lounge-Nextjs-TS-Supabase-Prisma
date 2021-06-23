import React, { Fragment } from "react"
import ClipLoader from "react-spinners/ClipLoader";

const Loading = props => {
  return (
    <Fragment>
      {
        props.loading &&
        <div style={{
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',          
          zIndex: 3000,
        }}>
          <ClipLoader
            size={35}
            color={"#123abc"}
          />
        </div>
      }
    </Fragment>
  )
}

export default Loading