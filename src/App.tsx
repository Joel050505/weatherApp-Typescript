import { useState, useEffect } from "react";
import AlertBox from "./Alert";
import GlassClock from "./ClockComponent";

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
  const [showAlert, setShowAlert] = useState(false);
  const [time, setTime] = useState<Date>(new Date());
  // const [customData, setCustomData] = useState({ ...customWeatherData });

  const defaultCityNames = [
    "Amsterdam",
    "Stockholm",
    "Istanbul",
    "Santiago",
    "Kapstaden",
  ];

  const [defaultCities, setDefaultCities] = useState<WeatherData[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date()); // update time every minute
    }, 60000); // 60,000 ms = 1 min

    return () => clearInterval(timer);
  }, []);

  // Search funciton to filter for city name
  async function searchCity() {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${
        search.charAt(0).toLocaleUpperCase() + search.slice(1)
      }&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      setShowAlert(true);
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

  useEffect(() => {
    if (showAlert === true) {
      const timer = setTimeout(() => setShowAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

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
    <div
      className="flex items-center justify-center h-screen bg-gradient-to-br"
      style={{
        backgroundImage:
          time.getHours() >= 6 && time.getHours() < 18
            ? "url('/DayBg-pic.png')"
            : "url('/NightBg-pic.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col justify-center border w-6/12 h-6/12 border-white/20 p-20 rounded-3xl gap-10 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-400/20 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 backdrop-saturate-150">
        <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
          Weather app
        </h1>
        <div className="flex gap-4 justify-center relative">
          <input
            type="text"
            placeholder="Enter city name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="border border-white/30 text-white bg-white/10 backdrop-blur-md p-4 w-64 rounded-2xl placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300 shadow-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchCity();
              }
            }}
          />
          <button
            onClick={() => {
              searchCity();
              showAlert ? setShowAlert(true) : setShowAlert(false);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none p-4 w-28 rounded-2xl font-semibold hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Search
          </button>
          {showAlert && <AlertBox />}
          {/* // Digital clock for time and date */}
          <GlassClock />
        </div>
        <div>
          <ul className="flex gap-12 justify-center">
            {!isShowing ? (
              defaultCities.map((city) => (
                <li
                  className="flex flex-col text-white text-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 hover:cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg"
                  key={city.name}
                >
                  <img
                    src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                    alt={city.weather[0].description}
                    title={city.weather[0].description}
                    className="mx-auto drop-shadow-lg"
                  />
                  <span className="text-4xl"></span>
                  <strong className="text-xl font-bold">{city.name}</strong>
                  <span className="text-3xl font-light">
                    {city.main.temp}°C
                  </span>
                </li>
              ))
            ) : loading ? (
              <li
                className="flex justify-center flex-col text-white text-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg"
                key={weather?.name}
              >
                <img
                  src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                  alt={weather?.weather[0].description}
                  title={weather?.weather[0].description}
                  className="mx-auto drop-shadow-lg"
                />
                <span className="text-4xl"></span>
                <strong className="text-xl font-bold">{weather?.name}</strong>
                <span className="text-3xl font-light">
                  {weather?.main.temp}°C
                </span>
              </li>
            ) : (
              <div className="loader animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto"></div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
