<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'

type Obj1 = Record<string, string | number>

const a: Obj1 = {
  a: '123',
  b: 123
}

const obj2: { [key: string]: string | number } = {
  a: '123',
  b: 123
}

</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
