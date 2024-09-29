<template>
  <div style="width: 100%">
    <el-table
      ref="deptTable"
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      show-overflow-tooltip
    >
      <el-table-column
        type="index"
        class-name="column-hanldle"
        width="40"
        align="center"
        :show-overflow-tooltip="false"
      />

      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
// @ts-nocheck
import { ref, onMounted, nextTick, render, h } from 'vue'
import Sortable, { type MoveEvent, type SortableEvent } from 'sortablejs'

const deptTable = ref()

let dropType = ''
let _newIndex = -1

onMounted(() => {
  nextTick(() => {
    const tbody = document.querySelector('.el-table__body-wrapper tbody') as HTMLElement
    Sortable.create(tbody, {
      handle: '.handle',
      animation: 150,
      onEnd: handleDrop,
      onMove,
      onChange: (evt: SortableEvent) => {
        const { oldIndex, newIndex } = evt
        console.log('oldIndex:', oldIndex)
        console.log('newIndex:', newIndex)
      }
    })

    handleSortIcon()
  })

  setTimeout(() => {
    tableData1.value[0].address = 'nenenenenen'
  }, 1000)
})

const onMove = (e: MoveEvent, originalEvent: Event) => {
  handleMove(e, originalEvent)

  return false
}

const handleMove = throttle((e: MoveEvent, originalEvent: Event) => {
  const { y } = originalEvent
  const { height, top } = e.relatedRect
  const diff = y - top
  if (diff > (3 / 4) * height) {
    dropType = 'after'
  } else if (diff < (1 / 4) * height) {
    dropType = 'before'
  } else {
    dropType = 'inner'
  }
  console.log('dropType:', dropType)

  clearDragStateClassName()
  e.related.classList.add('drop-row', 'drop-indicator-' + dropType)
  const newIndex = findIndex(e.dragged.parentNode?.children!, e.related)
  _newIndex = newIndex
}, 100)

const handleDrop = async (evt: SortableEvent) => {
  console.log('onEnd _newIndex,  dropType:', _newIndex, dropType)
  const newIndex = _newIndex
  clearDragStateClassName()

  const { oldIndex } = evt
  console.log('oldIndex newIndex:', oldIndex)

  if (oldIndex === newIndex) {
    return
  }

  if (Number(oldIndex) > -1 && Number(newIndex) > -1) {
    const { id: oldId, parentId: oldParentId, parentIndex } = getIdByIndex(oldIndex!)
    console.log('oldId:', oldId)
    console.log('oldparentIndex:', parentIndex)
    const { id: newId, parentId: newParentId } = getIdByIndex(newIndex!)
    console.log('newParentId:', newParentId)
    const { findIdIndex } = getIdByIndex(newIndex!, newParentId)
    console.log('父节点findIdIndex:', findIdIndex)
    console.log('newIndex:', newIndex)
    console.log('newId:', newId)

    // const res = await DepartmentV2Api.lazyTree(useGlobalStore().tenantId, {
    //   keyword: '',
    //   includeDetail: false,
    //   parentId: newParentId
    // })
    // console.log('新位置父节点的子节点：', res.data)

    const sortIds = (res.data || []).map((i) => i.id!)
    if (oldParentId === newParentId) {
      const oIndex = oldIndex! - findIdIndex - 1
      const nIndex = newIndex! - findIdIndex - 1
      console.log('oIndex nIndex:', oIndex, nIndex)

      const temp = sortIds[oIndex]
      sortIds[oIndex] = sortIds[nIndex]
      sortIds[nIndex] = temp
    } else {
      const nIndex = newIndex! - findIdIndex - 1
      sortIds.splice(nIndex, 0, oldId)
    }

    const params = {
      id: oldId,
      parentId: newParentId,
      sortIds
    }
    console.log('params:', params)

    // DepartmentV2Api.deptSort(useGlobalStore().tenantId, params).then(() => {
    //   onRefresh()
    // })
  }
}

