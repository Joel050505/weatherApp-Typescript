import { useState, useEffect } from "react";

const customWeatherData = {
  name: "Stockholm",
  weather: [{ description: "klart" }],
  main: { temp: 22 },
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [customData, setCustomData] = useState({ ...customWeatherData });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        const response =
          (await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric&lang=sv`
          )) || customData;
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather(); // call it once on mount
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center border-2 p-20 rounded gap-10 bg-gray-50 hover:shadow-2xl transition-all duration-500 cursor-pointer">
        <h1 className="text-3xl text-center">Weather app</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Sök..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
          <button className="border-blue-600 bg-blue-600 text-white border-2 p-2 w-24 rounded-xl hover:bg-blue-700 cursor-pointer transition-all">
            Search
          </button>
        </div>
        {weather && (
          <div>
            <h2></h2>
          </div>
        )}
        {customData && <div> {customData.name} </div>}
      </div>
    </div>
  );
}

export default App;

// function App() {
//   const [search, setSearch] = useState("");
//   const [weather, setWeather] = useState(null);

//   const fetchWeather = async () => {
//     const apiKey = "DIN_API_NYCKEL";
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=metric&lang=sv`
//     );
//     const data = await response.json();
//     setWeather(data);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Sök stad..."
//         value={search}
//         onChange={e => setSearch(e.target.value)}
//       />
//       <button onClick={fetchWeather}>Hämta väder</button>
//       {weather && (
//         <div>
//           <h2>{weather.name}</h2>
//           <p>{weather.weather[0].description}</p>
//           <p>{weather.main.temp}°C</p>
//         </div>
//       )}
//     </div>
//   );
// }
