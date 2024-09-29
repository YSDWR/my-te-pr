<template>
  <div class="anchor">
    <el-tabs :model-value="tab" @update:model-value="handleTabChange">
      <el-tab-pane label="111" name="marker1" />
      <el-tab-pane label="222" name="marker2" />
    </el-tabs>
    <div class="list" @scroll="handleScroll">
      <div id="marker1"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div id="marker2"></div>
      <div>XXXXXXXXXXXXXXXXXX</div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { ElTabs, ElTabPane } from 'element-plus'

let listScrollTop = 0
let isScrollIntoView = false
let isScrolling = false
const tab = ref('marker1')

const handleTabChange = (val: string | number) => {
  if (typeof val === 'string') {
    tab.value = val
    const el = document.getElementById(val)
    el?.scrollIntoView({ behavior: 'smooth' })
    isScrollIntoView = true
  }
}

const handleScroll = useThrottleFn(() => {
  isScrolling = true
  setTimeout(() => {
    isScrolling = false
  }, 110)
  setCurrent()
}, 100)

const setCurrent = () => {
  console.log('isScrolling:', isScrolling)
  console.log('isScrollIntoView:', isScrollIntoView)
  if (isScrollIntoView && isScrolling) {
    return
  }
  isScrollIntoView = false
  const listEl = document.getElementsByClassName('list')[0]
  const listRect = listEl.getBoundingClientRect()
  const ids = listEl.scrollTop > listScrollTop ? ['marker2', 'marker1'] : ['marker1', 'marker2']
  ids.some((id) => {
    const rect = document.getElementById(id)?.getBoundingClientRect()!
    if (rect.top < listRect.top) {
      console.log(id)
      tab.value = id
      return true
    }
  })
  listScrollTop = listEl.scrollTop
}
</script>

<style scoped lang="less">
.anchor {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
}
.list {
  flex: 1;
  overflow: auto;
}
.item {
  height: 200px;
  border: 1px solid #ddd;
  margin: 12px;
}
</style>
