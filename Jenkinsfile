pipeline {
    agent any

    stages {
        stage('Preparar entorno') {
            steps {
                cleanWs() // Limpia el workspace antes de comenzar
            }
        }

        stage('Clonar repositorio') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']],
                    extensions: [],
                    userRemoteConfigs: [[url: 'https://github.com/diegojimenez1029/pruebaIntegracion.git']]
                ])
            }
        }

        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }

        stage('Iniciar API') {
            steps {
                script {
                    // Iniciar json-server en segundo plano
                    bat 'start "" /B json-server --watch db.json --port 3001'
                    
                    // Esperar 10 segundos para que el servidor inicie
                    bat 'timeout /t 10'
                    
                    // Verificar si el servidor está respondiendo
                    def status = bat(script: '@powershell -command "(Invoke-WebRequest -Uri \'http://localhost:3001/posts\' -UseBasicParsing).StatusCode"', returnStdout: true).trim()
                    
                    if (status != '200') {
                        error("La API no respondió correctamente. Código: ${status}")
                    } else {
                        echo "✅ API funcionando correctamente"
                    }
                }
            }
        }
    }

    post {
        always {
            // Limpieza: detener cualquier instancia de json-server
            bat 'taskkill /F /IM node.exe /T > nul 2>&1 || exit 0'
            
            // Opcional: Archivar logs para diagnóstico
            archiveArtifacts artifacts: '**/server.log', allowEmptyArchive: true
        }
    }
}