<script lang="ts">
import { defineComponent, ref, h, onMounted, onUpdated } from 'vue'
import { ElTooltip } from 'element-plus'

export default defineComponent({
  setup(_, { slots, attrs }) {
    const disabled = ref(true)

    onMounted(() => {
      console.log('overflow-tooltip onMounted')
    })

    onUpdated(() => {
      console.log('overflow-tooltip onUpdated')
    })

    return () => {
      const defaultSlot = slots.default?.()

      if (!defaultSlot) return null

      if (defaultSlot.length > 1) {
        console.warn('[only-child] requires exact only one valid child.')
        return null
      }

      const child = h(defaultSlot[0], {
        style: {
          overflow: 'hidden',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis'
        },
        onMouseenter: (event: MouseEvent) => {
          const el = event.target as HTMLElement
          if (el.scrollWidth > el.clientWidth) {
            disabled.value = false
          } else {
            disabled.value = true
          }
        }
      })

      return h(ElTooltip, { disabled: disabled.value, placement: 'top', ...attrs }, () => child)
    }
  }
})
</script>

<style lang="less"></style>
