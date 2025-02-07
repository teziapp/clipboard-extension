export function filterMatches(symbolObjects, nodeToBeTraversed = document.body) {
    console.log("ran")
    if (nodeToBeTraversed == document.body) {
        console.log("symbolsList")
        document.querySelectorAll('.levenshtineMatches').forEach((node) => {
            node.parentNode.replaceChild(document.createTextNode(node.textContent), node)
        })
    }

    symbolObjects.forEach((symbolObj) => {

        symbolObj.symbols.forEach((symbol) => {

            let nodes = document.createTreeWalker(nodeToBeTraversed, NodeFilter.SHOW_TEXT, {
                acceptNode: function (node) {
                    // Skip if parent is already highlighted or is a script/style
                    if (node.parentNode.classList?.contains('levenshtineMatches') ||
                        ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.parentNode.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });

            let currentNode;
            let nodesArray = [];

            while (currentNode = nodes.nextNode()) {
                nodesArray.push(currentNode)
            }


            nodesArray.forEach((node) => {
                //start
                let text = node.nodeValue


                let regexPattern = symbol.replace(/[\s.\-]+/g, "[\\s.\\-]*");
                let regex = new RegExp(`\\b${regexPattern}\\b`, "i");

                if (text.match(regex)) {
                    const parts = text.split(regex)
                    const frag = document.createDocumentFragment()

                    parts.forEach((part, index) => {

                        if (index % 2 === 1) {
                            const span = document.createElement('span')

                            span.style.background = symbolObj.color || 'orange'
                            span.className = 'levenshtineMatches'

                            span.innerHTML += symbol

                            frag.appendChild(span)

                            span.addEventListener('mouseover', () => {

                                const flagButton = document.getElementById('flagButton')

                                flagButton.classList.remove('hide')
                                flagButton.style.top = span.getBoundingClientRect().y - 15 + "px"
                                flagButton.style.left = span.getBoundingClientRect().x - 25 + "px"

                                flagButton.removeEventListener("click", flagButton._clickHandler)

                                flagButton._clickHandler = (e) => {
                                    console.log(symbol)
                                    e.preventDefault()
                                    e.stopPropagation()

                                    chrome.runtime.sendMessage({
                                        msg: 'clickedSymbol', payload: {
                                            clickedSymbol: symbol,
                                            url: `${window.location.href}`
                                        }
                                    })
                                }

                                flagButton.addEventListener('click', flagButton._clickHandler)

                            })


                        } else {
                            frag.appendChild(document.createTextNode(part))
                        }
                    })

                    node.parentNode?.replaceChild(frag, node)


                }

            })

        })

    })

    //end


}