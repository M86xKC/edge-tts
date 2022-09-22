const text = document.querySelector('.text');

const languageOptions = document.querySelector('.languages');
const voiceOptions = document.querySelector('.voices');

const rate = document.querySelector('.rate');
const pitch = document.querySelector('.pitch');

const speakButton = document.querySelector('.speak');
const stopButton = document.querySelector('.stop');
const pauseButton = document.querySelector('.pause');

let allVoices = [];
let allLanguages = [];

window.speechSynthesis.onvoiceschanged = () => {
    allVoices = speechSynthesis.getVoices();
    allVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.innerText = `${voice.name.split("-")[1]} - ${voice.name.split("-")[0].replace(/(Microsoft|Online \(Natural\))/g, '')}`;
        voiceOptions.appendChild(option);
    });

    allLanguages = allVoices.map(voice => `${voice.name.split("-")[1]} - ${voice.lang.split("-")[0]}`);
    allLanguages = [...new Set(allLanguages)];
    allLanguages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = `${language}`;
        languageOptions.appendChild(option);
    });
};

// update voices on language change
languageOptions.addEventListener('change', () => {
    if (languageOptions.value === 'All') {
        voiceOptions.innerHTML = '';
        allVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.innerText = `${voice.name.split("-")[1]} - ${voice.name.split("-")[0].replace(/(Microsoft|Online \(Natural\))/g, '')}`;
            voiceOptions.appendChild(option);
        });
    } else {
        const selectedLanguage = languageOptions.value.split(" - ")[1];
        const filteredVoices = allVoices.filter(voice => voice.lang.split("-")[0] === selectedLanguage);
        voiceOptions.innerHTML = '';
        filteredVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.innerText = `${voice.name.split("-")[1]} - ${voice.name.split("-")[0].replace(/(Microsoft|Online \(Natural\))/g, '')}`;
            voiceOptions.appendChild(option);
        });
    }
});

const speak = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.resume();
    } else if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    } else {
        const speakText = new SpeechSynthesisUtterance(text.value);
        const selectedVoice = voiceOptions.selectedOptions[0].value;
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        allVoices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });
        speechSynthesis.speak(speakText);
    }
};

const stop = () => {
    speechSynthesis.cancel();
};

const pause = () => {
    speechSynthesis.pause();
};

const save = () => {
    const speakText = new SpeechSynthesisUtterance(text.value);
    const selectedVoice = voiceOptions.selectedOptions[0].value;
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    allVoices.forEach(voice => {
        if (voice.name === selectedVoice) {
            speakText.voice = voice;
        }
    });
    speechSynthesis.speak(speakText);

    const audio = document.querySelector('.audio');
    const url = URL.createObjectURL(audio.src);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio.mp3';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

speakButton.addEventListener('click', e => speak());
stopButton.addEventListener('click', e => stop());
pauseButton.addEventListener('click', e => pause());

rate.addEventListener('change', e => rate.textContent = rate.value);
