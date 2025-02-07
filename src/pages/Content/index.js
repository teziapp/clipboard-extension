import { filterMatches } from "./modules/dom-traversal/domTraversal";

let currentSymbol
let cursorX;
let cursorY;

export let symbolsList = [];
export let observer;

const flagButton = document.createElement('button')
flagButton.id = 'flagButton'
flagButton.classList.add('hide')
flagButton.textContent = '📌'
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




chrome.runtime.sendMessage({ msg: 'requestedSymbolList' }, (res) => {

    if (!res?.length) {
        console.log("Didn't recieve symbols")
        return;
    }

    symbolsList = res;

    filterMatches(symbolsList)
    //startObserving()

})
