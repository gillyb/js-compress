
exports.contains = function(array, element) {
	for (var i=0; i<array.length; i++)
		if (array[i] === element)
			return true;
	return false;
};

exports.createHash = function(length) {
    var hashSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var hashLength = length || 8;
    var hash = '';
    for (var i=0; i<hashLength; i++) {
        hash += hashSet[getRandom(hashSet.length - 1)];
    }
    return hash;
};

var getRandom = function(max) {
    var randomLength = max.toString().length;
    var digitCount = Math.pow(10, randomLength);
    var rand = parseInt(Math.random() * digitCount);
    return rand % max;
};