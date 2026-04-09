'use client'

import { useEffect } from 'react'

export default function ClientScripts({ headerScript, footerScript }) {
  useEffect(() => {
    const addedScripts = []

    // Handle header script
    if (headerScript) {
      try {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = headerScript
        
        // Get all script elements from the parsed HTML
        const scriptElements = tempDiv.querySelectorAll('script')
        
        // Execute each script separately
        scriptElements.forEach((originalScript, index) => {
          const newScript = document.createElement('script')
          newScript.type = 'text/javascript'
          
          // Copy attributes if they exist
          Array.from(originalScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value)
          })
          
          // Add a data attribute to track our scripts
          newScript.setAttribute('data-dynamic-script', `header-${index}`)
          
          // Set the script content
          newScript.innerHTML = originalScript.innerHTML
          
          // Append header scripts to head for better performance
          document.head.appendChild(newScript)
          addedScripts.push(newScript)
        })

      } catch (error) {
        console.error('Error loading header scripts:', error)
      }
    }

    // Handle footer script
    if (footerScript) {
      try {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = footerScript
        
        // Get all script elements from the parsed HTML
        const scriptElements = tempDiv.querySelectorAll('script')
        
        // Execute each script separately
        scriptElements.forEach((originalScript, index) => {
          const newScript = document.createElement('script')
          newScript.type = 'text/javascript'
          
          // Copy attributes if they exist
          Array.from(originalScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value)
          })
          
          // Add a data attribute to track our scripts
          newScript.setAttribute('data-dynamic-script', `footer-${index}`)
          
          // Set the script content
          newScript.innerHTML = originalScript.innerHTML
          
          // Append footer scripts to body
          document.body.appendChild(newScript)
          addedScripts.push(newScript)
        })

      } catch (error) {
        console.error('Error loading footer scripts:', error)
      }
    }

    // Cleanup function
    return () => {
      addedScripts.forEach(script => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script)
        }
      })
    }
  }, [headerScript, footerScript])

  return null
}