pipeline {
    agent any

    environment {
        IMAGE_NAME = "devops-cicd-app"
        CONTAINER_NAME = "devops-cicd-app"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/ujwalshetty7022/devops-cicd-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker run -d \
                --name ${CONTAINER_NAME} \
                -p 80:80 \
                ${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        always {
            sh 'docker ps -a'
        }

        success {
            echo '✅ Deployment Successful'
        }

        failure {
            echo '❌ Deployment Failed'
        }
    }
}