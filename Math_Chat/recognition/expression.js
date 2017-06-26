var Constants = require('./constant.js');
function Expression(region_name) {
    if (region_name) {
        this.region_name = region_name;
        this.region = {
            'left': 0,
            'bottom': Infinity,
            'right': Infinity,
            'top': 0
        }
    }
    else {
        this.region_name = REGION_NAMES.ROOT;
        this.region = {
            'left': 0,
            'bottom': Infinity,
            'right': Infinity,
            'top': 0
        }
    }
    this.symbols = [];
}

Expression.prototype.addSymbol = function(symbol) {
    this.symbols.push(symbol);
};

Expression.prototype.setRegion = function(left, top, right, bottom) {
    this.region = {
        'left': left,
        'bottom': bottom,
        'right': right,
        'top': top
    }
}

