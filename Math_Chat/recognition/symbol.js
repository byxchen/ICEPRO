/**
 * 
 @ Abstract Symbol Class
 * @param {*} x x coordinate
 * @param {*} y y coordiante
 * @param {*} value value of the symbol
 */
function Symbol(x, y, width, height, value) {
    if (this.constructor === Symbol) {
        throw new Error("Abstract Class Instatiation Error");
    }
    this.minX = x;
    this.minY = y;
    this.maxX = x + width;
    this.maxY = y + height;
    this.value = value;
    this.width = width;
    this.height = height;
    this.x = (this.minX + this.maxX)/2;
    this.y = (this.minY + this.maxY)/2;
    this.region = {};
    for (var region in REGION_NAMES) {
        this.region[REGION_NAMES[region]] = new Expression(REGION_NAMES[region]);
    }
    delete(this.region.root);
}
