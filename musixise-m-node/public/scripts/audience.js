$(function() {
    // Initialize variables
    var $window = $(window);
    var socket = io('http://io.musixise.com');
    var hisname = location.href.match(/.*?stage\/(.*)/)[1];

    // timing params
    var timeDiff = 0; //performer start time vs. audience enter 
    var latency = 1500; //5000 milliseconds
    var tt = 0; // total time, from the first two params

    var hasFirstNoteArrived = false; //use first Note to set late 
    socket.on('connect', function() {
        //auto running;
        console.log('enter stage ' + hisname);
        socket.emit('enter stage', hisname);
    });
    socket.on('new message', function(data) {
        var note_data = JSON.parse(data.message);
        if (!hasFirstNoteArrived && note_data.midi_msg) {
            hasFirstNoteArrived = true;
            timeDiff = note_data.time - performance.now();
            console.log('two side timeDiff: ' + timeDiff);

            // console.log(tt);
        }
        console.log('note time from musixiser: ' + note_data.time);
        tt = note_data.time - timeDiff + latency;

        //第一种synth方案,不传入时间信息，setTimeout控制synth时间
        // setTimeout(function() {
        //     Synth.handleMidiMsg(note_data.midi_msg, note_data.timbre)
        // }, tt - performance.now());
        Synth.handleMidiMsg(note_data.midi_msg, note_data.timbre)
        //第二种synth方案,传入时间信息，synth自己管理时间
        // Synth.handleMidiMsg(note_data.midi_msg, note_data.timbre, tt / 1000.0);

    });
    socket.on('no stage', function() {
        $('.stage-banner').html('舞台并不存在,3s后返回');
        var timer = 3;
        setInterval(function(){
          if (timer!=1) {
            timer--;
            $('.stage-banner').html('舞台并不存在, '+timer+'s后返回');
          }
          else {
            location.href = '//m.musixise.com';
          }
        },1000);
    });
})