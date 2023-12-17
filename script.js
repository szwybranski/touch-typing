let lessonCharLength = 50;
let currentLesson = [];
let currentIndex = 0;
let lessonStartTime;
let correctArray = [];
let goodKeys = 0;
let badKeys = 0;

let lessons = [
    ['fff','jjj'],
    ['f','j',' '],
    ['ddd','kkk'],
    ['d','k',' '],
    ['sss','lll'],
    ['s','l',' '],
    ['aaa',';;;'],
    ['a',';',' '],
    ['ggg','hhh'],
    ['g','h',' '],
    ['rrr','uuu'],
    ['r','u',' '],
    ['eee','iii'],
    ['e','i',' '],
    ['www','ooo'],
    ['w','o',' '],
    ['qqq','ppp'],
    ['q','p',' '],
    ['ttt','yyy'],
    ['t','y',' '],
    ['vvv','mmm'],
    ['v','m',' '],
    ['ccc',',,,'],
    ['c,',' '],
    ['xxx','...'],
    ['x','.',' '],
    ['zzz','///'],
    ['z','/',' '],
    ['bbb','nnn'],
    ['b','n',' '],
    ['aaa','sss','ddd','fff'],
    ['a','s','d','f'],
    ['jjj','kkk','lll',';;;'],
    ['j','k','l',';'],
    ['a','s','d','f','g',' '],
    ['h','j','k','l',';',' '],
    ['a','s','d','f','j','k','l',';'],
    ['a','s','d','f','g','h','j','k','l',';',' '],
    ['q','w','e','r'],
    ['u','i','o','p'],
    ['q','w','e','r','t',' '],
    ['y','u','i','o','p',' '],
    ['q','w','e','r','u','i','o','p'],
    ['q','w','e','r','t','y','u','i','o','p',' '],
    ['a','s','d','f','q','w','e','r'],
    ['j','k','l',';','u','i','o','p'],
    ['a','s','d','f','g','q','w','e','r','t',' '],
    ['h','j','k','l',';','y','u','i','o','p',' '],
    ['a','s','d','f','g','q','w','e','r','t','h','j','k','l',';','y','u','i','o','p',' '],
    ['z','x','c','v'],
    ['m',',','.','/'],
    ['z','x','c','v','b',' '],
    ['n','m',',','.','/',' '],
    ['z','x','c','v','m',',','.','/'],
    ['z','x','c','v','b','n',',','.','/',' '],
    ['a','s','d','f','z','x','c','v'],
    ['j','k','l',';','m',',','.','/'],
    ['a','s','d','f','g','z','x','c','v','b',' '],
    ['h','j','k','l',';','n','m',',','.','/',' '],
    ['a','s','d','f','g','z','x','c','v','b','h','j','k','l',';','n','m',',','.','/',' '],
];

var select = document.getElementById('lesson');
for (var i = 0; i<lessons.length; ++i) {
    var opt = document.createElement('option');
    opt.value = i + 1;
    opt.innerHTML = 'Lesson ' + (i + 1);
    select.appendChild(opt);
}

function getLessonKeys(lessonNumber) {
    console.assert(lessonNumber > 0 && lessonNumber <= lessons.length, "Undefined lesson number")
    // Lessons start at 0, but are presented starting at 1
    return lessons[lessonNumber - 1]; 
}

function startLesson() {
    const lessonSelect = document.getElementById('lesson');
    const selectedLesson = lessonSelect.value;

    // Clear lesson success message and its class
    var lessonStats = document.getElementById('lessonStats');
    lessonStats.innerHTML = '';
    
    // Clear welcome message
    document.getElementById('textToType').setAttribute('hasTextToType', true);
    document.getElementById('textToType').innerHTML = '';

    // Reset lesson variables
    currentLesson = generateLessonText(selectedLesson, lessonCharLength);
    correctArray = new Array(currentLesson.length).fill(true);
    currentIndex = 0;
    lessonStartTime = new Date();
    goodKeys = 0;
    badKeys = 0;

    updateTextToType();
    highlightCurrentKey();

    // Unfocus start lesson button
    document.getElementById('startLessonButton').blur();
}

function generateLessonText(lessonNumber, length) {
    const lessonKeys = getLessonKeys(lessonNumber);
    let text = '';
    let prevKey = '';
    while (true) {
        let currentKey = lessonKeys[Math.floor(Math.random() * lessonKeys.length)];
        // Ensure the next key is different than the previous one
        while (currentKey === prevKey) {
            currentKey = lessonKeys[Math.floor(Math.random() * lessonKeys.length)];
        }
        text += currentKey;
        prevKey = currentKey;

        // Stop if we are at or exeeding lesson length
        if (text.length >= length) {
            break
        }
        
    }
    return text;
}