interface treeDataObj {
  [key: string]: TreeDataItem
}
interface TreeDataItem {
  expanded: boolean
  children: string[]
}
const getIdByIndex = (index: number, findId?: string) => {
  let current = -1
  let path: { [key: string]: boolean } = {}
  let res = ''
  let parentId = ''
  let parentIndex = -1
  let findIdIndex = -1
  // deptTable.value!.store.states.treeData.value

  const treeObj: { [key: string]: TreeDataItem } = deptTable.value!.store.states.treeData.value
  Object.entries(treeObj).forEach(([key, value], keyIndex) => {
    if (path[key]) {
      // console.log('key:', key);
      return
    }

    current++
    if (current === index) {
      console.log('treeObj中找到')
      res = key
    }
    if (findId && findId === key) {
      findIdIndex = current
    }

    // if (value.expanded && value.children) {

    value.children.forEach((id) => {
      path[id] = true
      current++
      if (current === index) {
        res = id
        parentId = key
        parentIndex = keyIndex
      }
      if (findId && findId === id) {
        findIdIndex = current
      }
      // if (treeObj[id] && treeObj[id].expanded) {
      if (treeObj[id]) {
        const { tempRes, newCurrent, tempPId, tempPIndex, tempFindIndex } = traverseChildren(
          treeObj,
          id,
          keyIndex,
          current,
          index,
          path,
          findId
        )
        if (tempRes) {
          res = tempRes
        }
        if (tempPId) {
          parentId = tempPId
        }
        if (tempPIndex > -1) {
          parentIndex = tempPIndex
        }
        if (tempFindIndex > -1) {
          findIdIndex = tempFindIndex
        }
        current = newCurrent
      }
    })

    // if (value.expanded && value.children) {
    //   const { tempRes, newCurrent } = traverseChildren(treeObj, value.children || [], current, index, path);
    //   if (tempRes) {
    //     res = tempRes;
    //   }
    //   current = newCurrent;
    // }
  })

  return { id: res, parentId, parentIndex, findIdIndex }
}

const traverseChildren = (
  treeObj: treeDataObj,
  // children: string[],
  objKey: string,
  keyIndex: number,
  current: number,
  index: number,
  path: { [key: string]: boolean },
  findId?: string
) => {
  let res = ''
  let parentId = ''
  let parentIndex = -1
  let findIdIndex = -1
  treeObj[objKey].children.forEach((id) => {
    path[id] = true
    current++
    if (current === index) {
      res = id
      parentId = objKey
      parentIndex = keyIndex
    }
    if (findId && findId === id) {
      findIdIndex = current
    }
    // if (treeObj[id] && treeObj[id].expanded) {
    if (treeObj[id]) {
      const { tempRes, newCurrent, tempPId, tempPIndex, tempFindIndex } = traverseChildren(
        treeObj,
        id,
        keyIndex,
        current,
        index,
        path
      )
      if (tempRes) {
        res = tempRes
      }
      if (tempPId) {
        parentId = tempPId
      }
      if (tempPIndex > -1) {
        parentIndex = tempPIndex
      }
      if (tempFindIndex > -1) {
        findIdIndex = tempFindIndex
      }
      current = newCurrent
    }
    // todo
    // if (current === index) {
    //   res = id;
    // }
  })
  return {
    tempRes: res,
    newCurrent: current,
    tempPId: parentId,
    tempPIndex: parentIndex,
    tempFindIndex: findIdIndex
  }
}

const findIndex = (children: HTMLCollection, child) => {
  for (let i = 0; i < children.length; i++) {
    if (children[i] === child) {
      return i
    }
  }
}

const handleSortIcon = () => {
  nextTick(() => {
    const eles = document.getElementsByClassName('column-hanldle')
    ;[...eles].forEach((item, index) => {
      index > 1 && render(h('div', { class: 'handle', innerHTML: 'A' }), item)
    })
  })
}

const clearDragStateClassName = () => {
  const rows = document.querySelectorAll('.el-table__row')
  rows.forEach((row) => {
    row.classList.remove(
      'drop-row',
      'drop-indicator-before',
      'drop-indicator-after',
      'drop-indicator-inner'
    )
  })
}

// @ts-ignore
function throttle(func, delay) {
  let inThrottle
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), delay)
    }
  }
}

interface User {
  id: number
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}

const load = (row: User, treeNode: unknown, resolve: (date: User[]) => void) => {
  setTimeout(() => {
    resolve([
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles'
      }
    ])
    handleSortIcon()
  }, 1000)
}

const tableData11: User[] = [
  {
    id: 1,
    date: '2016-05-01',
    name: 'wangxiaohu',
    hasChildren: true,
    address:
      'No. 189, Grove St, Los AngelesNo. 189, Grove St, Los AngelesNo. 189, Grove St, Los AngelesNo. 189, Grove St, Los AngelesNo. 189, Grove St, Los Angeles'
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 4,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 5,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 6,
    date: '2016-05-03',
    name: 'wangxiaohu',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

const tableData1 = ref(tableData11)
</script>

<style lang="less" scoped>
:deep(.column-hanldle) {
  .cell {
    display: none;
  }
}
:deep(.el-table__row--level-0::after, .el-table__row--level-1::after) {
  // cursor: not-allowed;
  display: none;
}

:deep(.drop-row) {
  position: relative;
}
:deep(.drop-indicator-after::after) {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: blue;
}

:deep(.drop-indicator-before::after) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: blue;
}
</style>
