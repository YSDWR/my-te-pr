import { ref, defineComponent, h, cloneVNode } from 'vue'
import { ElTooltip } from 'element-plus'
import OnlyChild from './only-child'

const OverflowTooltip = defineComponent({
  name: 'overflow-tooltip',
  components: { OnlyChild },
  props: {
    content: {
      type: String,
      default: 'defaultdefaultdefaultdefaultdefault'
    }
  },
  setup(props, { slots, attrs }) {
    console.log('overflow-tooltip props:', props)
    console.log('overflow-tooltip attrs:', attrs)
    const visible = ref(false)
    const disabled = ref(true)

    return () => {
      const defaultSlot = slots.default?.(attrs)

      if (!defaultSlot) return null

      if (defaultSlot.length > 1) {
        console.warn('[only-child] requires exact only one valid child.')
        return null
      }

      const child = cloneVNode(defaultSlot[0], {
        style: {
          overflow: 'hidden',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis'
        },
        onMouseenter: (event: MouseEvent) => {
          const el = event.target as HTMLElement
          if (el.scrollWidth > el.clientWidth) {
            visible.value = true
            disabled.value = false
          }
        },
        onMouseleave: () => {
          disabled.value = true
        }
      })

      console.log('child:', child)

      return child

      return h(OnlyChild, {}, () => child)

      return h(
        ElTooltip,
        { disabled: !visible.value, content: props.content, placement: 'top', ...attrs },
        h(OnlyChild, {}, () => child)
      )
    }

    return () =>
      cloneVNode(
        h(
          ElTooltip,
          { disabled: !visible.value, content: props.content, placement: 'top', ...attrs },
          () => child
        )
      )

    return () =>
      h(
        ElTooltip,
        { disabled: !visible.value, content: props.content, placement: 'top', ...attrs },
        () => child
      )
  }
})

export default OverflowTooltip
