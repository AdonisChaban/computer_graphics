(module
  (memory (export "memory") 1 1)
   (export "transposeMatrix" (func $transposeMatrix))
   (export "matMul" (func $matMul))
   
  
  (func $transposeMatrix (param $from i32) (param $to i32)
    (local $j i32)
    (local $i i32)
    (local $i2 i32)
	(local $j2 i32)

    (loop $outer

      i32.const 0
      local.tee $i
      local.set $i2
     
      (loop $inner 

        local.get $i2
        local.get $to 
        i32.add 
        local.get $j2
        i32.add
        
        local.get $i
        local.get $from
        i32.add
        local.get $j
        i32.add
        f32.load

        f32.store

        local.get $i2
        i32.const 4
        i32.add
        local.set $i2
        
        local.get $i
        i32.const 16
        i32.add
        local.tee $i
  
        i32.const 64
        i32.lt_u     
        br_if $inner
     )

      local.get $j
      i32.const 4
      i32.add
      local.tee $j
	  
	  local.get $j2
	  i32.const 16
	  i32.add
	  local.set $j2

      i32.const 16
      i32.lt_u
      br_if $outer
    )
     
  ) ;; end of transpose function

  ;; first matrix is row major, second is colunm major
  ;; changes the both matrices, results in major then column. 
  (func $matMul
    (param $off1 i32) ;; offset/location to first matrix
    (param $off2 i32) ;; offset to second matrix

    
    (local $matp1 i32)
    (local $matp2 i32)
    (local $wall1 i32) ;; offset + size of first matrix
    (local $wall2 i32)

    (local $res v128)
    (local $acc v128)

    local.get $off1
    local.tee $matp1
    i32.const 64
    i32.add
    local.set $wall1

    local.get $off2
    local.tee $matp2
    i32.const 64
    i32.add
    local.set $wall2
   
    (loop $outer_loop
      v128.const f32x4 0x0 0x0 0x0 0x0

    	  (loop $inner_loop (param v128) (result v128)

            local.get $matp1
	        v128.load
            
		    local.get $matp2
		    v128.load

		   ;; SIMD multi our two vectors
		   f32x4.mul
		   local.set $res
		   v128.const i32x4 0x3  0x0  0x1 0x2
           local.get $res
		   i8x16.swizzle
		   local.get $res
		   f32x4.add
           local.set $res
		   v128.const i32x4 0x2 0x3 0x0 0x1
           local.get $res
		   i8x16.swizzle;; each element in this vector is the same
           local.set $res
           v128.const i32x4 0x0 0x10 0x10 0x10
           local.get $res
           i8x16.swizzle ;;[dp, 0 ,0,0]

           f32x4.add
           local.set $res
           v128.const i32x4 0x3 0x0 0x1 0x2
           local.get $res
           i8x16.swizzle ;; swifting to the right by one for the final result
                        
		   ;; iteration, add matp2 by 16  
		   i32.const 16
		   local.get $matp2
		   i32.add
		   local.set $matp2

		   ;; check our iteration
		   local.get $matp2
		   local.get $wall1
		   i32.lt_u
		   br_if $inner_loop		
	     )

	  ;; let's store into memory
      local.set $res
	  local.get $matp1
      local.get $res
	  v128.store

	  i32.const 16
	  local.get $matp1
	  i32.add
	  local.set $matp1

	  ;; check if over
	  local.get $matp1
	  local.get $wall1
	  i32.lt_u
	  br_if $outer_loop	  
    )
	
	;; here we need to transpose then save
	local.get $off2
	local.get $off1
	call $transposeMatrix
		
	
  ) ;; end of function for matrix maultiplication

  (func (export "matIden") (param i32) 
    local.get 0
    v128.const f32x4 0x1 0x0 0x0 0x0   
    v128.store

    local.get 0
    i32.const 16
    i32.add
    v128.const f32x4 0x0 0x1 0x0 0x0
    v128.store

    local.get 0
    i32.const 32
    i32.add
    v128.const f32x4 0x0 0x0 0x1 0x0
    v128.store

    local.get 0
    i32.const 48
    i32.add
    v128.const f32x4 0x0 0x0 0x0 0x1
    v128.store
    

  ) ;; end of matIden 
  
  
  (func (export "translateMatrix") 
    (param $offset i32) 
    (param $tx f32) 
    (param $ty f32)
    (param $tz f32)

    ;; notice the transpose is in row major

    i32.const 0
    v128.const f32x4 0x1 0x0 0x0 0x0
    local.get $tx
    f32x4.replace_lane 3
    v128.store

    i32.const 16
    v128.const f32x4 0x0 0x1 0x0 0x0
    local.get $ty
    f32x4.replace_lane 3
    v128.store

    i32.const 32
    v128.const f32x4 0x0 0x0 0x1 0x0
    local.get $tz
    f32x4.replace_lane 3
    v128.store

    i32.const 48
    v128.const f32x4 0x0 0x0 0x0 0x1
    v128.store
	
	;; multiply that shit
	i32.const 0
	local.get $offset
	call $matMul

  ) ;; end of transpose function
  
  
  (func (export "moveTo") (param $to i32)
    local.get $to
    
    i32.const 0
    v128.load

    v128.store

    local.get $to
    i32.const 16
    i32.add

    i32.const 16
    v128.load

    v128.store

    local.get $to
    i32.const 32
    i32.add

    i32.const 32
    v128.load

    v128.store

    local.get $to
    i32.const 48
    i32.add
	
	i32.const 48
    v128.load

    v128.store
  ) ;; end of moveTo function
  
  (func (export "translation") 
    (param $from i32) 
    (param $tx f32)
    (param $ty f32)
    (param $tz f32)

    i32.const 0
    
    v128.const f32x4 0x1 0x0 0x0 0x0
    local.get $tx
    f32x4.replace_lane 3

    v128.store

    i32.const 16

    v128.const f32x4 0x0 0x1 0x0 0x0
    local.get $ty
    f32x4.replace_lane 3

    v128.store
    
    i32.const 32
 
    v128.const f32x4 0x0 0x0 0x1 0x0
    local.get $tz
    f32x4.replace_lane 3

    v128.store

    i32.const 48
    v128.const f32x4 0x0 0x0 0x0 0x1

    v128.store ;; We have our tranpose matrix

    local.get $from
    i32.const 0
    call $matMul
  )
   
  (func (export "scalar") (param $from i32) (param $scalar f32)
    i32.const 0
    v128.const f32x4 0x1 0x0 0x0 0x0
    local.get $scalar
    f32x4.splat
    f32x4.mul

    v128.store

    i32.const 16
    v128.const f32x4 0x0 0x1 0x0 0x0
    local.get $scalar
    f32x4.splat
    f32x4.mul

    v128.store

    i32.const 32
    v128.const f32x4 0x0 0x0 0x1 0x0
    local.get $scalar
    f32x4.splat
    f32x4.mul

    v128.store

    i32.const 48
    v128.const f32x4 0x0 0x0 0x0 0x1
    v128.store

    ;; now have our scalar matrix

    local.get $from
    i32.const 0
    call $matMul
  
  )
  
 (func (export "rotz")
   (param $from i32)   
   (param $sina f32)
   (param $cosa f32)

   i32.const 0
   local.get $cosa	 
   f32.store

   i32.const 4
   local.get $sina
   f32.const -1
   f32.mul
   f32.store

   i32.const 8
   f32.const 0
   f32.store


   i32.const 12
   f32.const 0
   f32.store

   i32.const 16
   local.get $sina	 
   f32.store


   i32.const 20
   local.get $cosa
   f32.store


   i32.const 24
   f32.const 0
   f32.store


   i32.const 28
   f32.const 0
   f32.store
  
   i32.const 32
   v128.const f32x4 0x0 0x0 0x1 0x0
   v128.store


   i32.const 48
   v128.const f32x4 0x0 0x0 0x0 0x1
   v128.store
   
   ;; made the rotation matrix
   local.get $from
   i32.const 0
   call $matMul
  )
  
  (func (export "rotx")
   (param $from i32)
   (param $sina f32)
   (param $cosa f32)
   
    local.get $from
    v128.const f32x4 0x1 0x0 0x0 0x0
    v128.store
   
    local.get $from
    i32.const 16
    i32.add
    v128.const f32x4 0x0 0x0 0x0 0x0
    local.get $cosa
    f32x4.replace_lane 1
    local.get $sina
    f32.const -1
    f32.mul
    f32x4.replace_lane 2
    v128.store

    local.get $from
    i32.const 32
    i32.add
    v128.const f32x4 0x0 0x0 0x0 0x0
    local.get $sina
    f32x4.replace_lane 1
    local.get $cosa
    f32x4.replace_lane 2
    v128.store

    local.get $from
    i32.const 48
    i32.add
    v128.const f32x4 0x0 0x0 0x0 0x1
    v128.store

    ;; we have our matrix
	i32.const 0
	local.get $from
	call $matMul  
  )
  
  
  (func (export "roty")
   (param $from i32)
   (param $sina f32)
   (param $cosa f32)
   
    local.get $from
    v128.const f32x4 0x0 0x0 0x0 0x0
    local.get $sina
    f32x4.replace_lane 2
    local.get $cosa
    f32x4.replace_lane 0
    v128.store
   
    local.get $from
    i32.const 16
    i32.add
	v128.const f32x4 0x0 0x1 0x0 0x0
    v128.store
    

    local.get $from
    i32.const 32
    i32.add
    v128.const f32x4 0x0 0x0 0x0 0x0
    local.get $sina
	f32.const -1
	f32.mul
    f32x4.replace_lane 0
    local.get $cosa
    f32x4.replace_lane 2
    v128.store

    local.get $from
    i32.const 48
    i32.add
    v128.const f32x4 0x0 0x0 0x0 0x1
    v128.store

    ;; we have our matrix
	i32.const 0
	local.get $from
	call $matMul 
  )  
  
)  