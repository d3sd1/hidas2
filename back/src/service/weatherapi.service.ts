import axios from 'axios';

export async function getWeatherOfCity(city: string) {
    try {
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?q=${city}&days=7&key=${process.env.WEATHER_API_KEY}`)
        return response?.data?.forecast?.forecastday.map((singleDay: any) => ({
            date: singleDay.date,
            temp: singleDay.day.avgtemp_c
        }));
    } catch (error: any) {
        console.log(error.response.body);
        return null;
    }
}
