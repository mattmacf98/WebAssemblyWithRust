(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    (i32.add
        (local.get $lhs)
        (local.get $rhs)
    )
)
  (export "add" (func $add))
)