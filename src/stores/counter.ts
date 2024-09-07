import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'

interface State {
  URL: string
  token: string
}
export const useWSTest = defineStore('testStore', {
  state: (): State => ({
    URL: '',
    token: '',
  }),
  getters: {
    url(): string {
      return this.URL
    },
  },
  actions: {
    getURL() {
      axios
        .post('http://localhost:8080/ws/token')
        .then((resp) => {
          this.URL = 'http://localhost:8080/ws/' + resp.data.clientID
          this.token = resp.data.token
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
  },
})
