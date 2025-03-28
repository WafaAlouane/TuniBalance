pipeline {
    agent any
    triggers {
            githubPush() // Pour GitHub
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


        stage('Build application - Client') {
            steps {
                script {
                    dir('client') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build application - Server') {
            steps {
                script {
                    dir('server') {
                        sh 'npm run build'
                    }
                }
            }
        }
<<<<<<< HEAD
=======
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
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
    }

  
}
