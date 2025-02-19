export async function filterMatches(tokensArray, negatives, nodeToBeTraversed = document.body) {
    const negSet = new Set(negatives.map((neg) => `${neg.symId}:${neg.symbol}`));

    // Clear existing highlights if we're processing the whole document
    if (nodeToBeTraversed === document.body) {
        document.querySelectorAll('.levenshtineMatches').forEach((node) => {
            node.parentNode.replaceChild(document.createTextNode(node.textContent), node);
        });
    }

    // Create initial tree walker and get text nodes
    function getTextNodes(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    if (node.parentNode.classList?.contains('levenshtineMatches') ||
                        ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.parentNode.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];
        let currentNode;
        while (currentNode = walker.nextNode()) {
            nodes.push(currentNode);
        }
        return nodes;
    }

    // Process a single match within a text node
    function createHighlightedFragment(text, match, symbol, symbolObj) {
        const frag = document.createDocumentFragment();
        const span = document.createElement('span');

        span.style.background = symbolObj.color || 'orange';
        span.className = 'levenshtineMatches';
        span.innerHTML = match;

        // Add hover event listener
        span.addEventListener('mouseover', () => {
            const flagButton = document.getElementById('flagButton');
            flagButton.classList.remove('hide');
            flagButton.style.top = span.getBoundingClientRect().y - 20 + "px";
            flagButton.style.left = span.getBoundingClientRect().x - 30 + "px";

            flagButton.removeEventListener("click", flagButton._clickHandler);
            flagButton._clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                chrome.runtime.sendMessage({
                    msg: 'clickedSymbol',
                    payload: {
                        clickedSymbol: symbol,
                        url: `${window.location.href}`
                    }
                });
            };
            flagButton.addEventListener('click', flagButton._clickHandler);
        });

        return span;
    }

    try {

        // Process each text node
        let textNodes = getTextNodes(nodeToBeTraversed);

        for (const node of textNodes) {
            let text = node.nodeValue;
            let matches = [];

            // Find all matches for all symbols in this text node
            for (const { symbol, symbolObj } of tokensArray) {
                const isNegative = negSet.has(`${symbolObj.symId}:${symbol.toLocaleLowerCase().replace(/[ .]/g, "")}`);
                if (isNegative) continue;

                const regexPattern = symbol.replace(/[\s.\-]+/g, "[\\s.\\-]*");
                const regex = new RegExp(`\\b${regexPattern}\\b`, "gi");

                let match;
                while ((match = regex.exec(text)) !== null) {
                    const existingMatch = matches.find((existingMatch) => existingMatch.symbolObj.symId == symbolObj.symId)
                    if (existingMatch?.index < match?.index && existingMatch?.text.length > match?.index) continue;
                    matches.push({
                        index: match.index,
                        length: match[0].length,
                        text: match[0],
                        symbol,
                        symbolObj
                    });
                }
            }

            // Sort matches by index
            matches.sort((a, b) => a.index - b.index);

            // Create fragments with highlights
            if (matches.length > 0) {
                const frag = document.createDocumentFragment();
                let lastIndex = 0;

                for (const match of matches) {

                    // Add text before the match
                    if (match.index > lastIndex) {
                        frag.appendChild(document.createTextNode(
                            text.substring(lastIndex, match.index)
                        ));
                    } else if (match.index < lastIndex) continue;

                    // Add the highlighted match
                    const highlightSpan = createHighlightedFragment(
                        text,
                        match.text,
                        match.symbol,
                        match.symbolObj
                    );
                    highlightSpan.textContent = match.text;
                    frag.appendChild(highlightSpan);

                    lastIndex = match.index + match.length;
                }

                // Add any remaining text
                if (lastIndex < text.length) {
                    frag.appendChild(document.createTextNode(
                        text.substring(lastIndex)
                    ));
                }

                node.parentNode.replaceChild(frag, node);
            }
        }
    } catch (error) {
        console.error('Error in filterMatches:', error);
    }
}