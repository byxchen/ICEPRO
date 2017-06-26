var Symbol = require('./symbol.js');

function AlphanumericSymbol(x, y, width, height, value) {
    Symbol.apply(this, [x, y, width, height, value]);
    this.type = SYMBOL_TYPES.TEXT;
    delete(this.region.TLEFT);
    delete(this.region.BLEFT);
    delete(this.region.CONTAINS);
}

module.exports.AlphanumericSymbol = AlphanumericSymbol;