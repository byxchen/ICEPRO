function Expression(region_name) {
    if (region_name) {
        this.region_name = region_name;
        this.wall = {
            'left': 0,
            'bottom': Infinity,
            'right': Infinity,
            'top': 0
        }
    }
    else {
        this.region_name = REGION_NAMES.ROOT;
        this.wall = {
            'left': 0,
            'bottom': Infinity,
            'right': Infinity,
            'top': 0
        }
    }
    this.symbols = [];
};


Expression.prototype.addSymbol = function(symbol) {
    this.symbols.push(symbol);
};

Expression.prototype.setWall = function(left, top, right, bottom) {
    if (left.left) { // given a wall
        this.wall = left;
        return;
    }
    if (left.length && left.length == 3) {
        this.wall.left = left[0][0];
        this.wall.bottom = left[0][1];
        this.wall.right = left[1][0];
        this.wall.top = left[1][1];
        return;
    }
    this.wall = {
        'left': left,
        'bottom': bottom,
        'right': right,
        'top': top
    };
};

Expression.prototype.hasElement = function() {
    return this.symbols.length > 0;
}