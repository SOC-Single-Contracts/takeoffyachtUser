"use client"
import { useEffect, useRef } from "react"
import { Fancybox as NativeFancybox } from "@fancyapps/ui"
import "@fancyapps/ui/dist/fancybox/fancybox.css"

function Fancybox(props) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current

    // Explicitly initialize Fancybox
    NativeFancybox.bind(container, '[data-fancybox]', {
      // Add some default options to prevent quick closing
      groupAll: true, // Group all images in the gallery
      on: {
        ready: (fancybox) => {
          console.log('Fancybox is ready')
        },
        reveal: (fancybox) => {
          console.log('Image revealed')
        }
      },
      // Prevent closing on quick clicks
      closeButton: 'outside',
      infinite: true,
      // Add some custom options
      animated: true,
      dragToClose: false,
      showClass: 'f-fadeIn',
      hideClass: 'f-fadeOut',
    })

    return () => {
      NativeFancybox.destroy()
    }
  }, [])

  return <div ref={containerRef}>{props.children}</div>
}

export default Fancybox
