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
                    git branch: "main", url: 'https://github.com/WafaAlouane/TuniBalance.git'
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
    }

  
}
