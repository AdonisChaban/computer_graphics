#include <glad/gl.h>
#include <GLFW/glfw3.h>
#include <stdio.h>

const char* vertexShaderSource = "#version 330 core\n"
  "layout (location = 0) in vec3 aPos;\n"
  "void main(){\n"
  " gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
  "}\0";

const char* fragmentOrangeSource = "#version 330 core\n"
  "out vec4 FragColor;\n"
  "void main(){\n"
  " FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
  "}\0";

const char* fragmentYellowSource = "#version 330 core\n"
  "out vec4 FragColor; \n"
  "void main(){\n"
  "FragColor = vec4(1.0f, 1.0f, 0.0f, 1.0f);\n"
  "}\0";


void framebuffer_size_callback(GLFWwindow* window, int width, int height){
  glViewport(0,0,width,height);
}

void processInput(GLFWwindow *window){
  if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    glfwSetWindowShouldClose(window,GL_TRUE);
}

int main(){
  unsigned int VBO[2], VAO[2];
  unsigned int vertexShader, fragmentOrangeShader, shaderOrangeProgram, fragmentYellowShader, shaderYellowProgram;
  int success;
  char infoLog[512];
  
  float vertices[] = {
    -0.5f, -0.5f, 0.0f,
    -0.0f, -0.5f, 0.0f,
    -0.25f, 0.5f, 0.0f,
     0.0f, -0.5f, 0.0f,
     0.5f, -0.5f, 0.0f,
     0.25f, 0.5f, 0.0f    
  };
 
  if(!glfwInit()){
    printf("Window creation failed\n");
    return -1;
  }
    
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

  GLFWwindow* window = glfwCreateWindow(800,600,"triangles", NULL, NULL);

  if(!window){
    printf("Failed to create glfw window\n");
    glfwTerminate();
    return -1;
  }

  glfwMakeContextCurrent(window);
  glfwSetFramebufferSizeCallback(window,framebuffer_size_callback);

  int version = gladLoadGL(glfwGetProcAddress);
  if(version == 0){
    printf("failed to load glad\n");
    return -1;
  }

  vertexShader = glCreateShader(GL_VERTEX_SHADER);

  // attach and compile vertex shader
  glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
  glCompileShader(vertexShader);
  glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);

  if(!success) {
    glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
    printf("Error with vertex shader:\n %s\n", infoLog);
    glfwTerminate();
    return -1;
  }

  // attach and compile fragment shader
  fragmentOrangeShader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragmentOrangeShader, 1, &fragmentOrangeSource, NULL);
  glCompileShader(fragmentOrangeShader);

  glGetShaderiv(fragmentOrangeShader, GL_COMPILE_STATUS, &success);
  if(!success){
    glGetShaderInfoLog(fragmentOrangeShader, 512, NULL, infoLog);
    printf("Error with fragment shader:\n %s", infoLog);
    glfwTerminate();
    return -1;
  }

  // link shader program1
  shaderOrangeProgram = glCreateProgram();
  glAttachShader(shaderOrangeProgram, vertexShader);
  glAttachShader(shaderOrangeProgram, fragmentOrangeShader);
  glLinkProgram(shaderOrangeProgram);

  glGetProgramiv(shaderOrangeProgram, GL_LINK_STATUS, &success);
  if(!success){
    glGetProgramInfoLog(shaderOrangeProgram, 512, NULL, infoLog);
    printf("Linking shader programs error: \n %s", infoLog);
    glfwTerminate();
    return -1;
  }

  fragmentYellowShader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragmentYellowShader, 1, &fragmentYellowSource, NULL);
  glCompileShader(fragmentYellowShader);
  glGetShaderiv(fragmentYellowShader,GL_COMPILE_STATUS, &success);
  if(!success){
    glGetShaderInfoLog(fragmentOrangeShader, 512, NULL, infoLog);
    printf("Error with fragment shader:\n %s", infoLog);
    glfwTerminate();
    return -1;
  }
  
  // link shader program 2
  shaderYellowProgram = glCreateProgram();
  glAttachShader(shaderYellowProgram, vertexShader);
  glAttachShader(shaderYellowProgram, fragmentYellowShader);
  glLinkProgram(shaderYellowProgram);

  glDeleteShader(vertexShader);
  glDeleteShader(fragmentYellowShader);
  glDeleteShader(fragmentOrangeShader);

  glGenVertexArrays(2, VAO);
  glGenBuffers(2, VBO);

  // VBO VAO 1
  glBindVertexArray(VAO[0]);

  glBindBuffer(GL_ARRAY_BUFFER, VBO[0]);
  glBufferData(GL_ARRAY_BUFFER, sizeof(float) * 9, vertices, GL_STATIC_DRAW);
 
  glVertexAttribPointer(0,3,GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*) 0);
  glEnableVertexAttribArray(0);

 
  // VBO VAO 2
  glBindVertexArray(VAO[1]);

  glBindBuffer(GL_ARRAY_BUFFER, VBO[1]);
  glBufferData(GL_ARRAY_BUFFER,sizeof(float) * 9, &vertices[9], GL_STATIC_DRAW);

  glVertexAttribPointer(0,3,GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*) 0);
  glEnableVertexAttribArray(0);

  // clean binding
  glBindBuffer(GL_ARRAY_BUFFER, 0);
  glBindVertexArray(0);  

  while(!glfwWindowShouldClose(window)){
    processInput(window);

    // render
    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    glUseProgram(shaderOrangeProgram);
    glBindVertexArray(VAO[0]);
    glDrawArrays(GL_TRIANGLES, 0, 3);
    
    glUseProgram(shaderYellowProgram);
    glBindVertexArray(VAO[1]);
    glDrawArrays(GL_TRIANGLES, 0, 3);
        
    // check and call events and swap
    glfwSwapBuffers(window);
    glfwPollEvents();
  }

  glDeleteVertexArrays(2,VAO);
  glDeleteBuffers(2, VBO);
  glDeleteProgram(shaderYellowProgram);
  glDeleteProgram(shaderOrangeProgram);
  
  glfwTerminate();
  return 0;
}
