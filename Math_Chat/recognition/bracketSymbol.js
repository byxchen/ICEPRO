function BracketSymbol(x, y, height, value) {
    Symbol.apply(this, [x, y, 0, height, value]);
    this.type = SYMBOL_TYPES.BRACKET;
    delete(this.region.tleft);
    delete(this.region.above);
    delete(this.region.supers);
    delete(this.region.contains);
    delete(this.region.bleft);
    delete(this.region.below);
    delete(this.region.subsc);
}
