
pipeline {
    agent {
        label 'docker-agent'
    }

    environment {
        IMAGE_NAME = 'devops-cicd-app'
        CONTAINER_NAME = 'devops-cicd-app'
        APP_PORT = '80'
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ujwalshetty7022/devops-cicd-app.git'

                echo 'GitHub repository cloned successfully.'
            }
        }

        stage('Test') {
            steps {
                sh '''
                    set -eu

                    echo "Checking application files..."

                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f Dockerfile

                    echo "Installing validation tools..."

                    npm exec --yes --package=html-validate -- \
                        html-validate index.html

                    npm exec --yes --package=stylelint -- \
                        stylelint --config '{"extends":["stylelint-config-standard"]}' style.css

                    npm exec --yes --package=eslint -- \
                        eslint --no-config-lookup \
                        --no-ignore \
                        --no-warn-ignored \
                        --no-config-lookup \
                        --no-ignore \
                        --no-warn-ignored \
                        --no-inline-config \
                        --no-eslintrc \
                        script.js
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    set -eu

                    echo "Building Docker image..."

                    docker build \
                        -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                        -t ${IMAGE_NAME}:latest .

                    echo "Docker image built successfully."
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu

                    echo "Deploying application on Jenkins Agent..."

                    docker rm -f ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:80 \
                        ${IMAGE_NAME}:${BUILD_NUMBER}

                    echo "Waiting for application..."

                    for i in $(seq 1 15); do
                        if docker exec ${CONTAINER_NAME} \
                            wget -q -O /dev/null http://127.0.0.1/; then
                            echo "Application is responding."
                            exit 0
                        fi
                        sleep 2
                    done

                    echo "Application health check failed."
                    docker logs ${CONTAINER_NAME}
                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Application deployed on Jenkins Agent EC2!'
        }

        failure {
            echo 'FAILED: Check Jenkins Console Output.'
        }
    }
}
