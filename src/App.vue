<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />
    {{ url }}
    <div class="wrapper"></div>
  </header>
</template>
<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useWebsocketStore } from '@/plugins/websocket/store'
import { useWSTest } from '@/stores/counter'

const storeWS = useWebsocketStore()
const wsTest = useWSTest()

const url = computed(() => {
  return wsTest.URL
})
function setQuery(url: string, token: string): string {
  const param = new URLSearchParams()
  param.append('token', token)
  return `${url}?${param.toString()}`
}
onMounted(() => {
  wsTest.getURL()
})
watch(
  () => url.value,
  () => {
    if (url.value != '') {
      console.log('connect ws')

      storeWS.connect(
        setQuery(url.value, wsTest.token),
        (message: any) => {
          console.log('message', message)
        },
        (error: any) => {
          console.log('error', error)
        }
      )
    }
  }
)
</script>
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
