pipeline {
    agent any
    triggers {
            githubPush() // Pour GitHub
        }
        environment {
             DOCKER_HUB_USERNAME = "arijbms"
             DOCKER_CREDENTIALS = credentials('DOCKER_CREDENTIALS')  //ID du credential Docker Hub stocké dans Jenkins
                }
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    // Cloner le dépôt unique avec la branche correspondante
                    git branch: "${env.BRANCH_NAME}", url: 'https://github.com/WafaAlouane/TuniBalance.git'
                }
            }
        }

        stage('Install dependencies - Client') {
            steps {
                script {
                    dir('client') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Install dependencies - Server') {
            steps {
                script {
                    dir('server') {
                        sh 'npm install'
                    }
                }
            }
        }


       /* stage('Build application - Client') {
            steps {
                script {
                    dir('client') {
                        sh 'npm run build'
                    }
                }
            }
        }*/

        stage('Build application - Server') {
            steps {
                script {
                    dir('server') {
                        sh 'npm run build'
                    }
                }
            }
        }
        stage('Clean Running Containers') {
            steps {
                script {
                    sh 'docker-compose down --remove-orphans'
                }
            }
          }


           // Construction des images avec Docker Compose
        stage('Building images - Client & Server') {
            steps {
                script {
                    sh 'docker-compose build --no-cache'
                }
            }
        }
        stage('Push Docker Images to Docker Hub') {
    steps {
        script {
            withCredentials([usernamePassword(credentialsId: 'DOCKER_CREDENTIALS', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                sh 'echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin'
              
                sh 'docker push $DOCKER_HUB_USERNAME/tunibalance-front:latest'
                sh 'docker push $DOCKER_HUB_USERNAME/tunibalance-back:latest'
            }
        }
    }
}

         //  Déploiement des services
        stage('Deploy Services with Docker Compose') {
            steps {
                script {
                    sh 'docker-compose down'
                    sh 'docker-compose up -d'
                }
            }
        }
         // Stage SonarQube pour le projet Client (React)
        stage('SonarQube Analysis - Client') {
            steps {
                script {
                    def scannerHome = tool 'scanner'  // Nom de l'outil SonarQube configuré dans Jenkins
                    withSonarQubeEnv('SonarQube') { 
                         withCredentials([string(credentialsId: 'scanner', variable: 'SONAR_TOKEN')]) {
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.token=${env.SONAR_TOKEN} -Dproject.settings=client/sonar-project.properties"
                        }
                }
            }
        }
    }
        // Stage SonarQube pour le projet Server (NestJS)
        stage('SonarQube Analysis - Server') {
            steps {
                script {
                    def scannerHome = tool 'scanner'  // Nom de l'outil SonarQube configuré dans Jenkins
                    withSonarQubeEnv('SonarQube') { 
                         withCredentials([string(credentialsId: 'scanner', variable: 'SONAR_TOKEN')]) {
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.token=${env.SONAR_TOKEN} -Dproject.settings=server/sonar-project.properties"
                        }
                }
                }
            }
        }
    }

  
}
