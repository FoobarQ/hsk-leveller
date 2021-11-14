const HSK1 = new Map();
const HSK2 = new Map();
const HSK3 = new Map();
const HSK4 = new Map();
const HSK5 = new Map();
const HSK6 = new Map();

function getPinyin(character, mandarinMaps) {
    for (const mandarinMap of mandarinMaps) {
        if (mandarinMap.has(character)) {
            return mandarinMap.get(character)
        }
    }
    return "";
}

function request(url, mandarinMap) {
    var xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4)
                return;
            const rows = xhr.responseText.split("\n");

            rows.forEach(row => {
                const [character, pinyin, english] = row.split("\t");
                mandarinMap.set(character, pinyin);
            });

        }

        xhr.onerror = function (error) {
            console.debug(error);
        }

        xhr.open("GET", url, true);
        xhr.send();
    } catch (e) {
        console.error(e);
    }
}

request(chrome.runtime.getURL("levels/one.txt"), HSK1);
request(chrome.runtime.getURL("levels/two.txt"), HSK2);
request(chrome.runtime.getURL("levels/three.txt"), HSK3);
request(chrome.runtime.getURL("levels/four.txt"), HSK4);
request(chrome.runtime.getURL("levels/five.txt"), HSK5);
request(chrome.runtime.getURL("levels/six.txt"), HSK6);

function addPinyin(plainText) {
    let annotatedText = "";
    let tempChars = "";
    let tempPinyin = "";
    for (const character of plainText) {
        if (getPinyin(character, [HSK1, HSK2, HSK3, HSK4, HSK5, HSK6])) {
            tempPinyin += `${getPinyin(character, [HSK1, HSK2, HSK3, HSK4, HSK5, HSK6])} `;
            tempChars += character;
        } else {
            if (tempPinyin) {
                annotatedText += `<ruby>${tempChars}<rt>${tempPinyin}</rt></ruby>`;
                tempPinyin = "";
                tempChars = "";
            } else {
                annotatedText += character;
            }
        }
    }

    if (tempPinyin) {
        annotatedText += `<ruby>${tempChars}<rt>${tempPinyin}</rt></ruby>`;
    }

    return annotatedText;
}

setTimeout(() => {
    const elements = document.querySelectorAll("h3")
    elements.forEach(function (element) {
        if (element.innerHTML) {
            element.innerHTML = addPinyin(element.innerHTML);
        }
    });
}, 20000)
