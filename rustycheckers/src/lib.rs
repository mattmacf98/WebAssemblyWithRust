use board::{Coordinate, GamePiece, Move, PieceColor};
use game::GameEngine;
use mut_static::MutStatic;

#[macro_use]
extern crate lazy_static;

lazy_static! {
    pub static ref GAME_ENGINE: MutStatic<GameEngine> = MutStatic::from(GameEngine::new());
}

#[no_mangle]
pub extern "C" fn get_piece(x: i32, y: i32) -> i32 {
    let engine = GAME_ENGINE.read().unwrap();
    let piece = engine.get_piece(Coordinate(x as usize, y as usize));

    match piece {
        Ok(Some(p)) => p.into(),
        _ => -1
    }
}

#[no_mangle]
pub extern "C" fn get_current_turn() -> i32 {
    let engine = GAME_ENGINE.read().unwrap();

    GamePiece::new(engine.get_current_turn()).into()
}

#[no_mangle]
pub extern "C" fn move_piece(from_x: i32, from_y: i32, to_x: i32, to_y: i32) -> i32 {
    let mut engine = GAME_ENGINE.write().unwrap();
    let mv = Move{ from: Coordinate(from_x as usize, from_y as usize), to: Coordinate(to_x as usize, to_y as usize) };
    let res = engine.move_piece(&mv);

    match res {
        Ok(mr) => {
            unsafe {
                notify_piecemoved(from_x, from_y, to_x, to_y);
            }
            if mr.crowned {
                unsafe {
                    notify_piececrowned(to_x, to_y);
                } 
            }
            1
        },
        Err(_) => 0,
    }
}

extern "C" {
    fn notify_piecemoved(from_x: i32, from_y: i32, to_x: i32, to_y: i32);
    fn notify_piececrowned(x: i32, y: i32);
}

const PIECEFLAG_BLACK: u8 = 1;
const PIECEFLAG_WHITE: u8 = 2;
const PIECEFLAG_CROWN: u8 = 4;

impl Into<i32> for GamePiece {
    fn into(self) -> i32 {
        let mut val: u8 = 0;
        if self.color == PieceColor::BLACK {
            val += PIECEFLAG_BLACK;
        } else if self.color == PieceColor::WHITE {
            val += PIECEFLAG_WHITE;
        }

        if self.crowned {
            val += PIECEFLAG_CROWN;
        }

        val as i32
    }
}

mod board;
mod game;