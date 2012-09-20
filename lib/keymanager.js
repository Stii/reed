var	path = require('path'),
	conn = require('./redis-connection'),
	ru = require('./reed-util');

//redis open/close methods
function open(cfg, callback) {
	conn.open(cfg, function(err, redisClient) {
		if (err) return callback(err, false);
		client = redisClient;
		callback(err, false);
	});
}

function close() {
	conn.close();
}

//redis client
var client;

var keyManager = {
	blogIndex: 'reed:blog:index',
	blogNewIndex: 'reed:blog:newindex',
	blogDates: 'reed:blog:dates',
	pagesIndex: 'reed:pages:index',
	pagesNewIndex: 'reed:pages:newindex',
	
	open: open,
	close: close,
	
	toPostKeyFromFilename: function(filename) {
		if (!ru.startsWith(filename, 'reed:blog:')) {
			return 'reed:blog:' + filename;		
		}
		else {
			return filename;
		}
	},
	
	toPagesKeyFromFilename: function(filename) {
		if (!ru.startsWith(filename, 'reed:pages:')) {
			return 'reed:pages:' + filename;
		}
		else {
			return filename;
		}
	},
	
	toPostFilenameFromTitle: function(title, callback) {
		client.get('reed:blogpointer:' + title, function(err, key) {
			if (err) return callback(err);
			callback(null, key);
		});
	},
	
	toPagesFilenameFromTitle: function(title, callback) {
		client.get('reed:pagespointer:' + title, function(err, key) {
			if (err) return callback(err);
			callback(null, key);
		});		
	},
	
	toTitle: function(filename) {
		var ext = path.extname(filename);
		var title = path.basename(filename, ext);
		return title;
	},
	
	toPostPointer: function(filename) {
		return 'reed:blogpointer:' + keyManager.toTitle(filename);
	},
	
	toPagesPointer: function(filename) {
		return 'reed:pagespointer:' + keyManager.toTitle(filename);
	}
};

exports.KeyManager = keyManager;