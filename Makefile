LIBS := -lglfw -lGL -lglad
CFLAGS := -Wextra -Wall -I./include

# peak
all: triangle rectangle

rectangle: rectangle.c libglad.a
	gcc $(CFLAGS) -o rectangle rectangle.c -L. $(LIBS)

triangle: triangle.c libglad.a 
	gcc -o triangle triangle.c $(CFLAGS) -L. $(LIBS)

libglad: gl.c
	gcc -c $(CFLAGS) gl.c
	ar rcs libglad.a gl.o
clean:
	rm -f triangle *.o libgland.a rectangle
