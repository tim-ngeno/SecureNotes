pipeline {
    agent any

    environment {
        // Set environment variables (if needed)
        DOCKER_IMAGE = "securenotes:latest"
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Clone the repository from GitHub
                git branch: 'main', url: 'https://github.com/tim-ngeno/SecureNotes.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                // Run unit tests
                script {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build the Docker image for SecureNotes
                script {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }
    }

    post {
        // always {
        //     // Clean up or additional steps (e.g., push the image to a registry)
        // }
        success {
            echo 'Build and tests passed successfully!'
        }
        failure {
            echo 'Build or tests failed!'
        }
    }
}
