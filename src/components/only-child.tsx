import { cloneVNode, defineComponent, h } from 'vue'
const OnlyChild = defineComponent({
  name: 'only-child',
  setup(_, { slots, attrs }) {
    console.log('only-child attrs:', attrs)
    return () => {
      const defaultSlot = slots.default?.(attrs)
      console.log('only-child  render   defaultSlot:', defaultSlot)
      if (!defaultSlot) return null

      if (defaultSlot.length > 1) {
        console.warn('[only-child] requires exact only one valid child.')
        return null
      }

      console.log('cloneVNode(defaultSlot[0], attrs):', cloneVNode(defaultSlot[0], attrs))
      return cloneVNode(defaultSlot[0], attrs)
      // return <div>div</div>
    }
  }
})

export default OnlyChild
