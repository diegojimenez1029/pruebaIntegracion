pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git 'https://github.com/diegojimenez1029/pruebaIntegracion.git'
            }
        }
        
        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }

        stage('Iniciar servidor') {
            steps {
                bat 'start /b json-server --watch db.json --port 3000'
                script {
                    sleep(time: 10, unit: "SECONDS") // Esperar que el servidor arranque
                }
            }
        }

        stage('Probar API') {
            steps {
                script {
                    def response = bat(script: 'curl -s -o nul -w "%%{http_code}" http://localhost:3000', returnStdout: true).trim()
                    if (response != '200') {
                        error("La API no respondió correctamente")
                    }
                }
            }
        }
    }
}
