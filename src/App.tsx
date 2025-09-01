import { useState, useEffect } from "react";

type WeatherData = {
  name: string;
  main: {
    temp: number;
  };
  weather: [
    {
      main: string;
      description: string;
      icon: string;
    }
  ];
};

export default function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isShowing, setIsShowing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [customData, setCustomData] = useState({ ...customWeatherData });

  const defaultCityNames = [
    "Amsterdam",
    "Stockholm",
    "Istanbul",
    "Santiago",
    "Kapstaden",
  ];

  const [defaultCities, setDefaultCities] = useState<WeatherData[]>([]);

  // Search funciton to filter for city name
  async function searchCity() {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${
        search.charAt(0).toLocaleUpperCase() + search.slice(1)
      }&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      alert("City not found, please try again");
      return setSearch("");
    }

    const data = await response.json();
    setWeather(data);
    setTimeout(() => {
      setLoading(true);
    }, 200);
    setIsShowing(true);
    setSearch("");
  }

  // Fetching weather data from OpenWeatherMap API
  const fetchWeather = async () => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      const promises = defaultCityNames.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        ).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      // console.log("Default cities weather:", results);
      setDefaultCities(results);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    // call it once on mount
    fetchWeather();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="flex flex-col justify-center border-2 p-20 rounded gap-10  bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 transparent hover:shadow-2xl transition-all duration-500 ">
        <h1 className="text-4xl font-bold text-center">Weather app</h1>
        <div className="flex gap-4 justify-center">
          <input
            type="text"
            placeholder="Enter city name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="border border-gray-300 p-2 rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchCity();
              }
            }}
          />
          <button
            onClick={searchCity}
            className="border-blue-600 bg-blue-600 text-white border-2 p-2 w-24 rounded-xl hover:bg-blue-700 cursor-pointer transition-all"
          >
            Search
          </button>
        </div>

        <div>
          <ul className="flex gap-10 justify-center">
            {!isShowing ? (
              defaultCities.map((city) => (
                <li
                  className="flex flex-col text-gray-700 text-center"
                  key={city.name}
                >
                  <img
                    src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                    alt={city.weather[0].description}
                    title={city.weather[0].description}
                    className="mx-auto"
                  />
                  <span className="text-4xl"></span>
                  <strong>{city.name}</strong> {city.main.temp}°C{" "}
                </li>
              ))
            ) : loading ? (
              <li
                className="flex justify-center flex-col text-gray-700 text-center"
                key={weather?.name}
              >
                <img
                  src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                  alt={weather?.weather[0].description}
                  title={weather?.weather[0].description}
                  className="mx-auto"
                />
                <span className="text-4xl"></span>
                <strong>{weather?.name}</strong> {weather?.main.temp}°C{" "}
              </li>
            ) : (
              <div className="loader"></div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
