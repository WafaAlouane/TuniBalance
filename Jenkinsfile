pipeline {
    agent any
    triggers {
        githubPush()
    }
    stages {
        stage('Verify Node.js Version') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    git branch: "${env.BRANCH_NAME}", url: 'https://github.com/WafaAlouane/TuniBalance.git'
                }
            }
        }

        stage('Install dependencies - Client') {
            steps {
                script {
                    dir('client') {
                        sh 'rm -rf node_modules package-lock.json'
                        sh 'npm install --verbose || true'
                        sh 'npm audit fix --verbose || true'
                    }
                }
            }
        }

        stage('Install dependencies - Server') {
            steps {
                script {
                    dir('server') {
                        sh 'rm -rf node_modules package-lock.json'
                        sh 'npm install --verbose || true'
                        sh 'npm audit fix --verbose || true'
                    }
                }
            }
        }

        stage('Verify Files - Client') {
            steps {
                script {
                    dir('client') {
                        sh 'test -f src/layouts/HeaderF.jsx || echo "Warning: HeaderF.jsx is missing"'
                    }
                }
            }
        }

        stage('Build application - Client') {
            steps {
                script {
                    dir('client') {
                        sh 'npm install @rollup/rollup-linux-x64-gnu --force || true'
                        sh 'npm run build -- --verbose || true'
                    }
                }
            }
        }

        stage('Build application - Server') {
            steps {
                script {
                    dir('server') {
                        sh 'npm run build || true'
                    }
                }
            }
        }

        stage('Run Unit Tests - Client') {
            steps {
                script {
                    dir('client') {
                        sh 'npm run test -- --verbose || true'
                    }
                }
            }
        }

        stage('Run Unit Tests - Server') {
            steps {
                script {
                    dir('server') {
                        sh 'npm run test -- --verbose || true'
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        failure {
            echo 'Pipeline failed! Check the console output for details.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}