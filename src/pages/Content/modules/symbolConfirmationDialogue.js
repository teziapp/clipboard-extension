export default function symbolConfirmationDialog(nearestSymbols, clickedSymbol) {

    const dialog = document.createElement('dialog');
    dialog.className = 'custom-dialog';
    document.body.appendChild(dialog);

    // Create container for the symbols list
    const symbolsContainer = document.createElement('div');
    symbolsContainer.className = 'symbols-container';

    const header = document.createElement('h2')
    header.textContent = 'Did you mean...'
    symbolsContainer.appendChild(header)

    nearestSymbols.forEach((symbol) => {
        if (!symbol) return

        const div = document.createElement('div');
        div.className = 'symbol-item';

        // Symbol text
        const span = document.createElement('span');
        span.textContent = symbol.symbols.join(', ');
        span.className = 'symbol-text';
        div.appendChild(span);

        // Select button
        const button = document.createElement('button');
        button.textContent = 'Select';
        button.className = 'select-button';
        button.onclick = () => {
            chrome.runtime.sendMessage({
                msg: 'symbolConfirmed',
                payload: {
                    confirmedSymbol: symbol,
                    newSymbol: clickedSymbol,
                }
            });
            dialog.close()
        };
        div.appendChild(button);

        symbolsContainer.appendChild(div);
    });

    dialog.appendChild(symbolsContainer);

    // Create the horizontal bar with input and button
    const footerBar = document.createElement('div');
    footerBar.className = 'footer-bar';
    const inputDiv = document.createElement('div')
    footerBar.appendChild(inputDiv)

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter title for new symbol';
    inputField.className = 'input-field';
    inputDiv.appendChild(inputField);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.className = 'add-button';
    addButton.onclick = () => {
        const title = inputField.value.trim();
        if (title) {
            chrome.runtime.sendMessage({
                msg: 'addNewSymbol',
                payload: {
                    title: title,
                    symbolValue: clickedSymbol
                }
            }, (res) => {
                console.log(res)
            });
            inputField.value = '';
        }
        dialog.close()
    };

    inputDiv.appendChild(addButton);

    const clarifyPara = document.createElement('p')
    clarifyPara.innerHTML += `*if none of the options above seems to match with <strong>${clickedSymbol}</strong>, Add it to your dataset from here!`
    footerBar.appendChild(clarifyPara)

    dialog.appendChild(footerBar);


    document.body.appendChild(dialog);

    dialog.close();
    dialog.showModal();

}