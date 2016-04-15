//合成的方案，简单的sine wave声音，一种方案外部setTimeout控制时间，一种使用Web Audio自己的时间控制。
// 第一种synth内核好做点，但是用到了不太准确的setTimeout。第二种时间更精准，但是不太好做schedule
//与sample.js不同时存在
$(function() {
    function Synth() {
        this.init.apply(this, arguments);
    }
    var ctx = new(window.AudioContext || window.webkitAudioContext)();
    var sineNoteNodes = [];
    var squareNoteNodes = [];

    function noteNumberToFrequency(note) {
        return 440.0 * Math.pow(2, (note - 69.0) / 12.0);
    }

/************  第一种方案，发声自己不控制时间，调用就直接出声，时间由外部setTime定  *************/
    function startMidiNoteWithTimre(midi, timbre) {
        var midiNote = midi[1];
        if (timbre == undefined) {
            timbre = 'sine';
        }
        var oscillator = ctx.createOscillator();
        oscillator.type = timbre;
        oscillator.frequency.value = noteNumberToFrequency(midiNote);
        var gain = ctx.createGain();
        oscillator.connect(gain);
        gain.gain.value = midi[2]/127.0;
        gain.connect(ctx.destination);
        oscillator.start();
        if (timbre == 'sine') {
            sineNoteNodes[midiNote] = oscillator;
        } else if (timbre == ['square']) {
            squareNoteNodes[midiNote] = oscillator;
        }
    }

    function stopMidiNoteWithTimre(midi, timbre) {
        if (timbre == undefined) {
            timbre = 'sine';
        }
        var midiNote = midi[1];
        if (timbre == 'sine') {
            sineNoteNodes[midiNote].stop();
        } else if (timbre == 'square') {
            squareNoteNodes[midiNote].stop();
        }
    }

    Synth.prototype = {
        init: function() {
            console.log('synth inited');
        },
        handleMidiMsg: function(midi, timbre, instrument) {
            if (midi[0] == 144) {
                startMidiNoteWithTimre(midi, timbre);
            } else if (midi[0] == 128) {
                stopMidiNoteWithTimre(midi, timbre);
            }
        },
        testMakeSound: function() {
            startMidiNoteWithTimre([144,64,100],'sine');
        }
    }

/*************  第二套方案，发声自己控制时间  ************/
    // function startMidiNoteWithTimre(midi, timbre,tt) {
    //     // console.log('web audio currentTime: '+ctx.currentTime*1000);
    //     // console.log('what is tt:' + tt);
    //     var midiNote = midi[1];
    //     if (timbre == undefined) {
    //         timbre = 'sine';
    //     }
    //     var oscillator = ctx.createOscillator();
    //     oscillator.type = timbre;
    //     oscillator.frequency.value = noteNumberToFrequency(midiNote);
    //     var gain = ctx.createGain();
    //     oscillator.connect(gain);
    //     // gain.gain.value = 0;
    //     gain.gain.setValueAtTime(0, tt);
    //     gain.gain.linearRampToValueAtTime(midi[2]/127.0,tt+.1);
    //     gain.connect(ctx.destination);
    //     oscillator.start(tt);
    //     if (timbre == 'sine') {
    //         sineNoteNodes[midiNote] = oscillator;
    //     } else if (timbre == ['square']) {
    //         squareNoteNodes[midiNote] = oscillator;
    //     }
    // }

    // function stopMidiNoteWithTimre(midi, timbre,tt) {
    //     if (timbre == undefined) {
    //         timbre = 'sine';
    //     }
    //     var midiNote = midi[1];
    //     if (timbre == 'sine') {
    //         sineNoteNodes[midiNote].stop(tt);
    //     } else if (timbre == 'square') {
    //         squareNoteNodes[midiNote].stop(tt);
    //     }
    // }

    // Synth.prototype = {
    //     init: function() {
    //         console.log('synth inited');
    //     },
    //     handleMidiMsg: function(midi, timbre, tt) {
    //         if (midi[0] == 144) {
    //             startMidiNoteWithTimre(midi, timbre, tt);
    //         } else if (midi[0] == 128) {
    //             stopMidiNoteWithTimre(midi, timbre, tt);
    //         }
    //     },
    //     testMakeSound: function() {
    //         startMidiNoteWithTimre([144,64,100],'sine');
    //     }
    // }

    window.Synth = new Synth();
})