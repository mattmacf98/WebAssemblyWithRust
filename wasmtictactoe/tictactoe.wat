(module
    (import "events" "pieceplaced" (func $notify_pieceplaced (param $x i32) (param $y i32)))
   
    (global $currentTurn (mut i32) (i32.const 1))
    (global $X i32 (i32.const 1))
    (global $O i32 (i32.const 2))
    (memory $mem 1)

    ;; get linear index in memeory given x and y
    (func $indexForPosition (param $x i32) (param $y i32) (result i32)
        (i32.add
            (i32.mul
                (i32.const 3)
                (local.get $y)
            )
            (local.get $x)
        )
    )

    ;; Offset = (x + y * 3) * 4 offset in bytes
    (func $offsetForPosition (param $x i32) (param $y i32) (result i32)
        (i32.mul
            (call $indexForPosition (local.get $x) (local.get $y))
            (i32.const 4)
        )
    )

    ;; Determine if piece is X
    (func $isX (param $piece i32) (result i32)
        (i32.eq
            (i32.and (local.get $piece) (global.get $X))
            (global.get $X)
        )
    )

    ;; Determine if piece is Y
    (func $isY (param $piece i32) (result i32)
        (i32.eq
            (i32.and (local.get $piece) (global.get $O))
            (global.get $O)
        )
    )

    ;; Sets a piece on the game board
    (func $setPiece (param $x i32) (param $y i32) (param $piece i32)
        (i32.store
            (call $offsetForPosition
                (local.get $x)
                (local.get $y)
            )
            (local.get $piece)
        )
    )

    ;; Get a piece from the board. Out of range causes a trap
    (func $getPiece (param $x i32) (param $y i32) (result i32)
        (if (result i32)
            (block (result i32)
                (i32.and
                    (call $inRange
                        (i32.const 0)
                        (i32.const 2)
                        (local.get $x)
                    )
                    (call $inRange
                        (i32.const 0)
                        (i32.const 2)
                        (local.get $y)
                    )
                )
            )
            (then
                (i32.load
                    (call $offsetForPosition
                        (local.get $x)
                        (local.get $y)
                    )
                )
            )
            (else
                (unreachable)
            )
        )
    )

    ;; detect if within board range
    (func $inRange (param $low i32) (param $high i32) (param $value i32) (result i32)
        (i32.and
            (i32.ge_s (local.get $value) (local.get $low))
            (i32.le_s (local.get $value) (local.get $high))
        )
    )

    ;; Gets current turn owner
    (func $getTurnOwner (result i32)
        (global.get $currentTurn)
    )

    ;; Sets turn owner
    (func $setTurnOwner (param $piece i32)
        (global.set $currentTurn (local.get $piece))
    )

    ;; Toggle turn owner
    (func $toggleTurnOwner
        (if (i32.eq (call $getTurnOwner) (i32.const 1))
            (then (call $setTurnOwner (i32.const 2)))
            (else (call $setTurnOwner (i32.const 1)))
        )
    )

    ;; Determine if it's a player's turn
    (func $isPlayersTurn (param $player i32) (result i32)
        (i32.gt_s
            (i32.and (local.get $player) (call $getTurnOwner))
            (i32.const 0)
        )
    )

    ;; Determine if move is valid
    (func $isValidMove (param $x i32) (param $y i32) (result i32)
        (local $target i32)
        (local.set $target (call $getPiece (local.get $x) (local.get $y)))
        
        (if (result i32)
            (block (result i32)
                (i32.eq (local.get $target) (i32.const 0))
            )
            (then (i32.const 1))
            (else (i32.const 0))
        )
    )

     ;; Exported move function to be called by the game host
    (func $move (param $x i32) (param $y i32) (result i32)
        (if (result i32)
            (block (result i32)
                (call $isValidMove (local.get $x) (local.get $y))
            )
            (then
                (call $do_move (local.get $x) (local.get $y))
            )
            (else
                (i32.const 0)
            )
        )
    )

    ;; Internal move function, performs actual move post-validation of target.
    (func $do_move (param $x i32) (param $y i32) (result i32)
        (local $curpiece i32)
        (local.set $curpiece (call $getTurnOwner))
        (call $setPiece (local.get $x) (local.get $y) (local.get $curpiece))
        (call $toggleTurnOwner)
        (call $notify_pieceplaced (local.get $x) (local.get $y))
        (i32.const 1)
    )

    (export "getPiece" (func $getPiece))
    (export "getTurnOwner" (func $getTurnOwner))
    (export "move" (func $move))
    (export "isValidMove" (func $isValidMove))
    (export "memory" (memory $mem))
)