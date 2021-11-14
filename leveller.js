const mandarinMap = new Map();
mandarinMap.set("爱", "ài");
mandarinMap.set("八", "bā");
mandarinMap.set("爸爸", "bà ba");
mandarinMap.set("北京", "Běi jīng");
mandarinMap.set("杯子", "bēi zi");
mandarinMap.set("本", "běn");
mandarinMap.set("不", "bù");
mandarinMap.set("不客气", "bú kè qi");
mandarinMap.set("菜", "cài");
mandarinMap.set("茶", "chá");
mandarinMap.set("吃", "chī");
mandarinMap.set("出租车", "chū zū chē");
mandarinMap.set("大", "dà");
mandarinMap.set("打电话", "dǎ diàn huà");
mandarinMap.set("的", "de");
mandarinMap.set("点", "diǎn");
mandarinMap.set("电脑", "diàn nǎo");
mandarinMap.set("电视", "diàn shì");
mandarinMap.set("电影", "diàn yǐng");
mandarinMap.set("东西", "dōng xi");
mandarinMap.set("都", "dōu");
mandarinMap.set("读", "dú");

function getPinyin(character) {
    console.log("trying");
    return mandarinMap.get(character) || "";
}

function addPinyin(plainText) {
    let annotatedText = "";
    let tempChars = "";
    let tempPinyin = "";
    for (const character of plainText) {
        console.log("one");
        if (getPinyin(character)) {
            tempPinyin += getPinyin(character);
            tempChars += character;
        } else {
            console.log("two");
            if (tempPinyin) {
                console.log("here");
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

    console.log(annotatedText);
    return annotatedText;
}

const elements = document.querySelectorAll("h3")
elements.forEach(function (element) {
    if (element.innerHTML) {
        element.innerHTML = addPinyin(element.innerHTML);
    }
});