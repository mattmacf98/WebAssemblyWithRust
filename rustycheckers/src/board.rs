#[derive(Debug, Copy, Clone, PartialEq)]
pub enum PieceColor {
    WHITE,
    BLACK
}

#[derive(Debug, Copy, Clone, PartialEq)]
pub struct GamePiece {
    pub color: PieceColor,
    pub crowned: bool
}

impl GamePiece {
    pub fn new(color: PieceColor) -> GamePiece {
        GamePiece {
            color,
            crowned: false
        }
    }

    pub fn crown(piece: GamePiece) -> GamePiece {
        GamePiece {
            color: piece.color,
            crowned: true
        }

    }
}

#[derive(Debug, Copy, Clone, PartialEq)]
pub struct Coordinate (pub usize, pub usize);

impl Coordinate {
    pub fn is_on_board(self) -> bool {
        let Coordinate(x,y) = self;
        x <= 7 && y <= 7 && x >= 0 && y >= 0
    }

    pub fn get_jump_targets(&self) -> impl Iterator<Item = Coordinate> {
        let mut jumps = Vec::new();
        let Coordinate(x,y) = *self;

        if (y >= 2) {
            if (x >= 2) {
                jumps.push(Coordinate(x-2, y-2));
            }
            if (x <= 5) {
                jumps.push(Coordinate(x+2, y-2));
            }
        }
        if (y <= 5) {
            if (x >= 2) {
                jumps.push(Coordinate(x-2, y+2));
            }
            if (x <= 5) {
                jumps.push(Coordinate(x+2, y+2));
            }
        }

        jumps.into_iter()
    }

    pub fn get_move_targets(&self) ->  impl Iterator<Item = Coordinate> {
        let mut moves = Vec::new();
        let Coordinate(x,y) = *self;

        if (y >= 1) {
            if (x >= 1) {
                moves.push(Coordinate(x-1, y-1));
            }
            if (x <= 6) {
                moves.push(Coordinate(x+1, y-1));
            }
        }
        if (y <= 6) {
            if (x >= 1) {
                moves.push(Coordinate(x-1, y+1));
            }
            if (x <= 6) {
                moves.push(Coordinate(x+1, y+1));
            }
        }
        
        moves.into_iter()
    }
} 

#[derive(Debug, Copy, Clone, PartialEq)]
pub struct Move {
    pub from: Coordinate,
    pub to: Coordinate
}

impl Move {
    pub fn new(from: (usize, usize), to: (usize, usize)) -> Move {
        Move {
            from: Coordinate(from.0, from.1),
            to: Coordinate(to.0, to.1)
        }
    }
}