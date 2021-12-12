const characterGroup = new Map();
const HSK1 = new Map();
const HSK2 = new Map();
const HSK3 = new Map();
const HSK4 = new Map();
const HSK5 = new Map();
const HSK6 = new Map();
const HSK7 = new Map();
const selection = {
    lower: 0,
    higher: 6
}
const levels = ["HSK6", "HSK5", "HSK4", "HSK3", "HSK2", "HSK1", "HSK7+"];


function getPinyin(character, characterGroup) {
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
    const allCharacters = Array.from(characterGroup.keys()).join(":");
    for (let i = 0; i < plainText.length; i++) {
        let character = plainText[i];
        if (character === "<") {
            stack++;
        } else if (character === ">") {
            stack--;
        } else if (!stack && !(/(\d|\w|\s)/.test(character)) && allCharacters.includes(character) && character.trim()) {
            while (true) {
                character += plainText[i + 1];
                if (allCharacters.includes(character))
                    i++;
                else {
                    character = character.replace("undefined", "");
                    i++;
                    while (character.length > 1 && !characterGroup.has(character)) {
                        character = character.slice(0, -1);
                        i--;
                    }
                    break;
                }
            }


            if (characterGroup.has(character)) {
                const [pinyin, level] = characterGroup.get(character).split(":");
                const pinyinParts = pinyin.trim().split(" ");
                const characterParts = character.split("");
                if (pinyinParts.length === 1)
                    annotatedText += `<hsk pinyin="${pinyin}" class="${level}" ${hskLevelInRange(level) ? "" : "disabled"}>${character}</hsk>`
                else {
                    for (let j = 0; j < characterParts.length; j++) {
                        annotatedText += `<hsk pinyin="${pinyinParts[j]}" class="${level}" ${hskLevelInRange(level) ? "" : "disabled"}>${characterParts[j]}</hsk>`;
                    }
                }
                continue;
            }
        }
        annotatedText += character;
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

function update() {
    decorate_characters(document.querySelectorAll("body p, h1, h2, h3, h4, h5, h6, h7, span, a"));
}

function setSelection(lower, higher) {
    selection.lower = lower;
    selection.higher = higher;
    for (const level of levels) {
        if (!document.getElementsByClassName(level))
            continue;

        if (hskLevelInRange(level)) {
            for (const element of document.getElementsByClassName(levels[i])) {
                element.removeAttribute("disabled");
            }
        } else {
            for (const element of document.getElementsByClassName(levels[i])) {
                element.setAttribute("disabled", "");
            }
        }
    }
}

function hskLevelInRange(level) {
    const index = levels.indexOf(level);
    return !(index < selection.lower || index > selection.higher);
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.functionName === "setSelection")
        setSelection(message.lower, message.higher);
});

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

    for (const key of HSK6.keys()) {

        (!characterGroup.has(key) && HSK6.get(key)) ? characterGroup.set(key, `${HSK6.get(key)}:HSK6`) : "";
    }

    for (const key of HSK5.keys()) {
        if (key.includes("动画"))
            console.log(key);
        (!characterGroup.has(key) && HSK5.get(key)) ? characterGroup.set(key, `${HSK5.get(key)}:HSK5`) : "";
    }

    for (const key of HSK4.keys()) {

        (!characterGroup.has(key) && HSK4.get(key)) ? characterGroup.set(key, `${HSK4.get(key)}:HSK4`) : "";
    }

    for (const key of HSK3.keys()) {

        (!characterGroup.has(key) && HSK3.get(key)) ? characterGroup.set(key, `${HSK3.get(key)}:HSK3`) : "";
    }

    for (const key of HSK2.keys()) {

        (!characterGroup.has(key) && HSK2.get(key)) ? characterGroup.set(key, `${HSK2.get(key)}:HSK2`) : "";
    }

    for (const key of HSK1.keys()) {

        (!characterGroup.has(key) && HSK1.get(key)) ? characterGroup.set(key, `${HSK1.get(key)}:HSK1`) : "";
    }

    for (const key of HSK7.keys()) {

        (!characterGroup.has(key) && HSK7.get(key)) ? characterGroup.set(key, `${HSK7.get(key)}:HSK7+`) : "";
    }

    const style = document.createElement("style");
    style.innerHTML = `
    hsk:not([disabled]):before {
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