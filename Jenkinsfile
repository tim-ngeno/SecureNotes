pipeline {
    agent any

    environment {
        // Define environment variables for Docker and your app
        DOCKER_IMAGE = "secure-notes-app:${env.BUILD_NUMBER}"
        NODE_ENV = "test"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout code from the GitHub repository
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image for the application
                script {
                    sh """
                    docker compose --build ${DOCKER_IMAGE} .
                    """
                }
            }
        }

        stage('Run Tests') {
            steps {
                // Run the tests inside a Docker container
                script {
                    sh """
                    docker run --rm \
                    --env-file .env \
                    ${DOCKER_IMAGE} \
                    npm test
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up Docker images after the pipeline execution
            script {
                sh """
                docker rmi ${DOCKER_IMAGE} || true
                """
            }
        }

        success {
            echo "Pipeline executed successfully!"
        }

        failure {
            echo "Pipeline failed. Check the logs for details."
        }
    }
}
