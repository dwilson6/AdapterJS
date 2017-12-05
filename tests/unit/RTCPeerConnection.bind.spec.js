//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

// Test timeouts
var testTimeout = 35000;

// Get User Media timeout
var gUMTimeout = 25000;

// Test item timeout
var testItemTimeout = 5000;

var err = new ReferenceError('This is a bad function.');

// typeof webrtcObjectFunction
// Init in before
// Equals 'object' if IE + plugin
// Equals 'function' otherwise
var FUNCTION_TYPE = null;

describe('RTCPeerConnection | bind', function() {
  this.timeout(testTimeout);

  var peer1 = null;
  var stream = null;

  var offer = null;
  var answer = null;

  var candidates1 = [];
  var candidates2 = [];


  /* WebRTC Object should be initialized in Safari/IE Plugin */
  before(function (done) {
    this.timeout(testItemTimeout);

    AdapterJS.webRTCReady(function() {
      FUNCTION_TYPE = webrtcDetectedBrowser === 'IE' ? 'object' : 'function';
      done();
    });
  });

  it('AdapterJS.recursivePolyfillBind', function (done) {
    this.timeout(testItemTimeout);

    peer1 = AdapterJS.WebRTCPlugin.plugin.PeerConnection({ iceServers: [] });
    assert.equal(typeof peer1.getRemoteStreams.bind, 'undefined');

    AdapterJS.recursivePolyfillBind(peer1);

    assert.equal(typeof peer1.getRemoteStreams.bind, 'function');
    var getRemoteStreams = peer1.getRemoteStreams;
    assert.equal(typeof getRemoteStreams, 'object');
    console.log('calling bind');
    var boundFn = getRemoteStreams.bind(peer1);
    assert.equal(typeof boundFn, 'function');
    console.log('executing bound function');
    var result1 = boundFn();
    assert.instanceOf(result1, Array);

    done();
  });

  describe('Auto polyfill bind', function() {

    beforeEach(function (done) {
      this.timeout(testItemTimeout);
      peer1 = new RTCPeerConnection({ iceServers: [] });
      done();
    });

    it('RTCPeerConnection.getRemoteStreams :: method < For > bind', function (done) {
      this.timeout(testItemTimeout);

      assert.equal(typeof peer1.getRemoteStreams.bind, 'function');
      var getRemoteStreams = peer1.getRemoteStreams;
      var result1 = getRemoteStreams.bind(peer1)();
      assert.instanceOf(result1, Array);

      done();
    });

    it('RTCPeerConnection.addStream :: method < For > bind', function (done) {
      this.timeout(testItemTimeout);

      assert.equal(typeof peer1.addStream.bind, 'function');

      window.navigator.getUserMedia({
        audio: true,
        video: true

      }, function (data) {
        stream = data;

        var p1AddStream = peer1.addStream.bind(peer1);

        p1AddStream(stream);
        expect(peer1.getLocalStreams()).to.have.length(1);

        stream && stream.stop();

        done();

      }, function (error) {
        console.log(error);
        throw error;
      });

    });

  });

});
