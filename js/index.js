// 創建簡體轉繁體轉換器
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

// 獲取和渲染天氣數據
function getWeather(cityCode) {
  myAxios({
    url: 'https://cors-anywhere.herokuapp.com/http://hmajax.itheima.net/api/weather',
    params: {
      city: cityCode,
    },
  }).then((result) => {
    const wObj = result.data;

    // 使用 Promise.all 確保所有轉換完成
    return Promise.all([
      converter(wObj.date),
      converter(wObj.dateLunar),
      converter(wObj.area),
      converter(wObj.weather),
      converter(wObj.temperature),
      converter(wObj.windDirection),
      converter(wObj.windPower),

      // 轉換 dayForecast 中的字段
      Promise.all(
        wObj.dayForecast.map(async (item) => {
          item.date = await converter(item.date);
          item.weather = await converter(item.weather);
          item.windDirection = await converter(item.windDirection);
          item.windPower = await converter(item.windPower);
          item.dateFormat = await converter(item.dateFormat);
          return item;
        })
      ),
    ]).then(
      ([
        date,
        dateLunar,
        area,
        weather,
        temperature,
        windDirection,
        windPower,
        dayForecast,
      ]) => {
        // 更新 wObj 的值
        wObj.date = date;
        wObj.dateLunar = dateLunar;
        wObj.area = area;
        wObj.weather = weather;
        wObj.temperature = temperature;
        wObj.windDirection = windDirection;
        wObj.windPower = windPower;
        wObj.dayForecast = dayForecast;
        wObj.dateFormat = dayForecast.dateFormat;

        // 渲染數據
        renderWeather(wObj);
      }
    );
  });
}

// 1.2 數據展示到頁面
// 陽曆農曆
function renderWeather(wObj) {
  // 陽曆農曆
  const dateStr = `<span class="dateShort">${wObj.date}</span>
        <span class="calendar">農曆&nbsp;
          <span class="dateLunar">${wObj.dateLunar}</span>
        </span>`;
  document.querySelector('.title').innerHTML = dateStr;

  // 城市名字
  document.querySelector('.area').innerHTML = wObj.area;

  // 當天氣溫
  const nowWStr = `<div class="tem-box">
        <span class="temp">
          <span class="temperature">${wObj.temperature}</span>
          <span>°</span>
        </span>
      </div>
      <div class="climate-box">
        <div class="air">
          <span class="psPm25">${wObj.psPm25}</span>
          <span class="psPm25Level">${wObj.psPm25Level}</span>
        </div>
        <ul class="weather-list">
          <li>
            <img src="${wObj.weatherImg}" class="weatherImg" alt="">
            <span class="weather">${wObj.weather}</span>
          </li>
          <li class="windDirection">${wObj.windDirection}</li>
          <li class="windPower">${wObj.windPower}</li>
        </ul>
      </div>`;
  document.querySelector('.weather-box').innerHTML = nowWStr;

  // 7日天氣預報
  const dayForecastStr = wObj.dayForecast
    .map((item) => {
      return `<li class="item">
          <div class="date-box">
            <span class="dateFormat">${item.dateFormat}</span>
            <span class="date">${item.date}</span>
          </div>
          <img src="${item.weatherImg}" alt="" class="weatherImg">
          <span class="weather">${item.weather}</span>
          <div class="temp">
            <span class="temNight">${item.temNight}</span>-
            <span class="temDay">${item.temDay}</span>
            <span>℃</span>
          </div>
          <div class="wind">
            <span class="windDirection">${item.windDirection}</span>
            <span class="windPower">${item.windPower}</span>
          </div>
        </li>`;
    })
    .join('');
  document.querySelector('.week-wrap').innerHTML = dayForecastStr;
}

// 默認進入設定
getWeather('710100');

/**
 * 目标2：搜索城市列表
 *  2.1 綁定input事件 獲取關鍵字
 *  2.2 獲取展示城市數據
 */
// 2.1 綁定input事件 獲取關鍵字
document.querySelector('.search-city').addEventListener('input', (e) => {
  console.log(e.target.value);
  // 2.2 獲取展示城市數據
  myAxios({
    url: 'http://hmajax.itheima.net/api/weather/city',
    params: {
      city: e.target.value,
    },
  }).then((result) => {
    console.log(result);
    const liStr = result.data
      .map((item) => {
        return `<li class="city-item" data-code="${item.code}">${item.name}</li>`;
      })
      .join('');
    console.log(liStr);
    document.querySelector('.search-list').innerHTML = liStr;
  });
});

/**
 目標3：切換城市天氣
 *  3.1 綁定城市點擊事件，獲取城市code值
 *  3.2 調用獲取並展示天氣的函數
 */
// 3.1 綁定城市點擊事件，獲取城市code值
document.querySelector('.search-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('city-item')) {
    // 只有點擊城市li才會走這
    const cityCode = e.target.dataset.code;
    console.log(cityCode);
    // 3.2 調用獲取並展示天氣的函數
    getWeather(cityCode);
  }
});
