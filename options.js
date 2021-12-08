/*var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = "HSK" + this.value;
}
*/
var slider = document.getElementById('slidecontainer');

noUiSlider.create(slider, {

    range: {
        'min': 0,
        'max': 6
    },

    step: 1,

    // Handles start at ...
    start: [0, 2],

    // Display colored bars between handles
    connect: true,

    // Put '0' at the bottom of the slider
    direction: 'ltr',
    orientation: 'vertical',

    // Move handle on tap, bars are draggable
    behaviour: 'tap-drag',
});

const levels = document.querySelectorAll("#labelcontainer li");
slider.noUiSlider.on("update", function (values, handle, unencoded, tap, positions, noUiSlider) {
    const levels = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK6+"];
    const lower = Number.parseInt(values[0]);
    const higher = Number.parseInt(values[1]);
    const from = document.getElementById("from");
    const to = document.getElementById("to");
    from.innerHTML = levels[lower];
    to.innerHTML = (lower == higher) ? "" : ` - ${levels[higher]}`;
    if (lower == higher) {
        to.innerHTML = "";
    } else {
        from.i
    }
    console.log(levels[Number.parseInt(values[0])]);
});

const button = document.getElementById("refresh");

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

button.onclick = function () {
    const [lower, higher] = slider.noUiSlider.get();
    getCurrentTab().then((tab) => {
        chrome.tabs.sendMessage(tab.id, {
            functionName: "setSelection",
            lower: Number.parseInt(lower),
            higher: Number.parseInt(higher)
        });
    });
};