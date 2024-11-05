import { printLine } from './modules/print';

console.log('Content script works!');


let currentSymbol

const button = document.createElement('button')
button.id = 'note-down'
button.textContent = '+'
button.style.cssText = `    
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #000000;
    cursor: pointer;
    background: rgb(0, 0, 0);
    z-index: 1000`

button.classList.add('hide-btn')

document.body.appendChild(button)

const onClickHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const clickedSymbol = currentSymbol.toLocaleLowerCase().replace(/[ .]/g, "")
    console.log(clickedSymbol)
    chrome.runtime.sendMessage({ msg: clickedSymbol }).then(() => console.log('messageSent : ', clickedSymbol))
}

button.addEventListener('click', onClickHandler)


document.querySelectorAll('td').forEach((i) => {

    const aTag = i.querySelector('a')

    if (!aTag) return

    i.addEventListener('mouseover', () => {

        currentSymbol = aTag.textContent

        document.getElementById('note-down').style.cssText += `
                            position: fixed;
                            top: ${i.getBoundingClientRect().y}px;
                            left: ${i.getBoundingClientRect().x + 100}px;
                        `;

        document.getElementById('note-down').classList.remove('hide-btn')

        //document.getElementById('note-down').addEventListener('click', onClickHandler)

    })

    // i.addEventListener('mouseout', () => {
    //     document.getElementById('note-down').classList.add('hide-btn')
    // })

})

window.addEventListener('scroll', () => {
    document.getElementById('note-down').classList.add('hide-btn')
})

console.log('now how abt thisss')






