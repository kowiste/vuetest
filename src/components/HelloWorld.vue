<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
<p>{{resultOther}}</p>
  </p>
  <p>
    cat FACT
    <p>{{resultCat}}</p>
   
  </p>
  <input type="text" v-model="texto" />
  <button @click="test">PULSAME</button>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

defineProps({
  msg: String,
})
let texto = ref('')
let resultCat = ref('')
let resultOther = ref('')
const count = ref(0)
function test() {
  console.log(texto)
    axios
    .get(texto.value)
    .then((result) => {
      resultOther.value = result.data
    })
    .catch((err) => {
      console.log(err)
    })
  axios
    .get('https://catfact.ninja/fact')
    .then((result) => {
      resultCat.value = result.data.fact
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
