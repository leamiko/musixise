//soundfont方案，使用了MIDI.js，明显有点过重了，但是引用了常用的soundfont,声音比较好扩展吧
//与synth.js不同时存在
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

    MIDI.loadPlugin({
        soundfontUrl: "/scripts/vendor/soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
            console.log(state, progress);
        },
        onsuccess: function() {
            MIDI.setVolume(0, 127);
            console.log('MIDI SOUNDS LOADED');
        }
    });
    function startMidiNote(midi) {
        MIDI.noteOn(0, midi[1], midi[2], 0);
    }

    function stopMidiNote(midi) {
        MIDI.noteOff(0, midi[1]);
    }

    Synth.prototype = {
        init: function() {
            console.log('synth inited');
        },
        handleMidiMsg: function(midi) {
            if (midi[0] == 144) {
                startMidiNote(midi);
            } else if (midi[0] == 128) {
                stopMidiNote(midi);
            }
        },
        testMakeSound: function() {
            startMidiNote([144,64,100]);
        }
    }
    window.Synth = new Synth();
})