<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RequestTest from './views/requestTest/index.vue'
import Anchor from './views/anchor/index.vue'

onMounted(() => {})
</script>

<template>
  <div class="app">
    <!-- <request-test /> -->
    <anchor />
  </div>
</template>

<style scoped>
.app {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.warpper {
  width: 200px;
  display: flex;
}
.text {
  flex: 1;
  font-weight: 600;
}
</style>
