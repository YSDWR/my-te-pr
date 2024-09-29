import { h, render, type DirectiveBinding } from 'vue'
import { ElTooltip, ElPopover } from 'element-plus'

const mouseEnterDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    let isOverflow = false
    const handler = (event: MouseEvent) => {
      isOverflow = el.scrollWidth > el.clientWidth
      if (isOverflow) {
        console.log('isOverflow', isOverflow)
        // render(
        //   h(ElTooltip, { content: binding.value, visible: true }, () => h('span')),
        //   el
        // )
        const hh = h(ElPopover, { content: binding.value, visible: true })
        console.log('hh:', hh)
        const renderRes = render(hh, el)
        console.log('renderRes:', renderRes)
      }
    }

    const leaveHandler = (event: MouseEvent) => {
      console.log('leaveHandler')
      if (isOverflow) {
        // render(null, el)
      }
    }

    el.style.textOverflow = 'ellipsis'
    el.style.overflow = 'hidden'
    el.style.whiteSpace = 'nowrap'
    el.addEventListener('mouseenter', handler)
    el.addEventListener('mouseleave', leaveHandler)
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding) {
    // el.removeEventListener('mouseenter', binding.value)
  }
}

//   app.directive('mouseenter', mouseEnterDirective);

export default mouseEnterDirective
