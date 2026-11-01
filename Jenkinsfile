
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

                    echo "=================================="
                    echo "CHECKING APPLICATION FILES"
                    echo "=================================="

                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f Dockerfile
                    test -f .stylelintrc.json
                    test -f eslint.config.mjs

                    echo "All application files found."

                    echo "=================================="
                    echo "HTML VALIDATION"
                    echo "=================================="

                    npm exec --yes \
                        --package=html-validate \
                        -- html-validate index.html

                    echo "HTML validation passed."

                    echo "=================================="
                    echo "STYLELINT CONFIGURATION DIAGNOSTICS"
                    echo "=================================="

                    echo "Current workspace:"
                    pwd

                    echo "Current Stylelint configuration:"
                    cat .stylelintrc.json

                    echo "Searching for other Stylelint configurations:"

                    find .. -maxdepth 3 -type f \
                        \\( -name ".stylelintrc*" -o -name "stylelint.config.*" \\) \
                        -print

                    echo "Searching for old configuration reference:"

                    grep -R -n "stylelint-config-standard" . \
                        --exclude-dir=.git \
                        --exclude-dir=node_modules || true

                    echo "=================================="
                    echo "CSS VALIDATION"
                    echo "=================================="

                    npm exec --yes \
                        --package=stylelint \
                        -- stylelint --config .stylelintrc.json style.css

                    echo "CSS validation passed."

                    echo "=================================="
                    echo "JAVASCRIPT VALIDATION"
                    echo "=================================="

                    npm exec --yes \
                        --package=eslint \
                        -- eslint script.js

                    echo "JavaScript validation passed."

                    echo "=================================="
                    echo "ALL CODE VALIDATION CHECKS PASSED"
                    echo "=================================="
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    set -eu

                    echo "=================================="
                    echo "BUILDING DOCKER IMAGE"
                    echo "=================================="

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

                    echo "=================================="
                    echo "DEPLOYING APPLICATION"
                    echo "=================================="

                    echo "Deploying on Jenkins Agent EC2..."

                    docker rm -f ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:80 \
                        ${IMAGE_NAME}:${BUILD_NUMBER}

                    echo "Waiting for application health check..."

                    for i in $(seq 1 15); do

                        if docker exec ${CONTAINER_NAME} \
                            wget -q -O /dev/null http://127.0.0.1/; then

                            echo "Application is responding successfully."
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
            echo 'GitHub -> Jenkins Controller -> Jenkins Agent -> Docker -> Nginx'
        }

        failure {
            echo 'FAILED: Check Jenkins Console Output.'
        }
    }
}
