LIBS := -lglfw -lGL -lglad -lm
CFLAGS := -Wextra -Wall -I./include
OBJS := texture_rectangle.o init_image.o

# peak
all: triangle rectangle texture_rectangle

texture_rectangle: $(OBJS) libglad.a
	gcc $(OBJS) -o texture_rectangle -L. $(LIBS)

$(OBJS): %.o: %.c
	gcc $(CFLAGS) -c $^ -o $@

rectangle: rectangle.c libglad.a
	gcc $(CFLAGS) -o rectangle rectangle.c -L. $(LIBS)

triangle: triangle.c libglad.a 
	gcc -o triangle triangle.c $(CFLAGS) -L. $(LIBS)

libglad: gl.c
	gcc -c $(CFLAGS) gl.c
	ar rcs libglad.a gl.o
clean:
	rm -f triangle *.o libgland.a rectangle
