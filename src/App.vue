<template>
  <div class="p-5 bg-dark">
    <logo style="height: 20px" />
    <div class="container">
      <div
        class="status"
        :class="status == EConnectionStatus.Open ? 'open' : 'close'"
      >
        {{ status }}
      </div>
    </div>

    {{ url }}
    <div class="row">
      <div class="d-flex">
        <button class="btn btn-primary" @click="change">CLICK ME</button>
        <button class="btn btn-warning" @click="change">CLICK ME</button>
        <button class="btn btn-danger" @click="change">CLICK ME</button>
        <button class="btn btn-light" @click="change">CLICK ME</button>
        <button class="btn btn-dark" @click="change">CLICK ME</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useWebsocketStore } from '@/plugins/websocket/store'
import { useWSTest } from '@/stores/counter'
import { EConnectionStatus } from '@/plugins/websocket/model'
import { useTheme } from '@/plugins/theme/store'
import { EThemeStatus } from '@/plugins/theme/model'
import logo from '@/components/logo.vue'

let wsReconnect: number
//store
const storeWS = useWebsocketStore()
const wsTest = useWSTest()
const theme = useTheme()

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

//computed
const url = computed(() => {
  return wsTest.URL
})
const status = computed(() => {
  return storeWS.status
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
function change() {
  if (theme.status == EThemeStatus.Light) theme.change(EThemeStatus.Dark)
  else theme.change(EThemeStatus.Light)
}

onMounted(() => {
  getURL()
  theme.change(EThemeStatus.Light)
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
.container {
  display: flex;
}
</style>
