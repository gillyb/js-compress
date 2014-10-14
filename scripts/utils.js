
Number.prototype.withCommas = function() {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

String.prototype.truncateFilename = function() {
    var fileParts = this.split('.');
    var extension = fileParts[fileParts.length-1];
    var filename = this.substr(0, this.length - extension.length + 1);
    return filename.substr(0, 10) + '*.' + extension;
};