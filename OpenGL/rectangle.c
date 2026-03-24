#include <glad/gl.h>
#include <GLFW/glfw3.h>
#include <stdio.h>

const char* vertexShaderSource = "#version 330 core\n"
  "layout (location = 0) in vec3 aPos;\n"
  "void main(){\n"
  " gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
  "}\0";

const char* fragmentShaderSource = "#version 330 core\n"
  "out vec4 FragColor;\n"
  "void main(){\n"
  " FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
  "}\0";



void framebuffer_size_callback(GLFWwindow* window, int width, int height){
  glViewport(0,0,width,height);
}

void processInput(GLFWwindow *window){
  if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    glfwSetWindowShouldClose(window,GL_TRUE);
}

int main(){
  unsigned int VBO, VAO, EBO;
  unsigned int vertexShader, fragmentShader, shaderProgram;
  int success;
  char infoLog[512];
  
  float vertices[] = {
    0.5f, 0.5f, 0.0f,
    0.5f, -0.5f, 0.0f,
    -0.5f, -0.5f, 0.0f,
    -0.5, 0.5, 0.0f 
  };

  unsigned int indices[] = {
    0,1,3,
    1,2,3
  };
 
  if(!glfwInit()){
    printf("Window creation failed\n");
    return -1;
  }
    
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

  GLFWwindow* window = glfwCreateWindow(800,600,"triangle", NULL, NULL);

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
  fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
  glCompileShader(fragmentShader);

  glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
  if(!success){
    glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
    printf("Error with fragment shader:\n %s", infoLog);
    glfwTerminate();
    return -1;
  }

  // link shader programs
  shaderProgram = glCreateProgram();
  glAttachShader(shaderProgram, vertexShader);
  glAttachShader(shaderProgram, fragmentShader);
  glLinkProgram(shaderProgram);
  

  glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
  if(!success){
    glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
    printf("Linking shader programs error: \n %s", infoLog);
    glfwTerminate();
    return -1;
  }

  glDeleteShader(vertexShader);
  glDeleteShader(fragmentShader);

  glGenVertexArrays(1, &VAO);
  glGenBuffers(1, &VBO);
  glGenBuffers(1, &EBO);

  glBindVertexArray(VAO);

  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
  glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

  glVertexAttribPointer(0,3,GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*) 0);
  glEnableVertexAttribArray(0);

  glBindBuffer(GL_ARRAY_BUFFER, 0);
  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
  
  while(!glfwWindowShouldClose(window)){
    processInput(window);

    // render
    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    glUseProgram(shaderProgram);
    glBindVertexArray(VAO);
    glDrawElements(GL_TRIANGLES, 6,GL_UNSIGNED_INT, 0);
    glBindVertexArray(0);
    
    // check and call events and swap
    glfwSwapBuffers(window);
    
    glfwPollEvents();
  }

  
  glfwTerminate();
  return 0;
}
