import React, { useState } from "react"
import Car from "./Car"
import Modal from "./Modal"

const GQL_URL = "https://localhost:7213/graphql"

const Brand = ({
  brand,
  onDeleteBrand,
  onUpdateCar,
  onDeleteCar,
  onAddCar,
}) => {
  const [currentCar, setCurrentCar] = useState(null)
  const [carDetailsOpened, setCarDetailsOpened] = useState(false)

  const [addCarOpened, setAddCarOpened] = useState(false)

  const [editCar, setEditCar] = useState(false)
  const [carModel, setCarModel] = useState("")
  const [carReleaseYear, setCarReleaseYear] = useState("")
  const [carHorsePower, setCarHorsePower] = useState("")
  const [carImageUrl, setCarImageUrl] = useState("")

  const [newCarModel, setNewCarModel] = useState("")
  const [newCarReleaseYear, setNewCarReleaseYear] = useState("")
  const [newCarHorsePower, setNewCarHorsePower] = useState("")
  const [newCarImageUrl, setNewCarImageUrl] = useState("")

  const deleteBrandHandler = () => {
    onDeleteBrand(brand.id)
  }

  const carDetailsHandler = async (id) => {
    setCurrentCar(null)
    setCarDetailsOpened(true)

    const response = await fetch(GQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            car(where: {id: {eq: ${id}}}) {
              id
              model
              horsePower
              releaseYear
              imageUrl
              brand {
                id
                name
              }
            }
          }
          `,
      }),
    })

    if (!response.ok) return

    const resp = await response.json()
    const car = resp.data.car[0]
    setCurrentCar(car)
    setCarModel(car.model)
    setCarHorsePower(car.horsePower)
    setCarReleaseYear(car.releaseYear)
    setCarImageUrl(car.imageUrl ? car.imageUrl : "")
  }

  const updateCarHandler = async (carId = null) => {
    if (!editCar) {
      setEditCar(true)
      return
    }

    const response = await fetch(GQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            updateCar(input: {
              id: ${carId}
              model: "${carModel}"
              releaseYear: ${carReleaseYear}
              horsePower: ${carHorsePower}
              imageUrl: "${carImageUrl}"
            }) {
              id
              model
              releaseYear
              horsePower
              imageUrl
            }
          }
          `,
      }),
    })

    if (!response.ok) return
    const resp = await response.json()
    const car = resp.data.updateCar
    const newCar = { ...car, brand: currentCar.brand }
    setCurrentCar(newCar)
    onUpdateCar(newCar)
    setEditCar(false)
  }

  const deleteCarHandler = async (carId = null) => {
    const response = await fetch(GQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            removeCar(input: {id: ${carId}}) {
              id
            }
          }
          `,
      }),
    })

    if (!response.ok) return
    const resp = await response.json()
    setCarDetailsOpened(false)
    setEditCar(false)
    onDeleteCar(resp.data.removeCar.id)
  }

  const addCarHandler = async () => {
    const response = await fetch(GQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation {
          addCar (input: {
            brandId: ${brand.id},
            model: "${newCarModel}",
            releaseYear: ${newCarReleaseYear},
            horsePower: ${newCarHorsePower}
          }) {
            id
            model
            brandId
          }
        }
          `,
      }),
    })

    if (!response.ok) return
    const resp = await response.json()

    onAddCar(resp.data.addCar)
    setAddCarOpened(false)
    setNewCarHorsePower("")
    setNewCarImageUrl("")
    setNewCarModel("")
    setNewCarReleaseYear("")
  }

  return (
    <>
      {addCarOpened && (
        <Modal className="carDetailsModal">
          <div>
            <div>
              <label>Model</label>
              <input
                value={newCarModel}
                onChange={(e) => {
                  setNewCarModel(e.target.value)
                }}
              />
            </div>
            <div>
              <label>Release Year</label>
              <input
                value={newCarReleaseYear}
                onChange={(e) => {
                  setNewCarReleaseYear(e.target.value)
                }}
              />
            </div>
            <div>
              <label>Horse Power</label>
              <input
                value={newCarHorsePower}
                onChange={(e) => {
                  setNewCarHorsePower(e.target.value)
                }}
              />
            </div>
            <div>
              <label>Image url</label>
              <input
                value={newCarImageUrl}
                onChange={(e) => {
                  setNewCarImageUrl(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="carDetailsActions">
            <button
              onClick={() => {
                setAddCarOpened(false)
              }}
            >
              Close
            </button>
            <button onClick={addCarHandler}>Add car</button>
          </div>
        </Modal>
      )}

      {carDetailsOpened && (
        <Modal className="carDetailsModal">
          {!editCar && currentCar && (
            <div>
              {currentCar.imageUrl && (
                <div>
                  <img
                    src={currentCar.imageUrl}
                    className="carDetailsImage"
                    alt="Car"
                  />
                </div>
              )}
              <div className="carDetailsInfo">
                <p>
                  <span>Brand: </span>
                  {currentCar.brand.name}
                </p>
                <p>
                  <span>Model: </span>
                  {currentCar.model}
                </p>
                <p>
                  <span>Year: </span>
                  {currentCar.releaseYear}
                </p>
                <p>
                  <span>HP: </span>
                  {currentCar.horsePower}
                </p>
              </div>
            </div>
          )}
          {editCar && currentCar && (
            <div>
              <div>
                <label>Model</label>
                <input
                  value={carModel}
                  onChange={(e) => {
                    setCarModel(e.target.value)
                  }}
                />
              </div>
              <div>
                <label>Release Year</label>
                <input
                  value={carReleaseYear}
                  onChange={(e) => {
                    setCarReleaseYear(e.target.value)
                  }}
                />
              </div>
              <div>
                <label>Horse Power</label>
                <input
                  value={carHorsePower}
                  onChange={(e) => {
                    setCarHorsePower(e.target.value)
                  }}
                />
              </div>
              <div>
                <label>Image url</label>
                <input
                  value={carImageUrl}
                  onChange={(e) => {
                    setCarImageUrl(e.target.value)
                  }}
                />
              </div>
            </div>
          )}
          <div className="carDetailsActions">
            <button
              onClick={() => {
                setCarDetailsOpened(false)
                setEditCar(false)
              }}
            >
              Close
            </button>
            <button
              onClick={updateCarHandler.bind(
                null,
                currentCar?.id ? currentCar.id : null
              )}
            >
              Update car
            </button>
            <button
              onClick={deleteCarHandler.bind(
                null,
                currentCar?.id ? currentCar.id : null
              )}
            >
              Delete Car
            </button>
          </div>
        </Modal>
      )}
      <div className="brand">
        <div>
          <p className="brand-name">{brand.name}</p>
          <p className="brand-country">
            <span>Country: </span>
            {brand.country}
          </p>
          <div className="brand-actions">
            <button
              onClick={() => {
                setAddCarOpened(true)
              }}
            >
              Add Car
            </button>
            <button onClick={deleteBrandHandler}>Delete Brand</button>
          </div>
        </div>
        <hr />
        <div className="cars">
          {brand.cars.map((car) => (
            <Car
              key={car.id}
              car={car}
              onClick={carDetailsHandler.bind(null, car.id)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Brand
