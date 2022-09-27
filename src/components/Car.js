import React from "react"

const Car = ({ car, onClick }) => {
  return (
    <div className="car" onClick={onClick}>
      <p className="car-name">{car.model}</p>
    </div>
  )
}

export default Car
