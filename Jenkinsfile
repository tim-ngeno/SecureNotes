pipeline {
    agent any

    environment {
        MONGO_URI = credentials('MONGO_URI')           // Secure MongoDB URI
        JWT_SECRET = credentials('JWT_SECRET')         // JWT Secret
        ENCRYPTION_KEY = credentials('ENCRYPTION_KEY') // Encryption Key
        PORT = '3000'                                  // App Port
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                // Run tests and pass environment variables correctly
                sh '''
                echo "Testing with MONGO_URI: $MONGO_URI"
                npm test
                '''
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}




// pipeline {
//     agent any

//     environment {
//         // Define Docker image details and other environment variables
//         DOCKER_IMAGE = "securenotes:${env.BUILD_NUMBER}"
//         COMPOSE_FILE = "docker-compose.yml"
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 // Checkout the latest code from the repository
//                 checkout scm
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 // Build the application Docker image
//                 script {
//                     sh """
//                     docker build -t ${DOCKER_IMAGE} .
//                     """
//                 }
//             }
//         }

//         stage('Start Services with Docker-Compose') {
//             steps {
//                 // Start MongoDB service using docker-compose
//                 script {
//                     sh """
//                     docker compose up -d mongo
//                     """
//                 }
//             }
//         }

//         stage('Run Tests') {
//             steps {
//                 // Run tests in the application container
//                 script {
//                     sh """
//                     docker run --rm \
//                     --env-file .env \
//                     --network host \
//                     ${DOCKER_IMAGE} \
//                     npm test
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             // Clean up resources after the pipeline execution
//             script {
//                 sh """
//                 docker compose down || true
//                 docker rmi ${DOCKER_IMAGE} || true
//                 """
//             }
//         }

//         success {
//             echo "Pipeline executed successfully!"
//         }

//         failure {
//             echo "Pipeline failed. Check the logs for details."
//         }
//     }
// }
