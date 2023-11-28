let currentLesson = [];
let currentIndex = 0;
let lessonStartTime;
let correctArray = [];
let goodKeys = 0;
let badKeys = 0;

function startLesson() {
    const lessonSelect = document.getElementById('lesson');
    const selectedLesson = lessonSelect.value;

    // Clear lesson success message
    document.getElementById('lessonStats').innerHTML = '';

    // Clear welcome message
    document.getElementById('textToType').setAttribute('hasTextToType', true);
    document.getElementById('textToType').innerHTML = '';

    // Reset lesson variables
    currentLesson = generateLessonText(selectedLesson, 50); // Defines length of the lesson
    correctArray = new Array(currentLesson.length).fill(true);
    currentIndex = 0;
    lessonStartTime = new Date();
    goodKeys = 0;
    badKeys = 0;

    updateTextToType();
    highlightCurrentKey();

    // Unfocus start lesson button
    //document.getElementById('lessonSelector').hidden=true;
}

function generateLessonText(lessonNumber, length) {
    const lessonKeys = getLessonKeys(lessonNumber);
    let text = '';
    let prevKey = '';
    for (let i = 0; i < length; i++) {
        let currentKey = lessonKeys[Math.floor(Math.random() * lessonKeys.length)];
        // Ensure the next key is different than the previous one
        while (currentKey === prevKey) {
            currentKey = lessonKeys[Math.floor(Math.random() * lessonKeys.length)];
        }
        text += currentKey.toLowerCase(); // Display in lowercase
        prevKey = currentKey;
    }
    return text;
}

function getLessonKeys(lessonNumber) {
    if (lessonNumber === '1') {
        return ['A', 'S', 'D', 'F', 'G'];
    } else if (lessonNumber === '2') {
        return ['H', 'J', 'K', 'L', ';'];
    } else if (lessonNumber === '3') {
        return ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'];
    } else if (lessonNumber === '4') {
        return ['Q', 'W', 'E', 'R', 'T', 'A', 'S', 'D', 'F', 'G'];
    } else if (lessonNumber === '5') {
        return ['Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', ';'];
    } else if (lessonNumber === '6') {
        return ['Q', 'W', 'E', 'R', 'T', 'A', 'S', 'D', 'F', 'G', 'Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', ';'];
    } else if (lessonNumber === '7') {
        return ['A', 'S', 'D', 'F', 'G', 'Z', 'X', 'C', 'V', 'B'];
    } else if (lessonNumber === '8') {
        return ['H', 'J', 'K', 'L', ';', 'N', 'M', '"', ',', '.', '/'];
    }
}

function updateTextToType() {
    const textToType = document.getElementById('textToType');
    textToType.innerHTML = currentLesson
        .split('')
        .map((letter, index) => `<span class="${index === currentIndex ? 'highlight' : ''} ${correctArray[index] ? '' : 'incorrect'}">${letter}</span>`)
        .join('');
}

function highlightCurrentKey() {
    const keyboard = document.getElementById('keyboard');
    // TODO: not every key is letter
    const keys = keyboard.getElementsByClassName('key--letter');

    Array.from(keys).forEach((key, index) => {
        if (currentIndex < currentLesson.length && key.textContent === currentLesson[currentIndex].toUpperCase()) {
            key.style.backgroundColor = '#66cc66'; // Highlight current key
        } else {
            key.style.backgroundColor = ''; // Remove highlight from other keys
        }
    });
}

function checkKeyPress(key) {
    if (key.toUpperCase() === currentLesson[currentIndex].toUpperCase()) {
        correctArray[currentIndex] = true;
        goodKeys++;
    } else {
        correctArray[currentIndex] = false;
        badKeys++;
    }

    currentIndex++;

    updateTextToType();
    highlightCurrentKey();            

    if (currentIndex === currentLesson.length) {
        endLesson();
    }

    // Play sound effect
    const keySound = document.getElementById('keySound');
    keySound.currentTime = 0; // Reset to the beginning
    keySound.play();
}

function endLesson() {
    const lessonStats = document.getElementById('lessonStats');
    const lessonEndTime = new Date();
    const lessonDuration = (lessonEndTime - lessonStartTime) / 1000; // in seconds
    const keysPerMinute = Math.round(((goodKeys + badKeys) / lessonDuration) * 60); // in keys per minute

    lessonStats.innerHTML = `
        <p>Lesson completed!</p>
        <p>Keys per minute: ${keysPerMinute}</p>
        <p>Good keys: ${goodKeys}</p>
        <p>Bad keys: ${badKeys}</p>
    `;

    // Play success sound
    const successSound = document.getElementById('successSound');
    successSound.play();
}

// Enable keyboard input
document.addEventListener('keydown', (event) => {
    const pressedKey = event.key.toUpperCase();
    checkKeyPress(pressedKey);
});

// Keyboard handling functions
function getKey (e) {
    var location = e.location;
    var selector;
    if (location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
        selector = ['[data-key="' + e.keyCode + '-R"]']
    } else {
        var code = e.keyCode || e.which;
        selector = [
            '[data-key="' + code + '"]',
            '[data-char*="' + encodeURIComponent(String.fromCharCode(code)) + '"]'
        ].join(',');
    }
    return document.querySelector(selector);
}

function pressKey (char) {
    var key = document.querySelector('[data-char*="' + char.toUpperCase() + '"]');
    if (!key) {
        return console.warn('No key for', char);
    }
    key.setAttribute('data-pressed', 'on');
    setTimeout(function () {
        key.removeAttribute('data-pressed');
    }, 200);
}

var h1 = document.querySelector('h1');
var originalQueue = h1.innerHTML;
var queue = h1.innerHTML;

function next() {
    if (h1.getAttribute('hasTextToType') !== null) {
        return
    }

    var c = queue[0];
    queue = queue.slice(1);
    h1.innerHTML = originalQueue.slice(0, originalQueue.length - queue.length);
    pressKey(c);
    if (queue.length) {
        setTimeout(next, Math.random() * 200 + 50);
    }
}

h1.innerHTML = "&nbsp;";
setTimeout(next, 500);

document.body.addEventListener('keydown', function (e) {
    var key = getKey(e);
    if (!key) {
        return console.warn('No key for', e.keyCode);
    }

    key.setAttribute('data-pressed', 'on');
});

document.body.addEventListener('keyup', function (e) {
    var key = getKey(e);
    key && key.removeAttribute('data-pressed');
});

function size () {
    var size = keyboard.parentNode.clientWidth / 90;
    keyboard.style.fontSize = size + 'px';
    console.log(size);
}

var keyboard = document.querySelector('.keyboard');
window.addEventListener('resize', function (e) {
    size();
});
size();