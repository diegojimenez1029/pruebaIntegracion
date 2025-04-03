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
                sh 'npm install'
            }
        }

        stage('Iniciar servidor') {
            steps {
                sh 'json-server --watch db.json --port 3000 &'
                sleep(time:10, unit:"SECONDS") // Esperar a que levante el servidor
            }
        }

        stage('Probar API') {
            steps {
                script {
                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000", returnStdout: true).trim()
                    if (response != '200') {
                        error("La API no respondió correctamente")
                    }
                }
            }
        }
    }
}