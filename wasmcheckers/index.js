fetch("./checkers.wasm").then(response => response.arrayBuffer())
.then(bytes => WebAssembly.instantiate(bytes, {
    events: {
        piecemoved: (fromX, fromY, toX, toY) => {
            console.log(`Piece moved from (${fromX}, ${fromY}) to (${toX}, ${toY})`)
        },
        piececrowned: (x, y) => {
            console.log(`Piece at (${x}, ${y}) crowned`)
        }
    }
}))
.then(results => {
    const instance = results.instance;
    instance.exports.initBoard();

    console.log(`At start, turn owner is ${instance.exports.getTurnOwner()}`)

    instance.exports.move(0, 5, 0, 4); // B 
    instance.exports.move(1, 0, 1, 1); // W 
    instance.exports.move(0, 4, 0, 3); // B 
    instance.exports.move(1, 1, 1, 0); // W 
    instance.exports.move(0, 3, 0, 2); // B 
    instance.exports.move(1, 0, 1, 1); // W 
    instance.exports.move(0, 2, 0, 0); // B - this will get a crown 
    instance.exports.move(1, 1, 1, 0); // W
    const res = instance.exports.move(0, 0, 0, 2); // move crowned piece beack

    document.getElementById("container").innerText = res;
    console.log(`At end, turn owner is ${instance.exports.getTurnOwner()}`)
}).catch(console.error)