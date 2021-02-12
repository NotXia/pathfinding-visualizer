var script = document.createElement("script");
script.src = "./js/finder.js";
document.head.appendChild(script);

const WALL_TILE = 0;
const ROAD_TILE = 1;
const START_TILE = 2;
const END_TILE = 3;
const VISITED_TILE = 4;
const PATH_TILE = 5;

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    equals(coord) {
        if (coord === undefined) {
            return false;
        }
        else {
            return this.x == coord.getX() && this.y == coord.getY();
        }
    }

    toString() {
        return "(" + this.x + ";" + this.y + ")";
    }
}

class Grid {
    constructor(container_id, columns, rows) {
        this.container_id = container_id;
        this.columns = columns;
        this.rows = rows;

        // Generation of all the squares
        this.matrix = [];
        for (let x = 0; x < columns; x++) {
            this.matrix[x] = [];
            for (let y = 0; y < rows; y++) {
                this.matrix[x][y] = ROAD_TILE;
            }
        }

        this.render();
        all_grids.push(this);
    }

    /* Sets all the listener for a tile */
    add_square_listeners(square, coord) {
        var grid_class = this;

        square.addEventListener("mouseover", function () {
            if (drawing) {
                grid_class.draw(coord, curr_mode);
            }
        }, false);

        square.addEventListener("mousedown", function (event) {
            event.preventDefault();
            startDrawing();
            grid_class.draw(coord, curr_mode);
        }, false);

        square.addEventListener("mouseup", function () {
            stopDrawing();
        }, false);
    }

    /* Displays the grid */
    render() {
        // Generation the grid container
        var grid = document.createElement("div");
        grid.className = "grid-container";
        grid.id = this.container_id + "grid-container";

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                var square = document.createElement("div");
                square.className = "square tile" + this.matrix[x][y];
                square.id = this.getSquareId(new Coord(x, y));

                this.add_square_listeners(square, new Coord(x, y));

                grid.appendChild(square);
            }
        }

        document.getElementById(this.container_id).innerHTML = "";
        document.getElementById(this.container_id).appendChild(grid);
        this.scale();
    }

    getColumns() {
        return this.columns;
    }

    getRows() {
        return this.rows;
    }

    getMatrix() {
        return this.matrix;
    }

    draw(coord, mode) {
        switch (mode) {
            case WALL_TILE:
                this.setWall(coord);
                break;

            case ROAD_TILE:
                this.setRoad(coord);
                break;

            case START_TILE:
                this.setStart(coord);
                break;

            case END_TILE:
                this.setEnd(coord);
                break;

            case VISITED_TILE:
                this.setVisited(coord);
                break;

            case PATH_TILE:
                this.setPath(coord);
                break;
        }
    }

    /* Gets the Coord object of the starting point */
    getStart() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.matrix[i][j] == START_TILE) {
                    return new Coord(i, j)
                }
            }
        }
        return undefined;
    }

    /* Gets the Coord object of the ending point */
    getEnd() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.matrix[i][j] == END_TILE) {
                    return new Coord(i, j)
                }
            }
        }
        return undefined;
    }

    /* Scales the grid */
    scale() {
        var container = document.getElementById(this.container_id);
        var grid = document.getElementById(this.container_id + "grid-container");

        var square_size = Math.min(container.clientWidth / this.columns, container.clientHeight / this.rows);
        grid.style.width = (square_size * this.columns) + "px";
        grid.style.height = (square_size * this.rows) + "px";

        grid.style.gridTemplateColumns = (square_size + "px ").repeat(this.columns);
        grid.style.gridTemplateRows = (square_size + "px ").repeat(this.rows);
    }

    setAt(coord, type) {
        var square = document.getElementById(this.getSquareId(coord));
        square.classList.remove("tile0", "tile1", "tile2", "tile3", "tile4", "tile5");
        square.classList.add("tile" + type);

        this.matrix[coord.getX()][coord.getY()] = type;
    }

    getSquareId(coord) {
        return this.container_id + "-" + coord.getX() + "-" + coord.getY();
    }

    setWall(coord) {
        this.setAt(coord, WALL_TILE);
    }

    setRoad(coord) {
        this.setAt(coord, ROAD_TILE);
    }

    setStart(coord) {
        var start_coord = this.getStart();

        if (start_coord !== undefined) {
            this.setAt(start_coord, ROAD_TILE);
        }
        this.setAt(coord, START_TILE);
    }

    setEnd(coord) {
        var end_coord = this.getEnd();

        if (end_coord !== undefined) {
            this.setAt(end_coord, ROAD_TILE);
        }
        this.setAt(coord, END_TILE);
    }

    setVisited(coord) {
        this.setAt(coord, VISITED_TILE);
    }

    setPath(coord) {
        this.setAt(coord, PATH_TILE);
    }

    /* Resizes the grid and renders it */
    resize(new_columns, new_rows) {
        if (new_columns > this.columns) {
            for (let i=0; i<(new_columns-this.columns); i++) {
                var new_row = [];
                for(let j=0; j<new_rows; j++) {
                    new_row.push(ROAD_TILE);
                }
                this.matrix.push(new_row);
            }
        }
        else if (new_columns < this.columns) {
            for (let i=0; i<(this.columns-new_columns); i++) {
                this.matrix.pop();
            }
        }
        this.columns = new_columns;

        if (new_rows > this.rows) {
            for (let i=0; i<this.columns; i++) {
                for (let j=0; j<(new_rows-this.rows); j++) {
                    this.matrix[i][this.rows+j] = ROAD_TILE;
                }
            }
        }
        else if (new_rows < this.rows) {
            for (let i=0; i<this.columns; i++) {
                for (let j=0; j<(this.rows-new_rows); j++) {
                    this.matrix[i].pop();
                }
            }
        }
        this.rows = new_rows;

        this.render();
    }

    /* Removes from the matrix all tge visited node and the final path of the previous search */
    reset() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.matrix[i][j] == VISITED_TILE || this.matrix[i][j] == PATH_TILE) {
                    this.matrix[i][j] = ROAD_TILE;
                }
            }
        }
        this.render();
    }

    lock() {
        document.getElementById(this.container_id).classList.add("lock");
    }

    unlock() {
        document.getElementById(this.container_id).classList.remove("lock");
    }

    /* Checks if the start and the end nodes are set */
    isValid() {
        return (this.getStart() !== undefined) && (this.getEnd() !== undefined);
    }
}


var all_grids = []
/* Scales all the created grids */
function scale_grids() {
    all_grids.forEach(grid => {
        grid.scale();
    });
}


var drawing = false;
var curr_mode = 0;

function setCurrentMode(mode) {
    curr_mode = mode;
}

function startDrawing() {
    drawing = true;
}

function stopDrawing() {
    drawing = false;
}