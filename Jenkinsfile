pipeline {
    agent any

    environment {
        // Docker image name
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
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Use credentials to load environment variables and run tests
                withCredentials([file(credentialsId: 'ENV_FILE', variable: 'ENV_FILE_PATH')]) {
                    sh '''
                    # Load environment variables from .env file
                    export $(cat $ENV_FILE_PATH | xargs)
                    
                    # Run unit tests
                    npm test
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build the Docker image with .env file included during build context
                withCredentials([file(credentialsId: 'ENV_FILE', variable: 'ENV_FILE_PATH')]) {
                    sh '''
                    # Build the Docker image and pass the .env file to the build context
                    docker build --build-arg ENV_FILE=$ENV_FILE_PATH -t $DOCKER_IMAGE .
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Build and tests passed successfully!'
        }
        failure {
            echo 'Build or tests failed!'
        }
    }
}
