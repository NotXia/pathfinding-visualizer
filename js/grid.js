var all_grids = {}

/* Resizes all created grids */
function resize_grids() {
    for (const [key, value] of Object.entries(all_grids)) {
        resize_grid(key);
    }
}

/* Resizes a specific grid */
function resize_grid(container_id) {
    if (all_grids[container_id] !== undefined) {
        var columns = all_grids[container_id].columns;
        var rows = all_grids[container_id].rows;
        var container = document.getElementById(container_id);
        var grid = document.getElementById(container_id + "grid-container");
    
        var square_size = Math.min(container.clientWidth / columns, container.clientHeight / rows);
        grid.style.width = (square_size * columns) + "px";
        grid.style.height = (square_size * rows) + "px";
    
        grid.style.gridTemplateColumns = (square_size + "px ").repeat(columns);
        grid.style.gridTemplateRows = (square_size + "px ").repeat(rows);

    }
};

/* Creates a grid in a specific div */
function create_grid(container_id, columns, rows) {
    var container = document.getElementById(container_id);

    // Generation the grid container
    var grid = document.createElement("div");
    grid.style.width = container.clientWidth;
    grid.style.height = container.clientHeight;
    grid.className = "grid-container";
    grid.id = container_id + "grid-container";

    // Generation of all the required squares
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var square = document.createElement("div");
            square.className = "tile";
            grid.appendChild(square);
        }
    }

    container.appendChild(grid);

    all_grids[container_id] = {
        "columns" : columns,
        "rows" : rows
    };

    resize_grid(container_id);
}