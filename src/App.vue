<template>
  <header>
    <div class="container">
      <div
        class="status"
        :class="status == EConnectionStatus.Open ? 'open' : 'close'"
      >
        {{ status }}
      </div>
    </div>

    {{ url }}
    <div class="wrapper"></div>
  </header>
</template>
<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useWebsocketStore } from '@/plugins/websocket/store'
import { useWSTest } from '@/stores/counter'
import { EConnectionStatus } from '@/plugins/websocket/model'

const storeWS = useWebsocketStore()
const wsTest = useWSTest()
let wsReconnect: number
const url = computed(() => {
  return wsTest.URL
})
const status = computed(() => {
  return storeWS.status
})
storeWS.onConnect((data: any) => {
  console.log('connected')
  clearInterval(wsReconnect)
})
storeWS.onClose((event: any) => {
  console.log('websocket closed', event)
  wsReconnect = setInterval(getURL, 10000)
})
storeWS.onError((data: any) => {
  console.log('error', data)
})
function setQuery(url: string, token: string): string {
  const param = new URLSearchParams()
  param.append('token', token)
  return `${url}?${param.toString()}`
}
function getURL() {
  console.log('getting url')
  wsTest.getURL()
}
onMounted(() => {
  getURL()
})
watch(
  () => url.value,
  () => {
    if (url.value != '') {
      storeWS.connect(setQuery(url.value, wsTest.token), (message: any) => {
        console.log('message', message)
      })
    }
  }
)
</script>
<style scoped>
.status {
  padding: 0.2rem;
  padding-inline: 1rem;
  border-radius: 0.5rem;
}
.close {
  background-color: rgb(184, 94, 94);
}
.open {
  background-color: rgb(36, 133, 31);
}
.container{
  display: flex;
}
</style>
