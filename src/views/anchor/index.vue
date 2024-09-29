<template>
  <div class="anchor">
    <el-tabs :model-value="tab" @update:model-value="handleTabChange">
      <el-tab-pane v-for="i in 10" :key="i" :label="`tab-${i}0`" :name="i.toString()" />
    </el-tabs>
    <div class="list" @scroll="handleScroll">
      <div v-for="i in 100" class="item" :id="`item-${i}`">{{ i }}</div>
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
const tab = ref('1')

const handleTabChange = (val: string | number) => {
  if (typeof val === 'string') {
    tab.value = val
    const el = document.getElementById(`item-${val}0`)
    el?.scrollIntoView({ behavior: 'smooth' })
    isScrollIntoView = true
  }
}

const handleScroll = useThrottleFn(() => {
  isScrolling = true
  console.log(new Date().getMilliseconds())
  console.log('handleScroll isScrolling:', isScrolling)
  setTimeout(() => {
    console.log('isScrolling false')
    console.log(new Date().getMilliseconds())

    isScrolling = false
  }, 10)
  setTimeout(() => {
    setCurrent()
  }, 120)
}, 100)

const setCurrent = () => {
  console.log(new Date().getMilliseconds())
  console.log('isScrolling:', isScrolling)
  console.log('isScrollIntoView:', isScrollIntoView)
  if (isScrollIntoView && isScrolling) {
    return
  }
  isScrollIntoView = false
  let i = 1
  const listRect = document.getElementsByClassName('list')[0].getBoundingClientRect()
  while (i <= 10) {
    const id = `item-${i}0`
    const el = document.getElementById(id)
    // console.log('id ' + id, el?.offsetTop, el?.scrollTop)
    // console.log('id ' + id, el?.getBoundingClientRect())
    const itemRect = el!.getBoundingClientRect()
    if (itemRect.top > listRect.top) {
      console.log(id)
      tab.value = i.toString()
      return
    }
    i++
  }
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
  padding: 12px;
}
</style>
