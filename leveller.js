const characterGroup = {};
const HSK1 = new Map();
const HSK2 = new Map();
const HSK3 = new Map();
const HSK4 = new Map();
const HSK5 = new Map();
const HSK6 = new Map();
const HSK7 = new Map();

function getPinyin(character, mandarinMap) {
    if (mandarinMap.has(character)) {
        return mandarinMap.get(character)
    }

    return "";
}

async function request(url, mandarinMap) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        try {
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4)
                    return;
                const rows = xhr.responseText.split("\n");

                rows.forEach(row => {
                    const [character, pinyin, _] = row.split("\t");
                    mandarinMap.set(character, pinyin);
                });
                resolve()
            }

            xhr.onerror = function (error) {
                console.debug(error);
                reject(error);
            }

            xhr.open("GET", url, true);
            xhr.send();
        } catch (e) {
            console.error(e);
        }
    });
}

function addPinyin(plainText) {
    let annotatedText = "";
    let stack = 0;
    let found = false;

    for (const character of plainText) {
        found = false;
        if (character === "<") {
            stack++;
        } else if (character === ">") {
            stack--;
        } else if (!stack && !(/\d/.test(character))) {
            const levels = ["HSK6", "HSK5", "HSK4", "HSK3", "HSK2", "HSK1", "HSK7+"];
            for (const level of levels) {
                let pinyin;
                if ((pinyin = getPinyin(character, characterGroup[level]))) {
                    annotatedText += `<hsk pinyin="${pinyin.trim()}" class="${level}">${character}</hsk>`;
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            annotatedText += character;
        }
    }

    return annotatedText;
}

function decorate_characters(elements) {
    elements.forEach(function (element) {
        if (element.innerHTML && element.innerHTML.length > 0 && !element.innerHTML.includes("</hsk>")) {
            element.innerHTML = addPinyin(element.innerHTML);
        }
    });
}

function clear() {
    const elements = document.querySelectorAll(".hsk-leveller");
    elements.forEach(function (element) {
        element.remove();
    })
}

function refresh() {
    clear();
    decorate_characters();
}

function update() {
    decorate_characters(document.querySelectorAll("body p, h1, h2, h3, h4, h5, h6, h7, span, a"));
}

async function main() {
    await Promise.all([
        request(chrome.runtime.getURL("levels/1.txt"), HSK1),
        request(chrome.runtime.getURL("levels/2.txt"), HSK2),
        request(chrome.runtime.getURL("levels/3.txt"), HSK3),
        request(chrome.runtime.getURL("levels/4.txt"), HSK4),
        request(chrome.runtime.getURL("levels/5.txt"), HSK5),
        request(chrome.runtime.getURL("levels/6.txt"), HSK6),
        request(chrome.runtime.getURL("levels/7+.txt"), HSK7)
    ]);

    characterGroup["HSK1"] = HSK1;
    characterGroup["HSK2"] = HSK2;
    characterGroup["HSK3"] = HSK3;
    characterGroup["HSK4"] = HSK4;
    characterGroup["HSK5"] = HSK5;
    characterGroup["HSK6"] = HSK6;
    characterGroup["HSK7+"] = HSK7;
    const style = document.createElement("style");
    style.innerHTML = `    hsk:before {
        content: attr(pinyin);
        display: block;
        font-size: 50%;
        text-align: start;
        line-height: 1.2;
    }
    
    hsk {
        display: inline-block;
        text-indent: 0px;
        line-height: normal;
        -webkit-text-emphasis: none;
        text-align: center;
        line-height: 1;
    }`
    document.querySelector("body").appendChild(style);

    setInterval(update, 700);
}

main();