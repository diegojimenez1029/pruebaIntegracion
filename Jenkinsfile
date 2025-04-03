pipeline {
    agent any

    stages {
        stage('Preparar entorno') {
            steps {
                cleanWs()
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
                bat 'npm install json-server'
                bat 'npm install'
            }
        }

        stage('Iniciar y probar API') {
            steps {
                script {
                    // 1. Iniciar el servidor en un paso separado
                    bat 'start "JSON Server" cmd /C node_modules\\.bin\\json-server --watch db.json --port 3001'
                    
                    // 2. Esperar que el servidor inicie
                    bat 'timeout /t 15'
                    
                    // 3. Verificar que el puerto esté en uso
                    def portInUse = bat(
                        script: '@powershell -command "Test-NetConnection -ComputerName localhost -Port 3001 | Select-Object -ExpandProperty TcpTestSucceeded"',
                        returnStdout: true
                    ).trim()
                    
                    if (portInUse != 'True') {
                        error("El puerto 3001 no está siendo usado por json-server")
                    }
                    
                    // 4. Verificar respuesta HTTP
                    def status = bat(
                        script: '@powershell -command "(Invoke-WebRequest -Uri \'http://localhost:3001/posts\' -UseBasicParsing).StatusCode"',
                        returnStdout: true
                    ).trim()
                    
                    if (status != '200') {
                        error("API no responde. Código: ${status}")
                    }
                    
                    echo "✅ API funcionando correctamente"
                }
            }
        }
    }

    post {
        always {
            // Limpieza garantizada
            bat 'taskkill /F /IM node.exe /T > nul 2>&1 || exit 0'
            bat 'taskkill /FI "WINDOWTITLE eq JSON Server*" /F > nul 2>&1 || exit 0'
        }
    }
}