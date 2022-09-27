import React from "react"

const Modal = ({ children, className }) => {
  return (
    <div className={`modal ${className}`}>
      <div className="modal-content">{children}</div>
    </div>
  )
}

export default Modal
