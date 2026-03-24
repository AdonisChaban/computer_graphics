(module
  (memory $mem 1)
  (export "mem" (memory $mem))

  ;; first matrix is row major, second is colunm major
  ;; then the first matrix becomes the  result matrix in row major
  ;; while the second matrix is unscathed
  (func $matMul
    (param $off1 i32) ;; offset to first matrix
    (param $off2 i32) ;; offset to second matrix

    
    (local matp1 i32)
    (local matp2 i32)
    (local wall1 i32) ;; offset + size of first matrix
    (local wall2 i32)

    param.get $off1
    local.tee $matp1
    i32.const 64
    i32.add
    local.set $wall1

    param.get $off2
    local.tee $matp2
    i32.const 64
    i32.add
    local.set $wall2

     
    (loop $outer_loop
    	  ;; load vector
	  (local i i32)
	  local.get $matp1
	  v128.load
	  ;; local.set $col1
	  
    	  (loop $inner_loop
		local.get $matp1 ;; need for later
	  	;; load other vector
		local.get $matp2
		v128.load

		;; SIMD multi our two vectors
		f32x4.mul
		local.tee $res
		v128.const i32x4 0x3  0x0  0x1 0x2
		i8x16.swizzle
		local.get $res
		f32x4.add
		v128.const i32x4 0x2 0x3 0x0 0x1
		i8x16.swizzle
		i32.const 0
		f32x4.extract_lane ;; dot product complete
		;; I'll try to keep the result in the stack
		
		;; iteration, add matp2 by 16  
		i32.const 16
		local.get $matp2
		i32.add
		local.set $matp2

		;; check our iteration
		local.get $matp2
		local.get $wall1
		i32.lt
		br_if		
	  )

	  ;; let's store into memory
	  local.get $matp1
	  v128.store

	  i32.const 16
	  local.get $matp1
	  i32.add
	  local.set $matp1

	  ;; check if over
	  local.get $matp1
	  local.get $wall1
	  i32.lt
	  br_if	  
    )
    
                                
))  