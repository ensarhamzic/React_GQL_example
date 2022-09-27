import React, { useEffect, useState } from "react"
import Brand from "./components/Brand"
import Modal from "./components/Modal"

const GQL_URL = "https://localhost:7213/graphql"

const App = () => {
  const [addBrandModalOpened, setAddBrandModalOpened] = useState(false)
  const [brandName, setBrandName] = useState("")
  const [brandCountry, setBrandCountry] = useState("")
  const [brands, setBrands] = useState(null)

  const deleteBrandHandler = async (brandId) => {
    const response = await fetch(GQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            removeBrand(input: {id: ${brandId}}) {
              id
            }
          }
          `,
      }),
    })

    if (!response.ok) return

    const resp = await response.json()
    let newBrands = [...brands]
    newBrands = newBrands.filter((b) => b.id !== resp.data.removeBrand.id)
    setBrands(newBrands)
  }

  useEffect(() => {
    ;(async () => {
      const response = await fetch(GQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              brand(order: {name: ASC}) {
                id
                name
                country
                cars {
                  id
                  model
                }
              }
            }
            `,
        }),
      })

      if (!response.ok) return

      const resp = await response.json()
      setBrands(resp.data.brand)
    })()
  }, [])

  const addBrandHandler = async () => {
    const response = await fetch(GQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation {
            addBrand(input: {
              name: "${brandName}"
              country: "${brandCountry}"
            }) {
              id
              name
              country
              cars {
                id
                model
              }
            }
          }
          `,
      }),
    })

    if (!response.ok) return

    const resp = await response.json()
    let newBrands = [...brands]
    newBrands.push(resp.data.addBrand)
    newBrands = newBrands.sort((a, b) => a.name.localeCompare(b.name))
    setBrands(newBrands)
  }

  const updateCarHandler = (car) => {
    let newBrands = [...brands]
    let newCars = brands.find((b) => b.id === car.brand.id).cars
    newCars = newCars.map((c) => {
      if (c.id === car.id) {
        return car
      }
      return c
    })
    newBrands = newBrands.map((b) => {
      if (b.id === car.brand.id) {
        return { ...b, cars: newCars }
      } else return b
    })

    setBrands(newBrands)
  }

  const deleteCarHandler = (carId) => {
    let newBrands = [...brands]
    let carBrand = brands.find((b) => b.cars.some((c) => c.id === carId))
    carBrand.cars = carBrand.cars.filter((c) => c.id !== carId)

    newBrands = newBrands.map((b) => {
      if (b.id === carBrand.id) return carBrand
      return b
    })

    setBrands(newBrands)
  }

  const addCarHandler = (newCar) => {
    let newBrands = [...brands]
    let carBrand = brands.find((b) => b.id === newCar.brandId)
    carBrand.cars.push(newCar)

    newBrands = newBrands.map((b) => {
      if (b.id === carBrand.id) return carBrand
      return b
    })

    setBrands(newBrands)
  }

  return (
    <>
      {addBrandModalOpened && (
        <Modal className="brandForm">
          <div>
            <label>Brand Name</label>
            <input
              value={brandName}
              onChange={(e) => {
                setBrandName(e.target.value)
              }}
            ></input>
          </div>
          <div>
            <label>Brand Country</label>
            <input
              value={brandCountry}
              onChange={(e) => {
                setBrandCountry(e.target.value)
              }}
            ></input>
          </div>
          <div className="brand-form-actions">
            <button
              onClick={() => {
                setAddBrandModalOpened(false)
              }}
            >
              Close
            </button>
            <button onClick={addBrandHandler}>Add Brand</button>
          </div>
        </Modal>
      )}
      <div className="app">
        <button
          className="add-brand-button"
          onClick={() => {
            setAddBrandModalOpened(true)
          }}
        >
          Add Brand
        </button>
        {brands &&
          brands.map((brand) => (
            <Brand
              key={brand.id}
              brand={brand}
              onDeleteBrand={deleteBrandHandler}
              onUpdateCar={updateCarHandler}
              onDeleteCar={deleteCarHandler}
              onAddCar={addCarHandler}
            />
          ))}
      </div>
    </>
  )
}

export default App
