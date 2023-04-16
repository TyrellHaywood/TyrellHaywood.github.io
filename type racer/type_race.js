const random_quote_api_url = 'https://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quote-display')
const quoteInputElement = document.getElementById('textbox')
const timerElement = document.getElementById('timer')
const progressBarElement = document.getElementById('filler')
const wpmElement = document.getElementById('wpm')
const audioElement = document.getElementById('audio')
audioElement.volume = 0.1 //sound is *very* loud by default
const mute = document.getElementById('mute')
let startTime
let timerInterval // declared early to be accessed in "renderNextQuote" function

mute.addEventListener('click', function() {
    
    console.log('mute button clicked')
    if (audioElement.muted) {
        audioElement.muted = false
        mute.classList.add('unmuted')
        mute.classList.remove('mute')
    } else {
        audioElement.muted = true
        mute.classList.remove('unmuted')
        mute.classList.add('mute')
    }
})

quoteInputElement.addEventListener('keydown', (event) => { //listen for the keydown event instead of the input event, so that the timer starts only when the first key is pressed
    if (!startTime) {
        startTimer()
    }
})



quoteInputElement.addEventListener('input', () => { // this gets called when anything within textbox changes (typing or deleting)
    const arrQuote = quoteDisplayElement.querySelectorAll('span')
    const arrValue = quoteInputElement.value.split('')
    const arrWords = quoteDisplayElement.innerText.split(' ') // makes an array of quote words
    let errorCount = 0

    let correct = true
    arrQuote.forEach((characterSpan, index) => {
        const character = arrValue[index] // matches current index character to current typed character
        const progress = (arrValue.length / arrQuote.length) * 100 // calculates percentage of characters typed and changes progress bar width
        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
            progressBarElement.style.width = progress + '%' // controls progress bar, still needs some tweaking**
        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false
            console.log('mistake!!')
            errorCount ++
            console.log(errorCount)
        }
    })

    if (correct) {
        const finalTime = timerElement.innerText / 60 //takes the time value at the end, and turns it from seconds to minutes
        const wordsPerMinute = Math.round(arrWords.length / finalTime) //this calculates our wpm by dividing the amount of words by our final time (in minutes), and rounds to nearest whole number
        console.log(wordsPerMinute)

        wpmElement.innerText = wordsPerMinute

        renderNextQuote() //renders next quote once typing is complete 
    } 
    
})



function getRandomQuote() {
    return fetch(random_quote_api_url)
        .then(response => response.json())
        .then(data => data.content) // accesses content from all data in url
}


async function renderNextQuote() {
    const quote = await getRandomQuote()
    quoteDisplayElement.innerHTML = ''
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span') /* looping thru to get each character of our string, creating a span for it, and setting the text of span to that character */
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value = null
    startTime = null
    clearInterval(timerInterval)
    progressBarElement.style.width = '0%' // resets the progress bar width at the end. this is sometimes causing a bug where nothing resetsd
}


function startTimer() {
    startTime = new Date()
    timerElement.innerText = 0;
    timerInterval = setInterval(() => {
        timer.innerText = getTimerTime()
    }, 1000);
}


function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000)
}

renderNextQuote()

/* --0o----*--other stuff to add---*-----Oo0o--**--

- shows amount of mistakes made


*/