
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        APP_IMAGE = 'devops-cicd-app'
        APP_CONTAINER = 'devops-cicd-app'
        APP_SERVER_HOST = '10.0.1.20'
        APP_SERVER_USER = 'ubuntu'
        SSH_CREDENTIALS_ID = 'app-server-ssh'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Source code checked out successfully.'
            }
        }

        stage('Validate Application') {
            steps {
                sh '''
                    set -eu
                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f Dockerfile
                    echo "Required application files are present."
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    set -eu
                    docker build \
                      -t ${APP_IMAGE}:${BUILD_NUMBER} \
                      -t ${APP_IMAGE}:latest .
                '''
            }
        }

        stage('Prepare Image for Transfer') {
            steps {
                sh '''
                    set -eu
                    docker save \
                      -o app-image.tar \
                      ${APP_IMAGE}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Transfer Image to EC2') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh '''
                        set -eu

                        scp -o BatchMode=yes \
                          app-image.tar \
                          ${APP_SERVER_USER}@${APP_SERVER_HOST}:/tmp/app-image.tar
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh '''
                        set -eu

                        ssh -o BatchMode=yes \
                          ${APP_SERVER_USER}@${APP_SERVER_HOST} \
                          "set -eu
                           docker load -i /tmp/app-image.tar
                           docker rm -f ${APP_CONTAINER} >/dev/null 2>&1 || true
                           docker run -d \
                             --name ${APP_CONTAINER} \
                             --restart unless-stopped \
                             -p 80:80 \
                             ${APP_IMAGE}:${BUILD_NUMBER}
                           rm -f /tmp/app-image.tar
                           docker ps --filter name=${APP_CONTAINER}"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    sh '''
                        set -eu

                        ssh -o BatchMode=yes \
                          ${APP_SERVER_USER}@${APP_SERVER_HOST} \
                          "set -eu
                           docker inspect \
                             --format='Container status: {{.State.Status}}' \
                             ${APP_CONTAINER}
                           docker exec ${APP_CONTAINER} \
                             wget -q -O /dev/null http://127.0.0.1/"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment completed and the container health check passed.'
        }

        failure {
            echo 'Pipeline failed. Review the Jenkins console output.'
        }

        always {
            sh 'rm -f app-image.tar || true'
        }
    }
}
