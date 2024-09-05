import { defineStore } from 'pinia'
import { EConnectionStatus, type IWebsocketOption } from './model'
interface State {
  Websocket: WebSocket | undefined
  Status: EConnectionStatus
  Options?: IWebsocketOption
}

export const useWebsocketStore = defineStore('websocket', {
  state: (): State => ({
    Websocket: undefined,
    Status: EConnectionStatus.Close,
  }),
  actions: {
    connect(url: string, onMessage: Function, onError: Function) {
      if (this.Websocket?.OPEN) this.Websocket?.close()
      this.Websocket = new WebSocket(url, this.Options?.protocols)
      this.Websocket.onopen = (data: any) => {
        if (this.Options?.log) console.log('websocket open', data)
        this.Status = EConnectionStatus.Open
      }
      this.Websocket.onmessage = (event: any) => {
        if (this.Options?.log) console.log('Message from server:', event)
        const message = JSON.parse(event)
        onMessage(message)
      }
      this.Websocket.onclose = (event) => {
        if (this.Options?.log) console.log('WebSocket is closed now.')
        this.Status = EConnectionStatus.Close
      }
      this.Websocket.onerror = (error) => {
        if (this.Options?.log) console.error('WebSocket error:', error)
        onError(error)
      }
    },
    send(data: any) {
      this.Websocket?.send(data)
    },
    disconnect() {
      if (this.Websocket?.OPEN) this.Websocket?.close()
      this.Status = EConnectionStatus.Close
    },
    setOptions(data: IWebsocketOption) {
      this.Options = data
    },
  },
  getters: {
    url(): string {
      if (!this.Websocket) return ''
      return this.Websocket.url
    },
  },
})
