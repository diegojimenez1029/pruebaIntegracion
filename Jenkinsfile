pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main',
                url: 'https://github.com/diegojimenez1029/pruebaIntegracion.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Iniciar y validar API') {
            steps {
                // Iniciar el servidor en segundo plano
                sh 'nohup json-server --watch db.json --port 3001 &'
                
                // Esperar que el servidor esté listo
                sh 'sleep 5'
                
                // Validar que la API responde
                script {
                    def response = sh(script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/posts', returnStdout: true).trim()
                    
                    if (response != "200") {
                        error("La API no respondió correctamente. Código HTTP: ${response}")
                    } else {
                        echo "✅ API respondió correctamente (HTTP 200)"
                    }
                }
                
                // Detener el servidor después de la validación
                sh 'pkill -f "json-server" || true'
            }
        }
    }

    post {
        always {
            // Limpieza: asegurarse de que el servidor se detuvo
            sh 'pkill -f "json-server" || true'
        }
    }
}