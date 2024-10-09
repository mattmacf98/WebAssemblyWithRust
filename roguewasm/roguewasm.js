
import * as wasm from "./roguewasm_bg.wasm";
import { __wbg_set_wasm } from "./roguewasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./roguewasm_bg.js";
