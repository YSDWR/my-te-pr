<script lang="ts">
import { defineComponent, ref, h } from 'vue'
import { ElTooltip } from 'element-plus'

export default defineComponent({
  props: { content: String },
  setup(props, { slots, attrs }) {
    const visible = ref(false)
    const defaultSlot = slots.default?.(attrs)

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
          visible.value = true
        }
      },
      onMouseleave: () => (visible.value = false)
    })

    return () =>
      h(
        ElTooltip,
        { visible: visible.value, content: props.content, placement: 'top' },
        // { default: () => child }
        () => child
      )
  }
})
</script>

<style scoped lang="less"></style>
