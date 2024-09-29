<template>
  <div>
    <div>
      <button @click="req">request</button>
      <button @click="req">request</button>
      <button @click="reqS">request 多</button>
      <button @click="stop">stop request 多</button>

      <div>
        <button @click="req2">req2</button>
      </div>
    </div>
    <div v-for="(item, index) in a" :key="index">{{ item }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import axios from '@/utils/request'
import axios, { get } from '@/utils/request'

const a = ref<any[]>([])
let timer: number

onMounted(() => {
  // req()
})

const req = () => {
  const controller = new AbortController()
  axios
    .get('/users', {
      signal: controller.signal
    })
    .then((res) => {
      console.log('res:', res)
      a.value.push(res)
    })
  controller.abort()
}

const req2 = () => {
  get('/users').then((res) => {
    console.log('res:', res)
    a.value.push(res)
  })
}

const reqS = () => {
  if (timer) return
  timer = setInterval(() => {
    req()
  }, 100)
}

const stop = () => {
  clearInterval(timer)
}
</script>

<style scoped lang="less"></style>
