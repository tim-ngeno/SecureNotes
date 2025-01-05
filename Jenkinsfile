pipeline {
    agent any

    // Define environment variables at the pipeline level for better visibility
    environment {
        MONGO_URI = credentials('MONGO_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        ENCRYPTION_KEY = credentials('ENCRYPTION_KEY')
        PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                // Specify the SCM to avoid ambiguity
                git url: 'https://github.com/tim-ngeno/SecureNotes.git',
                     branch: 'main'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Use a more robust npm install command to handle potential issues
                sh 'npm ci'
                sh 'echo $MONGO_URI' // For debugging purposes
            }
        }
        stage('Run Tests') {
            steps {
                // Specify the test command explicitly
                sh 'npm test'
            }
            // Consider adding a post-action to archive test results (e.g., JUnit format)
            post {
                success {
                    junit '**/test-results.xml'
                }
            }
        }
    }

    post {
        // Clean up workspace after the build (your original code, slightly adjusted)
        always {
            cleanWs()
            // No need for `deleteDir()` if `cleanWs()` is used
        }
        success {
            echo 'Build and tests completed successfully!'
        }
        failure {
            echo 'Build or tests failed. Please check the logs.'
        }
    }
}
