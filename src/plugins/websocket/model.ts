export enum EConnectionStatus {
  Open = 'open',
  Close = 'close',
}
export interface IWebsocketOption {
  log: boolean
  protocols?: string | string[]
}
