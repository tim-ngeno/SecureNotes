pipeline {
    agent any

    environment {
        MONGO_URI = credentials('MONGO_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        ENCRYPTION_KEY = credentials('ENCRYPTION_KEY')
        PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                sh 'npm install'
		sh 'echo $MONGO_URI'
            }
        }
        stage('Run Tests') {
            steps {
                // Run tests using npm
                sh 'npm test'
            }
        }
    }

    // post {
    //     always {
    // 	    script {
    // 		if (getContext(hudson.FilePath)) {
    // 		    deleteDir()
    // 		}
    // 	    }
    //         // Clean up workspace after the build
    //         cleanWs()
    //     }
    //     success {
    //         echo 'Build and tests completed successfully!'
    //     }
    //     failure {
    //         echo 'Build or tests failed. Please check the logs.'
    //     }
    // }
}
