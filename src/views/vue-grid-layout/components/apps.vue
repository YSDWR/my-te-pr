<template>
  <div class="apps">
    <div v-for="app in appList" class="app-item" :key="app.id">{{ app.name }}</div>
  </div>
</template>

<script setup lang="ts">
const appList = [
  {
    id: '111',
    name: '111'
  },
  {
    id: '222',
    name: '222'
  },
  {
    id: '333',
    name: '333'
  },
  {
    id: '444',
    name: '444'
  }
]
</script>

<style scoped lang="less">
.apps {
  border: 1px solid #ddd;
  height: 100%;
  width: 100%;
}
.app-item {
  height: 40px;
}
</style>
