var script = document.createElement("script");
script.src = "./js/algorithms/dijkstra.js";
document.head.appendChild(script);

var ANIMATION_SPEED = 50;

function animation_speed(speed) {
    ANIMATION_SPEED = speed;
}


function adjacent_nodes_d(grid, coord) {
    var near = [];
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) {
                continue;
            }

            if ((coord.getX() + i >= 0 && coord.getY() + j >= 0) && (coord.getX() + i < grid.getColumns() && coord.getY() + j < grid.getRows())) {
                if (grid.getMatrix()[coord.getX() + i][coord.getY() + j] != WALL_TILE) {
                    near.push(new Coord(coord.getX() + i, coord.getY() + j));
                }
            }
        }
    }
    return near;
}

function adjacent_nodes_s(grid, coord) {
    var near = [];
    if (coord.getX() + 1 < grid.getColumns()) {
        if (grid.getMatrix()[coord.getX() + 1][coord.getY()] != WALL_TILE) {
            near.push(new Coord(coord.getX() + 1, coord.getY()));
        }
    }
    if (coord.getX() - 1 >= 0) {
        if (grid.getMatrix()[coord.getX() - 1][coord.getY()] != WALL_TILE) {
            near.push(new Coord(coord.getX() - 1, coord.getY()));
        }
    }
    if (coord.getY() + 1 < grid.getRows()) {
        if (grid.getMatrix()[coord.getX()][coord.getY() + 1] != WALL_TILE) {
            near.push(new Coord(coord.getX(), coord.getY() + 1));
        }
    }
    if (coord.getY() - 1 >= 0) {
        if (grid.getMatrix()[coord.getX()][coord.getY() - 1] != WALL_TILE) {
            near.push(new Coord(coord.getX(), coord.getY() - 1));
        }
    }
    return near;
}