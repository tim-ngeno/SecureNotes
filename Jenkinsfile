pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'securenotes'
        MONGO_URI = credentials('MONGO_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        ENCRYPTION_KEY = credentials('ENCRYPTION_KEY')
        PORT = '3000'
    }

    options {
        // Optimize pipeline performance
        timeout(time: 30, unit: 'MINUTES') // Prevent jobs from hanging
        skipDefaultCheckout() // Avoid redundant SCM checkout
        parallelsAlwaysFailFast() // Stop parallel steps on failure
    }

    stages {
        stage('Checkout') {
            steps {
                // Specify the SCM to avoid ambiguity
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/tim-ngeno/SecureNotes']]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build and tag the Docker image
                sh "docker build -t $DOCKER_IMAGE ."
            }
        }

        stage('Start Docker Container') {
            steps {
                // Use docker-compose for container orchestration
                sh "docker compose up -d"
            }
        }

        stage('Run Tests') {
            steps {
                // Run tests inside the Docker container
                sh "docker exec $DOCKER_IMAGE npm test"
            }
        }

        stage('Stop Docker Containers') {
            steps {
                // Stop and remove containers after tests
                sh "docker compose down --volumes"
            }
        }
    }

    post {
        always {
            cleanWs() // Ensure workspace is cleaned up
        }
        success {
            echo 'Build and tests completed successfully!'
        }
        failure {
            echo 'Build or tests failed. Please check the logs.'
        }
    }
}
