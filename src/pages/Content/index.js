import { filterMatches } from "./modules/dom-traversal/domTraversal";

let currentSymbol
let cursorX;
let cursorY;

export let symbolsList = [];
let negativesList
export let observer;

const flagButton = document.createElement('button')
flagButton.id = 'flagButton'
flagButton.classList.add('hide')
flagButton.textContent = '📝'
document.body.appendChild(flagButton)


const button = document.createElement('button')
document.body.appendChild(button)

button.id = 'note-down'
button.textContent = '+'

button.classList.add('hide')


const onClickHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
    button.classList.add('hide')
    const clickedSymbol = currentSymbol.trim()
    console.log(clickedSymbol, " has been clicked")
    chrome.runtime.sendMessage({
        msg: 'clickedSymbol', payload: {
            clickedSymbol,
            url: `${window.location.href}`
        }
    })
}

button.addEventListener('click', onClickHandler)

window.addEventListener('scroll', () => {
    button.classList.add('hide')
    flagButton.classList.add('hide')
})

document.body.onmouseup = (e) => {
    // indicator.classList.add('hide')
    cursorX = e.clientX
    cursorY = e.clientY

    const selectionObj = window.getSelection()
    const selectedString = selectionObj.toString().trim()

    if (selectedString) {

        currentSymbol = selectedString

        document.getElementById('note-down').classList.remove('hide')
        button.style.top = cursorY - 30 + "px"
        button.style.left = cursorX + 30 + "px"
    } else {
        button.classList.add('hide')
    }
}

document.onselectionchange = () => {
    flagButton.classList.add('hide')
}

const startObserving = () => {

    if (observer) {
        observer.disconnect()
    }

    observer = new MutationObserver((mutations) => {

        let shouldTraverse;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes?.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && !node.classList?.contains('levenshtineMatches')) {
                        if (symbolsList.length) {
                            clearTimeout(window.mutationDebounceId)
                            window.mutationDebounceId = setTimeout(() => {
                                filterMatches(symbolsList, negativesList, mutation.target)
                            }, 100)
                        }
                    }
                })
            }

        })

    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })
}


chrome.runtime.sendMessage({ msg: 'requestedSymbolList', url: window.location.href }, (res) => {
    if (!res?.symbols?.length) {
        console.log("Didn't recieve symbols")
        return;
    }

    res.symbols.forEach((symbolObj) => {
        symbolObj.symbols.forEach((symbol) => {
            symbolsList.push({ symbol, symbolObj: { symId: symbolObj.symId, color: symbolObj.color } })
        })
    })

    negativesList = res.negatives.filter((negative) => {
        return negative.urls.find((url) => (window.location.href).includes(url))
    })

    symbolsList.sort((a, b) => b.symbol.length - a.symbol.length)
    filterMatches(symbolsList, negativesList)
    startObserving()

})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg === 'getUrl') {
        sendResponse(window.location.href)
    }
})
