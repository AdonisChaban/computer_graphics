#include <stdio.h>
#include <glad/gl.h>
#include <GLFW/glfw3.h>
#include <stb_image.h>

const char* vertexSource = "#version 330 core\n"
  "layout (location = 0) in vec3 aPos;\n"
  "layout (location = 1) in vec3 acolor;\n"
  "layout (location = 2) in vec2 aTexCoord;\n"
  "out vec3 ourColor;\n"
  "out vec2 ourTexCoord;\n"
  "void main() {\n"
  " gl_Position = vec4(aPos,1.0f);\n"
  " ourColor = acolor;\n"
  " ourTexCoord = aTexCoord;\n"
  "}";

const char* fragSource = "#version 330 core\n"
  "in vec3 ourColor;\n"
  "in vec2 ourTexCoord;\n"
  "out vec4 FragColor;\n"
  "uniform sampler2D texture1;\n"
  "uniform sampler2D texture2;\n"
  "void main() {\n"
  " vec2 inverseTexCoord = vec2(ourTexCoord.x, 1.0 - ourTexCoord.y);\n"
  " FragColor = mix(texture(texture1, ourTexCoord),texture(texture2, inverseTexCoord),0.8f) \
 * vec4(ourColor, 1.0f);\n"
  "}";

int main(){
  int version, success;
  int width, height, nrChannels;
  GLFWwindow* window;
  unsigned int VBO, VAO, EBO, texture[2];
  char errormsg[512];
  unsigned int vertexShader, fragShader, shaderProgram;
  float vertices[] = {
    -1.0f, -1.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 0.0f,
    -1.0f, 1.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 1.0f,
    1.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
    1.0f, -1.0f, 0.0f, 1.0f, 0.5f, 0.2f, 1.0f, 0.0f
  };

  unsigned int indices[] = {
    0,1,2,
    0,2,3
  };

  
  if(!glfwInit()) {
    printf("glfw didn't initilize\n");
    return -1;
  }

  window = glfwCreateWindow(640, 480, "texture", NULL, NULL);
  if(!window){
    glfwTerminate();
    printf("couldn't create a window\n");
    return -1;
  }

  glfwMakeContextCurrent(window);

  
  version = gladLoadGL(glfwGetProcAddress);
  if(version == 0){
    glfwTerminate();
    printf("glad failed\n");
    return -1;
  }

  vertexShader = glCreateShader(GL_VERTEX_SHADER);
  glShaderSource(vertexShader,1,&vertexSource,NULL);
  glCompileShader(vertexShader);
  glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
  if(!success){
    glfwTerminate();
    glGetShaderInfoLog(vertexShader, 512, NULL, errormsg);
    printf("vertex shader failed\n %s", errormsg);
    return -1;
  }

  fragShader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragShader,1,&fragSource,NULL);
  glCompileShader(fragShader);
  glGetShaderiv(fragShader, GL_COMPILE_STATUS, &success);
  if(!success){
    glGetProgramInfoLog(fragShader, 512, NULL, errormsg);
    printf("frag shader failed\n %s", errormsg);
    glfwTerminate();
    return -1;
  }

  shaderProgram = glCreateProgram();
  glAttachShader(shaderProgram,vertexShader);
  glAttachShader(shaderProgram, fragShader);
  glLinkProgram(shaderProgram);
  glGetProgramiv(shaderProgram,GL_LINK_STATUS,&success);
  if(!success){
    glGetProgramInfoLog(shaderProgram,512,NULL, errormsg);
    printf("shader complilation error\n %s", errormsg);
    return -1;
  }

 
  glDeleteShader(vertexShader);
  glDeleteShader(fragShader);

  
  glGenBuffers(1, &VBO);
  glGenBuffers(1, &EBO);

  unsigned char *data = stbi_load("images/container.jpg", &width, &height, &nrChannels, 0);
  if(!data){
    printf("couldn't load image into memory\n");
    return -1;
  }
  
  glGenTextures(2,texture);
  glBindTexture(GL_TEXTURE_2D, texture[1]);
  // glActiveTexture(GL_TEXTURE1);
  glBindTexture(GL_TEXTURE_2D, texture[2]);
  // glActiveTexture(GL_TEXTURE0);
  // set up parameters here if desired
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB,\
	       GL_UNSIGNED_BYTE, data);
  glGenerateMipmap(GL_TEXTURE_2D);

  stbi_image_free(data);

  data = stbi_load("images/meme1.png", &width, &height, &nrChannels, 0);
  if(!data){
    printf("couldn't load image into memory 2\n");
    return -1;
  }
  glActiveTexture(GL_TEXTURE1);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB,width,height,0, GL_RGBA, GL_UNSIGNED_BYTE,data);
  glGenerateMipmap(GL_TEXTURE_2D);

  stbi_image_free(data);

  
  //glGenBuffers(1, &VAO);
  // glBindVertexArray(VAO);
  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STREAM_DRAW);
  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
  glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STREAM_DRAW);
  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), NULL);
  glEnableVertexAttribArray(0);
  glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(float), (void*) (3 * sizeof(float)));
  glEnableVertexAttribArray(1);
  glVertexAttribPointer(2,2,GL_FLOAT,GL_FALSE, 8 * sizeof(float), (void*) (6 * sizeof(float)));
  glEnableVertexAttribArray(2);
  
  
  glViewport(0,0,640,480);
  
  //render
  glUseProgram(shaderProgram);
  // glBindVertexArray(VAO);

  glUniform1i(glGetUniformLocation(shaderProgram,"texture1"), 0);
  glUniform1i(glGetUniformLocation(shaderProgram,"texture2"), 1);
  
  // glClear(GL_COLOR_BUFFER_BIT);
  glDrawElements(GL_TRIANGLES,6,GL_UNSIGNED_INT,0);
  glfwSwapBuffers(window);
  
  

  while(!glfwWindowShouldClose(window)){
    // glClear(GL_COLOR_BUFFER_BIT);
    // glfwSwapBuffers(window);
    glfwPollEvents();
  }


  glfwTerminate();
  return 0;
}
