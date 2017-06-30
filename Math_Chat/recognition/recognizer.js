var REGIONS = ["ABOVE", "BELOW", "SUPER", "SUBSC", "TLEFT", "BLEFT", "CONTAINS"];
var PT_REGIONS = ["ABOVE", "BELOW", "SUPER", "SUBSC", "ULIMIT", "BLIMIT", "CONTAINS"];

var CENTRED = ["a", "c", "e", "j", "m", "n", "o", "r", "s", "u", "v", "w", "x", "z"];
var DECENDING = ["g", "p", "q", "y"];

function getExpression(eqns) {
    if(!eqns)
        eqns = document.querySelectorAll('[id^="svg_eqn_"]');

    var items = [];
    for (i = 0; i < eqns.length; i++) {
        if (eqns[i].textContent == " " || eqns[i].tagName == "g")
            continue;
        var rect = eqns[i].getBBox();
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var height = rect.height;
        var value = eqns[i].nodeName == "path" ? eqns[i].id.split('_')[3] : eqns[i].textContent;
        var type = getSymbolType(value);
        switch (type) {
            case SYMBOL_TYPES.BRACKET:
                items.push(new BracketSymbol(x, y, height, value));
                break;
            case SYMBOL_TYPES.FRACTION:
                items.push(new FractionSymbol(x, y, width, height, value));
                break;
            case SYMBOL_TYPES.ROOT:
                items.push(new RootSymbol(x, y, width, height, value));
                break;
            case SYMBOL_TYPES.LIMIT:
                items.push(new LimitSymbol(x, y, width, height, value));
                break;
            case SYMBOL_TYPES.ALPHANUMERIC:
                items.push(new AlphanumericSymbol(x, y, width, height, value));
                break;
            case SYMBOL_TYPES.OPERATOR:
                items.push(new OperatorSymbol(x, y, width, height, value));
                break;
            default:
                break;
        }
    }
    items.sort(function(a, b) {
        var result = a.minX - b.minX;
        if (result == 0) {
            return a.minY - b.minY;
        }
        return result;
    });
    var bst = parse(items);

    return bst;
}


function getBST() {
    var bst = getExpression();
    console.log(bst);
    var tex = getTex(bst);
    alert(tex);
};

