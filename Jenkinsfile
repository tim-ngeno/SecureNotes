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

        stage('Build Docker Image, start container and run tests') {
            steps {
		// Start MongoDB using docker-compose.yml
		sh 'docker compose -f docker-compose.yml up -d'
		// Run the application container
		sh 'CONTAINER_ID = $docker run -d'
		// run tests inside the application
		sh "docker exec $DOCKER_IMAGE npm test"

		// Stop and removing the application container
		sh "docker stop $CONTAINER_ID"
		sh "docker rmi $CONTAINER_ID"

		// Stop and remove the mongoDB container
		sh "docker compose -f docker-compose.yml down"

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