function letterToHtml(letter) {
    switch(letter) {
        case ' ':
            return '&nbsp;';
        default:
            return letter;
    }
}

function updateTextToType() {
    const textToType = document.getElementById('textToType');
    textToType.innerHTML = currentLesson
        .split('')
        .map((letter, index) => `<span class="${index === currentIndex ? 'highlight' : ''} ${correctArray[index] ? '' : 'incorrect'}">${letterToHtml(letter)}</span>`)
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

    if (currentIndex < currentLesson.length && currentLesson[currentIndex] === ' ') {
        keyboard.getElementsByClassName('key--space')[0].style.backgroundColor = '#66cc66';
    } else {
        keyboard.getElementsByClassName('key--space')[0].style.backgroundColor = '';
    }
}

function checkKeyPress(key) {
    if (currentIndex === currentLesson.length) {
        return;
    }

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

    playSound('keySound');
}

function playSound(soundName) {
    // Play sound effect
    const sound = document.getElementById(soundName);
    sound.currentTime = 0; // Reset to the beginning
    sound.play();
}

function scheduleNextLesson() {
    const lessonSelect = document.getElementById('lesson');

    // Don't advance if we are on the last lesson
    if (lessonSelect.value < lessons.length) {
        lessonSelect.value = parseInt(lessonSelect.value) + 1;
        setTimeout(startLesson, 5000)
    }
}

function getSpeedMotivation(keysPerMinute) {
    if (keysPerMinute >= 80) {
        return "Amazing! Typing like a falcon flying high—reaching new heights!";
    } else if (keysPerMinute >= 60) {
        return "Wow, fast! Quick as a gazelle running on the grass.";
    } else if (keysPerMinute >= 40) {
        return "Cool! Typing like a hummingbird moving from flower to flower.";
    } else if (keysPerMinute >= 20) {
        return "Awesome! Typing smooth as a dolphin gliding through water.";
    } else {
        return "Keep it up! You're like a tortoise—steady progress wins the race!";
    }
}

function getAccuracyMotivation(accuracy) {
    if (accuracy >= 90) {
        return "Perfect precision! Your fingers hit the right keys like a puzzle falling into place. Keep up the flawless work!";
    } else if (accuracy >= 80) {
        return "Great effort! You're navigating the keyboard like an explorer finding the right path. Keep honing those accuracy skills!";
    } else if (accuracy >= 70) {
        return "Good progress! Just like a painter refining their masterpiece, you're getting closer to the perfect strokes. Keep fine-tuning those typing skills!";
    } else if (accuracy >= 60) {
        return "Nice try! Mistakes are like stepping stones to success. You're learning and growing with every key press. Keep going, you're on the right track!";
    } else {
        return "No worries! Every typing journey has bumps along the way. Think of them as little hiccups in a big adventure. Keep typing, and soon those hiccups will turn into smooth sentences!";
    }
}

function getBackgroundColorForAccuracyBar(accuracy) {
    if (accuracy >= 90) {
        return "#72e01e"; // green
    } else if (accuracy >= 75) {
        return "#f2d31b"; // yellow
    } else if (accuracy >= 50) {
        return "f39c12"; // orange
    } else if (accuracy >= 25) {
        return "hotpink";
    } else {
        return "red";
    }
}

function endLesson() {
    const lessonStats = document.getElementById('lessonStats');
    const lessonEndTime = new Date();
    const lessonDuration = (lessonEndTime - lessonStartTime) / 1000; // in seconds
    const keysPerMinute = Math.round(((goodKeys + badKeys) / lessonDuration) * 60); // in keys per minute
    const accuracy = Math.round((goodKeys * 100) / (goodKeys + badKeys)); // percentage

    if (accuracy >= 60) {
        playSound('successSound');
    } else {
        playSound('failureSound');
    }

    bgcolor = getBackgroundColorForAccuracyBar(accuracy);
    accuracyMotivation = getAccuracyMotivation(accuracy);

    setTimeout(function() {
        const accuracyBar = document.getElementById('accuracy-bar');
        accuracyBar.style.width = CSS.percent(Math.max(1, accuracy));
        accuracyBar.style.backgroundColor = bgcolor;
    }, 200);

    lessonStats.innerHTML = `
        <p style="text-align:left; margin: 0 0 4px 4px;">Accuracy:</p>
        <div class="progress">
            <div id="accuracy-bar" class="progress-bar"></div>
        </div>
        <p style="text-align:left; margin: 8px 0 0 4px;">${accuracyMotivation}</p>
    `;
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
}

var keyboard = document.querySelector('.keyboard');
window.addEventListener('resize', function (e) {
    size();
});
size();


document.getElementById('startLessonButton').focus();