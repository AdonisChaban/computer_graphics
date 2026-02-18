#include <glad/gl.h>
#include <GLFW/glfw3.h>
#include <stdio.h>


float vertices[] = {
  -0.5f, -0.5f, 0.0f,
  0.5f, -0.5f, 0.0f,
  0.0f, 0.5f, 0.0f
};

void framebuffer_size_callback(GLFWwindow* window, int width, int height){
  glViewport(0,0,width,height);
}

void processInput(GLFWwindow *window){
  if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    glfwSetWindowShouldClose(window,GL_TRUE);
}

int main(){
  unsigned int VBO;

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


 int version = gladLoadGL(glfwGetProcAddress);
  if(version == 0){
    printf("failed to load glad\n");
    return -1;
  }

 
  glGenBuffers(1, &VBO);

  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

  
  glfwSetFramebufferSizeCallback(window,framebuffer_size_callback);
  

  while(!glfwWindowShouldClose(window)){
    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
    
    processInput(window);

    // render
    
    
    // check and call events and swap
    glfwSwapBuffers(window);
    glfwPollEvents();
  }

  
  glfwTerminate();
  return 0;
}