function parse(ls){
    var expression = new Expression();
    var stack = [];
    var queue = [];
    var temp1, temp2;
    var parent, symbol, relation;
    var wall = expression.wall;

    var s = start(ls, wall);

    if (s != -1) {
        ls[s].setWall(wall); //deep copy
        queue.push([s, expression]);
        ls[s].marked = true;
    }
    while (queue.length != 0) {
        while (queue.length != 0) {
            [temp1, parent] = queue.shift();
            symbol = ls[temp1];
            parent.symbols.push(symbol);
            stack.push([temp1, symbol]);
            wall = ls[temp1].wall;
            temp2 = hor(ls, temp1);
            while(temp2 != -1) {
                ls[temp2].marked = true;
                var oldWall = ls[temp1].wall;
                ls[temp2].setWall(oldWall);
                symbol = ls[temp2];
                parent.symbols.push(symbol);
                stack.push([temp2, symbol]);
                ls[temp1].wall.right = ls[temp2].minX;
                if (ls[temp2].type === "limit" && 
                    (ls[temp1].type === "bracket" || ls[temp1].type === "line")) {
                    ls[temp2].wall.left = ls[temp1].maxX;
                }
                temp1 = temp2;
                temp2 = hor(ls, temp1);
            }
            stack.push("EOBL");
            while(stack.length != 0) {
                if(stack[stack.length - 1] === "EOBL") {
                    stack.pop();
                }
                [temp1, symbol] = stack.pop();
                var top = symbol.wall.top;
                var bottom = symbol.wall.bottom;
                var si = parent.symbols.indexOf(symbol);
                var right = (si == (parent.symbols.length - 1)) ? symbol.wall.right : parent.symbols[si + 1].minX;
                var left = symbol.minX;
                if (symbol.type === SYMBOL_TYPES.LIMIT) {
                    if (si == 0) {
                        left = wall.left;
                    } else if (parent.symbols[si - 1].type === SYMBOL_TYPES.BRACKET) {
                        left = parent.symbols[si - 1].maxX;
                    } else if (parent.symbols[si - 1].type === SYMBOL_TYPES.FRACTION) {
                        left = parent.symbols[si - 1].maxX;
                    }
                }
                
                var minX = symbol.minX;
                var maxX = symbol.maxX;
                var minY = symbol.minY;
                var maxY = symbol.maxY;
                var upperThreshold = minY + 2/5 * (maxY - minY);
                var lowerThreshold = maxY - 2/5 * (maxY - minY);

                var above = [[minX, minY], [maxX, top], "above"];
                var below = [[minX, bottom], [maxX, maxY], "below"];
                var supers = [[maxX, upperThreshold], [right, top], "supers"];
                var subsc = [[maxX, bottom], [right, lowerThreshold], "subsc"];
                var tleft = [[left, upperThreshold], [minX, top], "tleft"];
                var bleft = [[left, bottom], [minX, lowerThreshold], "bleft"];
                var contains = [[minX, maxY], [maxX, minY], "contains"];    

                var regions = [above, below, supers, subsc, tleft, bleft, contains];
                for (var i = 0; i < regions.length; i++) {
                    if(!symbol.region[regions[i][2]]) {
                        continue;
                    }
                    
                    symbol.region[regions[i][2]].setWall(regions[i]);
                    temp2 = start(ls, symbol.region[regions[i][2]].wall);
                    if (temp2 != -1) {
                        ls[temp2].marked = true;
                        ls[temp2].setWall(symbol.region[regions[i][2]].wall);
                        relation = symbol.region[regions[i][2]];
                        queue.push([temp2, relation]);
                    }
                }
                
            }
        }
    }
    return expression;
}

function isInRegion(wall, element) {
    if (wall.left <= element.x) {
        if (element.x < wall.right) {
            if (wall.top <= element.y){
                if (element.y <= wall.bottom) {
                    return true;
                }
            }
        }
    }
    return false;
}

function start(ls, wall){
    var leftMostIndex = -1;
    var limitIndex = -1;
    var i = 0;
    var overlapIndex = -1;
    var n = ls.length;
    while (leftMostIndex == -1 && i < n) {
        if (!ls[i].marked && isInRegion(wall, ls[i])) {
            leftMostIndex = i;
        }
        else {
            i += 1;
        }
    }

    if (leftMostIndex == -1 || limitIndex == leftMostIndex) {
        return leftMostIndex;
    }
    while (i < n && limitIndex == -1) {
        if (!ls[i].marked && ls[i].type === "limit" && 
        isInRegion(wall, ls[i]))
            limitIndex = i;
        else
            i += 1;
    }

    if (limitIndex == -1 || limitIndex == leftMostIndex) {
        return overlap(leftMostIndex, wall, ls);
    }

    var upperThreshold = ls[limitIndex].maxY;
    var lowerThreshold = ls[limitIndex].minY;
    while (i > leftMostIndex) {
        i = i - 1;
        if (ls[i].y < upperThreshold && ls[i].y >= lowerThreshold) {
            overlapIndex = i;
        }
    }
    if (overlapIndex < limitIndex && overlapIndex != -1) {
        return overlap(leftMostIndex, wall, ls);
    } else {
        return overlap(limitIndex, wall, ls);
    }
}

