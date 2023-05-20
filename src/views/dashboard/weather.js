
import axios from 'axios'
import { ref } from 'vue'

const weatherInfo = ref('今日晴，0℃ - 10℃，天气寒冷，注意添加衣物。')
const amapKey = '0bb03fa1e48f5a620bf9fa253279ba51'

export const useWeatherInfo = async () => {
  await ip()
  return weatherInfo
}

export const ip = async() => {
  if (amapKey === '') {
    return false
  }
  await getWeather(360111)
  // const res = await axios.get('https://restapi.amap.com/v3/ip?key=' + amapKey)
  // if (res.data.status === '1') {
  //   console.log('xxxxxxx ->',res.data.adcode)
  //   await getWeather(res.data.adcode)
  // }
}

const getWeather = async(code) => {
  const response = await axios.get('https://restapi.amap.com/v3/weather/weatherInfo?key=' + amapKey + '&extensions=base&city=' + code)
  if (response.data.status === '1') {
    console.log('abc',response.data.lives[0])
    weatherInfo.value = response.data.lives[0].city + ' 天气：' + response.data.lives[0].weather + ' 温度：' + response.data.lives[0].temperature + '摄氏度 风向：' + response.data.lives[0].winddirection + ' 风力：' + response.data.lives[0].windpower + '级 空气湿度：' + response.data.lives[0].humidity
    console.log('weather ->',weatherInfo.value)
  }
}

