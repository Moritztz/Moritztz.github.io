'use strict';

let localStream = null;
let peer = null;
let existingCall = null;

navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 3840, height: 1920 } })
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
        // Error
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });

peer = new Peer({
    key: '9373b614-604f-4fd5-b96a-919b20a7c24e',
    debug: 3
});

peer.on('open', function () {
    $('#my-id').text(peer.id);
});

peer.on('error', function (err) {
    alert(err.message);
});

peer.on('close', function () {
});

peer.on('disconnected', function () {
});

$('#make-call').submit(function (e) {
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream, {videoCodec: 'H264'});
    setupCallEventHandlers(call);
});

$('#end-call').click(function () {
    existingCall.close();
});

peer.on('call', function (call) {
    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call) {
    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;

    call.on('stream', function (stream) {
        addVideo(call, stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });
    call.on('close', function () {
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}

function addVideo(call, stream) {
    $('#their-video').get(0).srcObject = stream;
}

function removeVideo(peerId) {
    $('#' + peerId).remove();
}

function setupMakeCallUI() {
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
