<template>
  <grid-layout
    v-model:layout="layout"
    :col-num="24"
    :row-height="20"
    auto-size
    :is-draggable="true"
    :is-resizable="true"
    :is-mirrored="false"
    :vertical-compact="true"
    :margin="[10, 10]"
    :use-css-transforms="true"
  >
    <grid-item
      v-for="item in layout"
      :key="item.i"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
    >
      <welcome v-if="item.name === 'welcome'" />
      <todo v-if="item.name === 'todo'" />
      <apps v-if="item.name === 'apps'" />
    </grid-item>
  </grid-layout>
</template>

<script setup lang="ts">
import Welcome from './components/welcome.vue'
import Todo from './components/todo.vue'
import Apps from './components/apps.vue'

const layout = [
  { x: 0, y: 0, w: 8, h: 4, i: 0, name: 'welcome' },
  { x: 0, y: 5, w: 8, h: 20, i: 1, name: 'todo' },
  { x: 8, y: 0, w: 16, h: 24, i: 2, name: 'apps' }
]

// { x: 0, y: 0, w: 12, h: 8, i: 0, name: 'welcome'},
//   { x: 12, y: 0, w: 12, h: 8, i: 1, name: 'todo' },
//   { x: 0, y: 8, w: 12, h: 8, i: 2, name: 'apps' }
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
