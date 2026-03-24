(module
  (import "js" "mem" (memory 1))
  (func $matMul 
    (local $col1 v128)
    (local $col2 v128)
    (local $index i32)
    (local $i i32)

    i32.const 0
    local.set $i

    i32.const 0
    local.set $index
    
    (block $break
      (loop $top
        (br_if $break (i32.eq (local.get $i) (i32.const 4)))
        local.get $index
        v128.load
        local.set $col1
        local.get $index
        i32.const 16
        i32.add
        v128.load
        local.set $col2
        local.get $col1
        local.get $col2

        ;; dot product
        f32x4.mul
        
        
        
        
                
      )    
    )   
))