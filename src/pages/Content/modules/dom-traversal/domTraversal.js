function adjustHighlighter(bgRGBA, highlightHash) {
    function rgbaToRGB(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return null;
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
        };
    }

    function hashToRGB(hash) {
        hash = hash.replace(/^#/, "");
        if (hash.length === 3) {
            hash = hash.split("").map(char => char + char).join("");
        }
        const bigint = parseInt(hash, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    function rgbToHash({ r, g, b }) {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).padStart(6, "0")}`;
    }

    const bgRGB = rgbaToRGB(bgRGBA);
    const highlightRGB = hashToRGB(highlightHash);

    if (!bgRGB || !highlightRGB) return highlightHash; // Return original if parsing fails

    // Find the max brightness in the background RGB
    const maxBG = Math.max(bgRGB.r, bgRGB.g, bgRGB.b);

    // Improved ratio formula: Handles dark mode better while keeping light mode mostly unchanged
    const ratio = 1 - Math.pow((maxBG / 255) * 0.8, 0.8);

    // Apply the ratio to highlighter color
    const adjustedHighlight = {
        r: Math.round(highlightRGB.r * ratio),
        g: Math.round(highlightRGB.g * ratio),
        b: Math.round(highlightRGB.b * ratio)
    };

    return rgbToHash(adjustedHighlight);
}

// Example Usage
console.log(adjustHighlighter("rgba(240, 240, 240, 1)", "#ffc800")); // Should stay bright
console.log(adjustHighlighter("rgba(30, 30, 30, 1)", "#00ff00")); // Should dim just right
console.log(adjustHighlighter("rgba(100, 50, 200, 1)", "#ff3232")); // Should balance well


function getActualBackgroundColor(element) {
    while (element) {
        const bgColor = window.getComputedStyle(element).backgroundColor;

        // Check if it's a valid, non-transparent color
        if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
            return bgColor;
        }

        element = element.parentElement; // Move to parent
    }
    return "white"; // Default background
}

// Usage Example: Get the actual background of any element


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
    function createHighlightedFragment(text, match, symbol, symbolObj, nodeBgColor) {
        const frag = document.createDocumentFragment();
        const span = document.createElement('span');

        span.style.background = adjustHighlighter(nodeBgColor, symbolObj.color || '#FFD0A3');
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
                        clickedSymbol: symbol
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

            let nodeBgColor = getActualBackgroundColor(node.parentElement);

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
                        symbolObj,
                        nodeBgColor
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
                        match.symbolObj,
                        match.nodeBgColor
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