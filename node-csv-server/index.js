import fs from 'fs'
import csv from 'csv-parser'
import http from 'http'
import path from 'path'
import url from 'url'
import querystring from 'querystring'

http
  .createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*') // Allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type') // Allow specific headers

    const urlValue = url.parse(req.url)
    const parsedQuery = querystring.parse(urlValue.query)
    const results = []
    fs.createReadStream(path.join('node-csv-server', 'cities_20000.csv'))
      .pipe(csv())
      .on('data', (data) => {
        if (data.city_name.indexOf(parsedQuery.searchValue) > -1) {
          results.push({ name: data.city_name, lat: data.lat, lon: data.lon })
        }
      })
      .on('end', () => {
        if (results.length > 0) {
          res.end(JSON.stringify(results))
        } else {
          res.end('No matching records found for ID:' + parsedQuery.searchValue)
        }
      })
  })
  .listen(8080)
