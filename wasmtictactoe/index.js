fetch("./tictactoe.wasm").then(response => response.arrayBuffer())
.then(bytes => WebAssembly.instantiate(bytes, {
    events: {
        pieceplaced: (x, y) => {
            console.log(`Piece placed at (${x}, ${y})`)
        }
    }
}))
.then(results => {
    const instance = results.instance;

    console.log(`At start, turn owner is ${instance.exports.getTurnOwner()}`)

    instance.exports.move(0, 1); // X
    console.log(`Turn owner is ${instance.exports.getTurnOwner()}`)
    instance.exports.move(0,1); // O
    console.log(`Afer invalid move, Turn owner is ${instance.exports.getTurnOwner()}`)
    instance.exports.move(1,1); // O

    console.log(`At end, turn owner is ${instance.exports.getTurnOwner()}`)
}).catch(console.error)