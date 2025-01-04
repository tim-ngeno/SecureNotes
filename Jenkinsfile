pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "securenotes:latest"
        TEST_IMAGE = "securenotes:test"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/tim-ngeno/SecureNotes.git'
            }
        }

        stage('Build Base Docker Image') {
            steps {
                withCredentials([file(credentialsId: 'ENV_FILE', variable: 'ENV_FILE_PATH')]) {
                    sh '''
                    # Build a base Docker image with the application code
                    docker build --build-arg ENV_FILE=$ENV_FILE_PATH -t $TEST_IMAGE .
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                withCredentials([file(credentialsId: 'ENV_FILE', variable: 'ENV_FILE_PATH')]) {
                    sh '''
                    # Run tests inside the test Docker container
                    docker run --rm --env-file=$ENV_FILE_PATH $TEST_IMAGE npm test
                    '''
                }
            }
        }

        stage('Build Final Docker Image') {
            steps {
                withCredentials([file(credentialsId: 'ENV_FILE', variable: 'ENV_FILE_PATH')]) {
                    sh '''
                    # Build the final Docker image (production-ready)
                    docker build --build-arg ENV_FILE=$ENV_FILE_PATH -t $DOCKER_IMAGE .
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Build, tests, and final Docker image creation completed successfully!'
        }
        failure {
            echo 'Build or tests failed!'
        }
    }
}
