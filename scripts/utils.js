
Number.prototype.withCommas = function() {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};