import { printLine } from './modules/print';




console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");


console.log('heyyyy hamzaaaaaa now it works fine')


document.querySelectorAll('td').forEach((i) => {


    const anchor = i.querySelector('a')


    if (anchor == null) return


    const button = document.createElement('button')
    button.className = 'note-down'
    button.textContent = '+'
    button.onclick = (e) => {
        e.preventDefault()
        const clickedSymbol = anchor.textContent.toLocaleLowerCase().replace(/[ .]/g, "")

        chrome.runtime.sendMessage({ msg: clickedSymbol }).then(() => console.log('messageSent : ', clickedSymbol))

    }

    i.appendChild(button)
})

console.log('now how abt thisss')






