import logo from './logo.svg';
import darth from './darth.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Popup from './vehiclePopup';


export default function App() {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPopup, setPopupLoading] = useState(true);
  const [vehicles, setVehicles] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  let vehicleArray = [];

  function getUserData(url, getVehicle = false) {
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((actualData) => {
        if (getVehicle) {
          let userV = actualData['results'][0];
          userV['vehicles'].forEach(element => {
            fetch(element)
              .then((response) => response.json())
              .then((vehicleData) => {
                vehicleArray.push(vehicleData);
              })
              .catch((err) => console.log(err.message))
              .finally(() => {
                if (vehicleArray.length === userV['vehicles'].length) {
                  setVehicles(vehicleArray);
                  setPopupLoading(false);
                }
              });

          });
          setPopupLoading(false);
        } else {
          setData(actualData['results']);
          setPagination(actualData);
        }
      })
      .catch((err) => console.log(err.message))
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!data) {
      getUserData("https://swapi.dev/api/people");
    }
  });

  const handlePagination = (event) => {
    getUserData(event.target.value);
  }

  const handleSearch = () => {
    let searchInput = document.getElementById('search');
    getUserData("https://swapi.dev/api/people?search=" + searchInput.value);
  }

  const handleVehicles = (event) => {
    togglePopup();
    setPopupLoading(true);
    getUserData("https://swapi.dev/api/people?search=" + event.target.name, true)
  }

  const togglePopup = () => {
    setIsOpen(!isOpen);
    vehicleArray = [];
    setVehicles(null);
  }

  return (
    <div className="App">
      <header className="App-header">
        {loading && <div><img src={logo} className="App-logo" alt="logo" /> <p>Loading user data...</p></div>}
        {!loading && <div className='App-div'>
          <img src={darth} className="App-darth" alt="logo" />
          <p>User Data Table</p>
          {isOpen && <Popup
            content={<>
              {loadingPopup && <div><img src={logo} className="App-logo" alt="logo" /> <p>Loading user data...</p></div>}
              {!loadingPopup &&
                <table className='App-table'>
                  <thead className='App-table-header'>
                    <tr>
                      <th>Name</th>
                      <th>Model</th>
                      <th>Manufacturer</th>
                      <th>Vehicle class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      vehicles && vehicles.map(({ name, model, manufacturer, vehicle_class }) => (
                        <tr key={name}>
                          <td >{name}</td>
                          <td>{model}</td>
                          <td >{manufacturer}</td>
                          <td >{vehicle_class}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              }
            </>}
            handleClose={togglePopup}
          />}
          <input className='App-input' placeholder='Search by Name' id='search' name='search'></input>
          <button className='App-button' onClick={handleSearch}>Search</button>
          <table className='App-table App-table-button'>
            <thead className='App-table-header'>
              <tr>
                <th>Name</th>
                <th>Height</th>
                <th>Mass</th>
                <th>Gender</th>
                <th>Edited</th>
                <th className='App-button-col'>Show vehicles</th>
              </tr>
            </thead>
            <tbody>
              {
                data && data.map(({ name, height, mass, gender, edited }) => (
                  <tr key={name}>
                    <td >{name}</td>
                    <td>{height}</td>
                    <td >{mass}</td>
                    <td >{gender}</td>
                    <td >{edited}</td>
                    <td className='App-button-col' ><button className='App-button' name={name} onClick={handleVehicles}>Show vehicles</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        }
        <div>
          {!loading && pagination && pagination.previous && <button className='App-prev' onClick={handlePagination} value={pagination.previous}>⇦</button>}
          {!loading && pagination && pagination.next && <button className='App-next' onClick={handlePagination} value={pagination.next}>⇨</button>}

        </div>
      </header>
    </div>
  );
}