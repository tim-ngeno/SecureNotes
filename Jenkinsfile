pipeline {
    agent any

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
	    environment {
		MONGO_URI = credentials('MONGO_URI')
		JWT_SECRET = credentials('JWT_SECRET')
		ENCRYPTION_KEY = credentials('ENCRYPTION_KEY')
		PORT = '3000'
	    }
            steps {
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
