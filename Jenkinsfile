pipeline {
  
    agent {
        label 'windows' // Asegúrate de tener un agente con esta etiqueta
    }
    stages {
        stage('Clonar repositorio') {
            steps {
                bat 'git clone https://github.com/diegojimenez1029/pruebaIntegracion.git'
                dir('pruebaIntegracion') {
                    bat 'git checkout master'
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }

        stage('Iniciar API') {
            steps {
                bat 'start /B json-server --watch db.json --port 3001'
                bat 'timeout /t 5'
                script {
                    def response = bat(script: '@powershell -command "(Invoke-WebRequest -Uri http://localhost:3001/posts -UseBasicParsing).StatusCode"', returnStdout: true).trim()
                    if (response != "200") {
                        error("API no responde. Código: ${response}")
                    }
                }
            }
        }
    }

    post {
        always {
            bat 'taskkill /F /IM node.exe /T || exit 0'
        }
    }
}