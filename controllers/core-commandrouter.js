var libQ = require('q');

// Define the CoreCommandRouter class
module.exports = CoreCommandRouter;
function CoreCommandRouter (server) {

	// Start the state machine
	this.stateMachine = new (require('../controllers/core-statemachine'))(this);

	// Start the client interfaces
	this.arrayInterfaces = [];
	this.arrayInterfaces.push(new (require('../controllers/interface-webui.js'))(server, this));
	this.arrayInterfaces.push(new (require('../controllers/interface-mpd.js'))(server, this));

	// Move these variables out at some point
	var nMpdPort = 6600;
	var nMpdHost = 'localhost';

	// Start the MPD controller
	this.controllerMpd = new (require('../controllers/controller-mpd'))(nMpdPort, nMpdHost, this);

	// Start the Spotify controller
	this.controllerSpotify = new (require('../controllers/controller-spotify'))(this);

}

// Methods usually called by the Client Interfaces ----------------------------------------------------------------------------

// Volumio Play
CoreCommandRouter.prototype.volumioPlay = function () {

	console.log('CoreCommandRouter::volumioPlay');
	return this.stateMachine.play();

}

// Volumio Pause
CoreCommandRouter.prototype.volumioPause = function () {

	console.log('CoreCommandRouter::volumioPause');
	return this.stateMachine.pause();

}

// Volumio Stop
CoreCommandRouter.prototype.volumioStop = function () {

	console.log('CoreCommandRouter::volumioStop');
	return this.stateMachine.stop();

}

// Volumio Previous
CoreCommandRouter.prototype.volumioPrevious = function () {

	console.log('CoreCommandRouter::volumioPrevious');
	return this.stateMachine.previous();

}

// Volumio Next
CoreCommandRouter.prototype.volumioNext = function () {

	console.log('CoreCommandRouter::volumioNext');
	return this.stateMachine.next();

}

// Volumio Get State
CoreCommandRouter.prototype.volumioGetState = function () {

	console.log('CoreCommandRouter::volumioGetState');
	return this.stateMachine.getState();

}

// Volumio Get Queue
CoreCommandRouter.prototype.volumioGetQueue = function () {

	console.log('CoreCommandRouter::volumioGetQueue');
	return this.stateMachine.getQueue();

}

// Methods usually called by the State Machine --------------------------------------------------------------------

CoreCommandRouter.prototype.volumioPushState = function (state) {

	console.log('CoreCommandRouter::volumioPushState');
	var _this = this;

	// Announce new player state to each client interface
	return libQ.all(
		_this.arrayInterfaces.map(function (thisInterface) {
			return thisInterface.volumioPushState(state);

		})

	);

}

// MPD Clear-Add-Play
CoreCommandRouter.prototype.mpdClearAddPlayTracks = function (arrayTrackIds) {

	console.log('CoreCommandRouter::mpdClearAddPlayTracks');
	return this.controllerMpd.clearAddPlayTracks(arrayTrackIds)

}

// MPD Stop
CoreCommandRouter.prototype.mpdStop = function () {

	console.log('CoreCommandRouter::mpdStop');
	return this.controllerMpd.stop();

}

// MPD Pause
CoreCommandRouter.prototype.mpdPause = function () {

	console.log('CoreCommandRouter::mpdPause');
	return this.controllerMpd.pause();

}

// MPD Resume
CoreCommandRouter.prototype.mpdResume = function () {

	console.log('CoreCommandRouter::mpdResume');
	return this.controllerMpd.resume();

}

// Spotify Clear-Add-Play
CoreCommandRouter.prototype.spotifyClearAddPlayTracks = function (arrayTrackIds) {

	console.log('CoreCommandRouter::spotifyClearAddPlayTracks');
	return this.controllerSpotify.clearAddPlayTracks(arrayTrackIds)

}

// Spotify Stop
CoreCommandRouter.prototype.spotifyStop = function () {

	console.log('CoreCommandRouter::spotifyStop');
	return this.controllerSpotify.stop();

}

// Spotify Pause
CoreCommandRouter.prototype.spotifyPause = function () {

	console.log('CoreCommandRouter::spotifyPause');
	return this.controllerSpotify.pause();

}

// Spotify Resume
CoreCommandRouter.prototype.spotifyResume = function () {

	console.log('CoreCommandRouter::spotifyResume');
	return this.controllerSpotify.resume();

}

// Methods usually called by the service controllers --------------------------------------------------------------

CoreCommandRouter.prototype.mpdPushState = function (state) {

	console.log('CoreCommandRouter::mpdPushState');
	return this.stateMachine.syncStateFromMpd(state);

}

CoreCommandRouter.prototype.spotifyPushState = function (state) {

	console.log('CoreCommandRouter::spotifyPushState');
	return this.stateMachine.syncStateFromSpotify(state);

}

