pipeline {
    agent any
    triggers {
        githubPush()
    }
    stages {
        stage('Clone Repository') {
            steps {
                script {
                    // Clone the repository with the specified branch
                    git branch: "${env.BRANCH_NAME}", url: 'https://github.com/WafaAlouane/TuniBalance.git'
                }
            }
        }

        stage('Install dependencies - Client') {
            steps {
                script {
                    dir('client') {
                        // Clear old dependencies to avoid issues with optional dependencies
                        sh 'rm -rf node_modules package-lock.json'
                        // Install dependencies
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Install dependencies - Server') {
            steps {
                script {
                    dir('server') {
                        // Clear old dependencies
                        sh 'rm -rf node_modules package-lock.json'
                        // Install dependencies and fix vulnerabilities
                        sh 'npm install'
                        sh 'npm audit fix'
                    }
                }
            }
        }

        stage('Build application - Client') {
            steps {
                script {
                    dir('client') {
                        // Explicitly install Rollup binary to fix the missing module issue
                        sh 'npm install @rollup/rollup-linux-x64-gnu --force'
                        // Run the build command
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build application - Server') {
            steps {
                script {
                    dir('server') {
                        // Run the build command
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('SonarQube Analysis - Client') {
            steps {
                script {
                    def scannerHome = tool 'scanner' // Ensure 'scanner' is configured in Jenkins
                    withSonarQubeEnv('SonarQube') {
                        withCredentials([string(credentialsId: 'scanner', variable: 'SONAR_TOKEN')]) {
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.token=${env.SONAR_TOKEN} -Dproject.settings=client/sonar-project.properties"
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis - Server') {
            steps {
                script {
                    def scannerHome = tool 'scanner' // Ensure 'scanner' is configured in Jenkins
                    withSonarQubeEnv('SonarQube') {
                        withCredentials([string(credentialsId: 'scanner', variable: 'SONAR_TOKEN')]) {
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.token=${env.SONAR_TOKEN} -Dproject.settings=server/sonar-project.properties"
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            // Clean up workspace to avoid clutter
            cleanWs()
        }
        failure {
            // Notify on failure (optional: configure email or Slack notifications)
            echo 'Pipeline failed! Check the console output for details.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}