function overlap(index, wall, ls) {
    var i = index;
    var top = wall.top;
    var bottom = wall.bottom;
    var stop = false;
    var n = ls.length;
    var maxLength;
    if (ls[index].type === "fraction") {
        maxLength = ls[index].width;
    } else {
        maxLength = -1;
    }

    var mainLine = -1;
    while (i > 0 && !stop) {
        if (ls[i - 1].maxX < ls[index].minX) {
            stop = true;
        } else {
            i -= 1;
        }
    }
    console.log(ls[index], "\t\t");
    while (i < n && ls[i].minX < ls[index].maxX) {
        console.log(ls[i].type, ls[i].y, top, bottom);
        if (!ls[i].marked && 
        ls[i].type === "fraction" &&
        ls[i].y > top &&
        ls[i].y <= bottom && 
        ls[i].minX <= ls[index].minX &&
        ls[i].width > maxLength) {
            maxLength = ls[i].width;
            mainLine = i;
        } else {
            i++;
        }
    }

    if (mainLine == -1) {
        return index;
    } else {
        return mainLine;
    }
}

function hor(ls, s) {
    if (ls[s].type === "fraction" || ls[s].type === "bracket") {
        var wall = ls[s].getWallCopy();
        var newWall = wall;
        newWall.left = ls[s].maxX;
        var st = start(ls, newWall);
        if (st == -1) {
            return -1;
        }
        return overlap(st, ls[s].wall, ls);
    }
    var index = 0;
    while (index < ls.length) {
        if (isInRegion(ls[s].wall, ls[index]) && !ls[index].marked) {
            if (ls[s].maxX <= ls[index].minX) {
                if (ls[s].minY + 2/5 * ls[s].height <= ls[index].y 
                    && ls[index].y < ls[s].maxY - ls[s].height * 1/5)
                    return overlap(index, ls[s].wall, ls);
            }
        }
        index++;
    }
    return -1;


}

function getTex(bst) {
    var result = "";
    //if (!bst) {
      //  return result;
    //}
    //console.log(bst);
    if (bst.symbols){
        for (var i = 0; i < bst.symbols.length; i++) {
            result += getTex(bst.symbols[i]);
        }
        return result;
    }
    var value = bst.value;
    var symbol = bst;
    var type = bst.type;

    if (type === "limit") {
        result += TEX_TEXT[value] + " ";
        if(bst.region.bleft.hasElement() || bst.region.below.hasElement() || bst.region.subsc.hasElement())
            result += "_{" + getTex(bst.region.bleft) + getTex(bst.region.below) + getTex(bst.region.subsc) + "} ";
        if(bst.region.tleft.hasElement() || bst.region.above.hasElement() || bst.region.supers.hasElement())
        result += "^{" + getTex(bst.region.tleft) + getTex(bst.region.above) + getTex(bst.region.supers) + "} ";
    } else if (type === "fraction") {
        result += TEX_TEXT[value];
        result += "{" 
        if (bst.region.above.hasElement()) {
            result += getTex(bst.region.above);
         } 
        result += "}{";
        if (bst.region.below.hasElement()) {
            result += getTex(bst.region.below);
        }
        result += "} ";

    } else if (type === "root") {
        result += TEX_TEXT[value] + "{" + getTex(bst.region.contains) + "} ";
        if (bst.region.supers.hasElement()) {
            result += "^{" + getTex(bst.region.supers) +"} ";
        }
        if (bst.region.subsc.hasElement()) {
            result += "_{" + getTex(bst.region.subsc) +"} ";
        }
    } else if (type === "bracket") {
        result += TEX_TEXT[value];
        if (symbol.bracketType == BRACKET_TYPES.CLOSE) {
            if (bst.region.supers.hasElement()) {
                result += "^{" + getTex(bst.region.supers) +"}";
            }
        }
    } else if (type == "operator") {
        result += value;
    } else {
        result += value;
        if (bst.region.supers.hasElement()) {
            result += "^{" + getTex(bst.region.supers) +"}";
        }
        if (bst.region.subsc.hasElement()) {
            result += "_{" + getTex(bst.region.subsc) +"}";
        }
    }
    return result;
}
