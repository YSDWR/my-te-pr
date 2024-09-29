<template>
  <div class="c1" v-if="visible">c1c1c1</div>
  <only-child @click="toggleVisiblle" :count="123">
    <slot />
  </only-child>
  <!-- <div>aaaa</div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import OnlyChild from './only-child';

const visible = ref(true)

const toggleVisiblle = () => {
  console.log("toggleVisiblle:")
  visible.value = !visible.value
}


</script>

<style scoped >
.c1 {
  height: 100px;
  width: 100px;
  border: 1px solid #ddd;
}
</style>
