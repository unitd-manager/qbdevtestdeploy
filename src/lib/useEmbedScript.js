import { useEffect, useRef } from 'react';

export const useEmbedScript = () => {
    const scriptsLoaded = useRef(new Set());
    const loadingScripts = useRef(new Set());
    
    const loadEmbedContent = (htmlContent, targetElement) => {
        if (!htmlContent || typeof htmlContent !== 'string' || !targetElement) return htmlContent;
        
        // Create temporary container to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Extract and load scripts
        const scripts = tempDiv.querySelectorAll('script');
        
        scripts.forEach((script, index) => {
            if (script.src) {
                // External script
                if (!scriptsLoaded.current.has(script.src) && !loadingScripts.current.has(script.src)) {
                    loadingScripts.current.add(script.src);
                    
                    const newScript = document.createElement('script');
                    
                    // Copy all attributes
                    Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    
                    newScript.src = script.src;
                    
                    newScript.onload = () => {
                        scriptsLoaded.current.add(script.src);
                        loadingScripts.current.delete(script.src);
                        
                        // Execute inline scripts after external script loads
                        setTimeout(() => {
                            executeInlineScripts(tempDiv, targetElement);
                        }, 100);
                    };
                    
                    newScript.onerror = () => {
                        loadingScripts.current.delete(script.src);
                        console.error(`Failed to load script: ${script.src}`);
                    };
                    
                    document.head.appendChild(newScript);
                } else if (scriptsLoaded.current.has(script.src)) {
                    // Script already loaded, execute inline scripts
                    setTimeout(() => {
                        executeInlineScripts(tempDiv, targetElement);
                    }, 100);
                }
            } else {
                // Inline script - execute with proper context
                setTimeout(() => {
                    try {
                        // Create script with proper context for HubSpot forms
                        const scriptContent = script.textContent;
                        
                        // Check if it's a HubSpot form script and modify it to target our container
                        if (scriptContent.includes('hbspt.forms.create')) {
                            executeHubSpotScript(scriptContent, targetElement);
                        } else {
                            // Execute other inline scripts normally
                            const newScript = document.createElement('script');
                            newScript.textContent = scriptContent;
                            
                            // Append to container instead of head for better targeting
                            targetElement.appendChild(newScript);
                            
                            // Clean up after execution
                            setTimeout(() => {
                                if (newScript.parentNode) {
                                    newScript.parentNode.removeChild(newScript);
                                }
                            }, 100);
                        }
                    } catch (error) {
                        console.error('Error executing inline script:', error);
                    }
                }, 300 * (index + 1)); // Stagger execution
            }
        });
        
        // Return HTML without scripts for safe innerHTML
        return htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    };
    
    const executeHubSpotScript = (scriptContent, targetElement) => {
        try {
            // Check if form already exists in this container
            if (targetElement.querySelector('iframe, form, [id^="hsForm_"]')) {
                return;
            }
            
            // Extract the target selector if it exists
            const targetMatch = scriptContent.match(/target:\s*['"]([^'"]+)['"]/);
            const portalIdMatch = scriptContent.match(/portalId:\s*['"]?(\w+)['"]?/);
            const formIdMatch = scriptContent.match(/formId:\s*['"]([^'"]+)['"]/);
            
            if (window.hbspt && window.hbspt.forms) {
                // If HubSpot is loaded, create form directly
                const formConfig = {
                    target: `#${targetElement.id}`,
                    portalId: portalIdMatch ? portalIdMatch[1] : '',
                    formId: formIdMatch ? formIdMatch[1] : ''
                };
                
                // Extract other config options
                const configMatch = scriptContent.match(/hbspt\.forms\.create\s*\(\s*({[^}]+})\s*\)/);
                if (configMatch) {
                    try {
                        const config = new Function('return ' + configMatch[1])();
                        Object.assign(formConfig, config);
                        formConfig.target = `#${targetElement.id}`;
                    } catch (e) {
                        console.warn('Could not parse HubSpot form config:', e);
                    }
                }
                
                // Clear target element before creating form
                targetElement.innerHTML = '';
                window.hbspt.forms.create(formConfig);
            } else {
                // If HubSpot not loaded yet, modify script to target our container
                const modifiedScript = scriptContent.replace(
                    /target:\s*['"][^'"]*['"]/,
                    `target: '#${targetElement.id}'`
                );
                
                // Execute the modified script
                const scriptEl = document.createElement('script');
                scriptEl.textContent = modifiedScript;
                document.head.appendChild(scriptEl);
                
                setTimeout(() => {
                    if (scriptEl.parentNode) {
                        scriptEl.parentNode.removeChild(scriptEl);
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error executing HubSpot script:', error);
        }
    };
    
    const executeInlineScripts = (container, targetElement) => {
        const inlineScripts = container.querySelectorAll('script:not([src])');
        inlineScripts.forEach((script, index) => {
            setTimeout(() => {
                try {
                    const scriptContent = script.textContent;
                    if (scriptContent.includes('hbspt.forms.create')) {
                        executeHubSpotScript(scriptContent, targetElement);
                    } else {
                        new Function(scriptContent)();
                    }
                } catch (error) {
                    console.error('Error executing inline script:', error);
                }
            }, 100 * (index + 1));
        });
    };
    
    return { loadEmbedContent };
};