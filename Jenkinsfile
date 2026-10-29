pipeline {
    agent any

    environment {
        IMAGE_NAME = "devops-cicd-app"
        CONTAINER_NAME = "devops-cicd-app"
        SLAVE_IP = "10.0.153.85"
        SSH_KEY = "/var/lib/jenkins/.ssh/my_pemkey.pem"
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
                docker build -t devops-cicd-app:latest .
                '''
            }
        }

        stage('Save Docker Image') {
            steps {
                sh '''
                docker save devops-cicd-app:latest -o devops-cicd-app.tar
                '''
            }
        }

        stage('Copy Image To Slave') {
            steps {
                sh '''
                scp -o StrictHostKeyChecking=no \
                -i ${SSH_KEY} \
                devops-cicd-app.tar \
                ubuntu@${SLAVE_IP}:/home/ubuntu/
                '''
            }
        }

        stage('Deploy To Slave') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no \
                -i ${SSH_KEY} \
                ubuntu@${SLAVE_IP} "
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true
                docker load -i /home/ubuntu/devops-cicd-app.tar
                docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p 80:80 \
                    devops-cicd-app:latest
                "
                '''
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully to slave node'
        }

        failure {
            echo 'Deployment failed'
        }
    }
}