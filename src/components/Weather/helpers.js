const getNextFiveDaysData = (response) => {
  const fiveDays = []
  const currentDate = new Date()
  const fiveDaysData = []
  for (let count = 1; count <= 5; count++) {
    let nextDay = new Date()
    nextDay.setDate(currentDate.getDate() + count)
    fiveDays.push(nextDay.toDateString())
  }
  const listData = response.data.list
  for (let count = 0; count < fiveDays.length; count++) {
    for (let innerCount = 0; innerCount < listData.length; innerCount++) {
      const reportDate = new Date(listData[innerCount].dt_txt)
      if (fiveDays[count] === reportDate.toDateString()) {
        // const hours = reportDate.getHours()
        fiveDaysData.push({
          date: reportDate.toLocaleString('default', {
            month: 'short',
            weekday: 'short',
            day: '2-digit'
          }),
          icon: listData[innerCount].weather[0].icon,
          description: listData[innerCount].weather[0].description,
          temp_min: listData[innerCount].main.temp_min,
          temp_max: listData[innerCount].main.temp_max
        })
        break
      }
    }
  }
  return fiveDaysData
}

const getTimeStampData = (response) => {
  const timeStampData = []
  for (let report of response.data.list) {
    const todayDate = new Date().toDateString()
    const reportDate = new Date(report.dt_txt)
    const hours = reportDate.getHours()
    if (todayDate === reportDate.toDateString()) {
      const hours = reportDate.getHours()
      timeStampData.push({
        icon: report.weather[0].icon,
        temp: report.main.temp,
        time: hours > 12 ? `${hours - 12} PM` : `${hours}`.padStart(2, 0) + ' AM'
      })
    }
  }
  return timeStampData
}

export { getNextFiveDaysData, getTimeStampData }
