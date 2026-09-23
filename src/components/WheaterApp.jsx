import sunny from '../assets/images/sunny.png'
import { useState } from 'react'

const WheatherApp = () => {

//GERENCIAMENTO E CONTROLE DE DADOS E AÇÕES

  // Guarda os dados do clima
  const [data, setData] = useState(null)

  // Guarda o nome da cidade digitada
  const [location, setLocation] = useState('')


  // Busca as coordenadas da cidade
  const getCoordinates = async (cityName) => {

    // API que transforma o nome da cidade em latitude e longitude
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=pt&format=json`

    // Faz a requisição para a API
    const response = await fetch(url)

    // Transforma a resposta em JSON
    const data = await response.json()

    // Verifica se encontrou a cidade
    if (!data.results || data.results.length === 0) {
      throw new Error('Cidade não encontrada')
    }

    // Pega a primeira cidade encontrada
    const city = data.results[0]

    // Retorna somente os dados que precisamos
    return {
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country
    }
  }


  // Pega o que o usuário está digitando
  const handleInputChanges = (e) => {

    setLocation(e.target.value)

    console.log(location)
  }


  // Detecta quando o usuário aperta uma tecla
  const handleKeyDown = (e) => {

    // Se a tecla for Enter, faz a pesquisa
    if (e.key === 'Enter') {
      search(location)
    }
  }


  // Faz a pesquisa do clima
  const search = async (cityName) => {

    try {

      //1. Buscar as Coordenadas

      const coordinates = await getCoordinates(cityName)


      //2. Pegar a latitude e longitude

      const { latitude, longitude } = coordinates


      //3. Montar a URL da API de clima

      const url = `https://api.open-meteo.com/v1/forecast?
      latitude=${latitude}&
      longitude=${longitude}&
      current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&
      timezone=auto`.replace(/\s/g, '')


      //4. Buscar Clima

      const response = await fetch(url)

      // Transforma a resposta em JSON
      const data = await response.json()


      console.log('Clima:')
      console.log(data)


      //5. Salvar os dados obtidos pela API no estado data

      setData({
        ...data.current,

        city: coordinates.name,

        country: coordinates.country,

        // A API do Open-Meteo fornece o código do clima
        weatherCode: data.current.weather_code
      })


    } catch (error) {

      console.log(error.message)

    }
  }


//ELEMENTOS QUE SÃO RENDERIZADOS

  return (
    <div className="container">

      <div className="weather-app">

        <div className="search">

          <div className="search-top">

            <i className="fa-solid fa-location-dot"></i>

            {/* Mostra a cidade pesquisada */}
            <div className="location">
              {data ? data.city : 'London'}
            </div>

          </div>


          <div className="search-bar">

            <input
              type="text"

              placeholder="Enter Location"

              value={location}

              onChange={handleInputChanges}

              // Corrigido: era omKeyDown
              onKeyDown={handleKeyDown}
            />

            {/* Lupa para pesquisar */}
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => search(location)}
            ></i>

          </div>

        </div>


        {/* ============================
            CLIMA
        ============================ */}

        {data && (
          <>

            <div className="weather">

              <img
                src={sunny}
                alt="Clear sky"
              />

              {/* Código do clima */}
              <div className="weather-type">
                Código: {data.weatherCode}
              </div>

              {/* Temperatura */}
              <div className="temp">
                {Math.round(data.temperature_2m)}°
              </div>

            </div>


            {/* ============================
                SENSAÇÃO TÉRMICA
            ============================ */}

            <div className="weather-date">

              <p>
                Sensação térmica:{' '}
                {Math.round(data.apparent_temperature)}°
              </p>

            </div>


            {/* ============================
                UMIDADE E VENTO
            ============================ */}

            <div className="weather-data">

              <div className="humidity">

                <div className="data-name">
                  Humidity
                </div>

                <i className="fa-solid fa-droplet"></i>

                <div className="data">
                  {data.relative_humidity_2m}%
                </div>

              </div>


              <div className="wind">

                <div className="data-name">
                  Wind
                </div>

                <i className="fa-solid fa-wind"></i>

                <div className="data">
                  {data.wind_speed_10m} km/h
                </div>

              </div>

            </div>


            {/* ============================
                CHUVA E PRECIPITAÇÃO
            ============================ */}

            <div className="weather-data">

              <div className="humidity">

                <div className="data-name">
                  Rain
                </div>

                <i className="fa-solid fa-cloud-rain"></i>

                <div className="data">
                  {data.rain} mm
                </div>

              </div>


              <div className="wind">

                <div className="data-name">
                  Precipitation
                </div>

                <i className="fa-solid fa-umbrella"></i>

                <div className="data">
                  {data.precipitation} mm
                </div>

              </div>

            </div>


            {/* ============================
                DIREÇÃO E RAJADA DO VENTO
            ============================ */}

            <div className="weather-data">

              <div className="humidity">

                <div className="data-name">
                  Wind Direction
                </div>

                <i className="fa-solid fa-compass"></i>

                <div className="data">
                  {data.wind_direction_10m}°
                </div>

              </div>


              <div className="wind">

                <div className="data-name">
                  Wind Gusts
                </div>

                <i className="fa-solid fa-wind"></i>

                <div className="data">
                  {data.wind_gusts_10m} km/h
                </div>

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  )
}

export default WheatherApp
