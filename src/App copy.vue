<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TreeTableSortable from './views/TreeTableSortable/TreeTableSortable.vue'
// import VueGridLayout from './views/vue-grid-layout/index.vue'

import OnlyChild from './components/only-child'

import OverflowTooltip from './views/overflow-tooltip.vue'
// import OverflowTooltip from '@/components/overflow-tooltip'
const text = ref('这是一度按文字这是一度按文字这是一度按文字')
const text2 = '短的'

onMounted(() => {
  setTimeout(() => {
    text.value = 'shot'
  }, 1000)
})
</script>

<template>
  <TreeTableSortable />
  <!-- <vue-grid-layout /> -->
  <div>--</div>
  <div>--</div>
  <div>--fdfg--</div>
  <div class="warpper">
    <overflow-tooltip :content="text" test="'test'">
      <div
        class="text"
        @click="
          () => {
            console.log('本来就有的click')
          }
        "
      >
        <span>里面有个span</span> {{ text }}
      </div>
    </overflow-tooltip>
  </div>
  <div class="warpper">
    <overflow-tooltip :content="text">
      <div class="text">{{ text }}</div>
    </overflow-tooltip>
  </div>
  <div class="warpper">
    <overflow-tooltip :content="text2">
      <div class="text"><span>里面有个span</span> {{ text2 }}</div>
    </overflow-tooltip>
  </div>

  <div>----</div>
  <div>----</div>
  <div>----</div>
  <div>----</div>
  <!-- <only-child>
    <div>{{ text }}</div>
  </only-child> -->
</template>

<style scoped>
.warpper {
  width: 200px;
  display: flex;
}
.text {
  flex: 1;
  font-weight: 600;
}
</style>
