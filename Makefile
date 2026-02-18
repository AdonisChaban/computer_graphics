LIBS := -lglfw -lGL -lglad
CFLAGS := -I./include

# peak 

triangle: triangle.c libglad.a 
	gcc -Wextra -Wall -o triangle triangle.c $(CFLAGS) -L. $(LIBS)

libglad: gl.c
	gcc -c $(CFLAGS) gl.c
	ar rcs libglad.a gl.o
clean:
	rm -f triangle gl.o libgland.a
