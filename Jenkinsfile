pipeline {
    agent any

    // Define environment variables at the pipeline level for better visibility
    environment {
	DOCKER_IMAGE = 'securenotes'
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
        stage('Build docker image and start docker container') {
            steps {
                sh 'docker compose up --build -d'
                sh 'echo $MONGO_URI' // For debugging purposes
            }
        }
        stage('Run Tests') {
            steps {
                sh "docker exec $DOCKER_IMAGE npm test"
            }
	}

	stage('Stop Docker containers') {
	    steps {
		sh 'docker compose down'
	    }
	}
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build and tests completed successfully!'
        }
        failure {
            echo 'Build or tests failed. Please check the logs.'
        }
    }
}
