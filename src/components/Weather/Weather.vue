<template>
  <div class="header">
    <div class="title">Simple Weather</div>
    <div class="city-search">
      <input
        id="geo-search"
        @focus="showSearch = true"
        @input="searchUpdate"
        :value="searchValue"
        ref="searchInput"
      />
      <div class="search-results" v-if="$data.searchResults.length && $data.showSearch">
        <div
          v-for="(item, index) in $data.searchResults"
          @click="locationUpdate(item.lat, item.lon, -1, item.name)"
        >
          {{ item.name }}
        </div>
      </div>
      <div @click="focusInput()">
        <svg
          fill="#fff"
          height="800px"
          width="800px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 488.4 488.4"
          xml:space="preserve"
        >
          <g>
            <g>
              <path
                d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
			s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
			S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
			S381.9,104.65,381.9,203.25z"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
  <div class="tabs-container">
    <button
      v-bind:class="currentActiveIndex === 0 ? 'active' : ''"
      @click="locationUpdate('-22.90278', '-43.2075', 0)"
    >
      Rio de Janeiro
    </button>
    <button
      v-bind:class="currentActiveIndex === 1 ? 'active' : ''"
      @click="locationUpdate('39.9075', '116.39723', 1)"
    >
      Beijing
    </button>
    <button
      v-bind:class="currentActiveIndex === 2 ? 'active' : ''"
      @click="locationUpdate('34.05223', '-118.24368', 2)"
    >
      Los Angeles
    </button>
  </div>
  <div class="hours-container">
    <div class="hours-title">Next hours</div>
    <div class="temp-hour-container">
      <div class="temp-hour" v-for="(item, index) in $data.updatedData">
        <span class="deg">{{ item.temp }}<sup>0</sup></span>
        <br />
        <div class="shade-container">
          <span class="percent">0%</span>
          <img :src="`${$data.base_url}/img/wn/${item.icon}@2x.png`" />
        </div>
        <div class="hour-time">{{ item.time }}</div>
        <br />
      </div>
    </div>
  </div>
  <div class="days-container">
    <div class="days-title">Next 5 days</div>
    <div class="temp-daily-container">
      <div class="temp-day" v-for="(item, index) in $data.dayData">
        <div>
          <img :src="`${$data.base_url}/img/wn/${item.icon}@2x.png`" />
        </div>
        <div class="shade-container">
          <span class="day-temp-date">{{ item.date }}</span>
          <br />
          {{ item.description }}
        </div>
        <div class="deg">{{ item.temp_min }}<sup>0</sup>&nbsp; {{ item.temp_max }}<sup>0</sup></div>
      </div>
    </div>
  </div>
  <div class="last-update">Last updated on {{ $data.updatedTime }}</div>
</template>

<script>
import axios from 'axios'
import { getNextFiveDaysData, getTimeStampData } from './helpers'
export default {
  data() {
    return {
      currentActiveIndex: 0,
      updatedTime: '',
      weatherInfo: [],
      searchValue: '',
      searchResults: [],
      searchTimeoutId: null,
      showSearch: false,
      base_url: 'https://openweathermap.org'
    }
  },
  mounted() {},
  created() {
    window.addEventListener('click', (e) => {
      if (e.target.id !== 'geo-search') this.showSearch = false
    })
    this.getData('-22.90278', '-43.2075', 0)
  },
  methods: {
    focusInput() {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus()
      }
    },
    searchUpdate(event) {
      this.searchValue = event.target.value
      if (this.searchValue.length > 2) {
        this.searchTimeoutId = setTimeout(() => {
          this.getSearchData()
        }, 200)
      } else {
        this.searchResults = []
      }
    },
    getSearchData() {
      axios.get(`http://localhost:8080/?searchValue=${this.searchValue}`).then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          this.searchResults = response.data
          this.showSearch = true
        } else {
          this.searchResults = []
          this.showSearch = false
        }
      })
    },
    updateDate() {
      this.updatedTime = new Date().toLocaleString('default', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    locationUpdate(lat, long, index, name) {
      this.currentActiveIndex = index
      this.getData(lat, long)
      if (index === -1) this.searchValue = name
    },
    getData(lat, long) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=dd88d3a3e749b9599a8557d58c7d6ac9`
        )
        .then((response) => {
          this.setNextFiveDaysData(response)
          this.$data.updatedData = getTimeStampData(response)
          this.updateDate()
        })
    },
    setNextFiveDaysData(response) {
      this.$data.dayData = getNextFiveDaysData(response)
    }
  }
}
</script>
<style scoped>
@import './weather.scss';
</style>
