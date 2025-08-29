import {useState, useEffect} from "react";

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
  // const [customData, setCustomData] = useState({ ...customWeatherData });

  const defaultCityNames = [
    "Amsterdam",
    "Stockholm",
    "Istanbul",
    "Santiago",
    "Cairo",
  ];

  const [defaultCities, setDefaultCities] = useState<WeatherData[]>([]);

  // function checkWeather(weatherType: string) {
  //   switch (weatherType) {
  //     case "Clouds":
  //       return "☁️";
  //     case "Rain":
  //       return "🌧️";
  //     case "Clear":
  //       return "☀️";
  //     case "Snow":
  //       return "❄️";
  //     case "Drizzle":
  //       return "🌦️";
  //     case "Thunderstorm":
  //       return "🌩️";
  //     case "Mist":
  //       return "🌫️";
  //     case "Fog":
  //       return "☁️";
  //     case "Haze":
  //       return "☁️";
  //     case "Smoke":
  //       return "💨";
  //     case "Dust":
  //       return "🌬️";
  //     case "Sand":
  //       return "🏜️";
  //     case "Ash":
  //       return "🌋";
  //     case "Squall":
  //       return "💨";
  //     case "Tornado":
  //       return "🌪️";
  //     default:
  //       return "🖐";
  //   }
  // }

  const fetchWeather = async () => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      const promises = defaultCityNames.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        ).then((res) => res.json())
      );
      const results = await Promise.all(promises);

      console.log("Default cities weather:", results);
      setDefaultCities(results);

      // const response = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?q=${
      //     search || "Stockholm"
      //   }&appid=${API_KEY}&units=metric&lang=sv`
      // );
      // if (!response.ok) {
      //   return;
      // }
      // const data = await response.json();
      // setWeather(data);
      // console.log(`${search} temp:`, data);
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
            placeholder="Sök..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="border border-gray-300 p-2 rounded"
          />
          <button
            onClick={fetchWeather}
            className="border-blue-600 bg-blue-600 text-white border-2 p-2 w-24 rounded-xl hover:bg-blue-700 cursor-pointer transition-all"
          >
            Search
          </button>
        </div>

        <div>
          <ul className="flex gap-10 ">
            {defaultCities.map((city) => (
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
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
