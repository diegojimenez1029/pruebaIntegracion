pipeline {
    agent any

    environment {
        // Usar npx para evitar problemas de PATH
        JSON_SERVER = 'npx json-server'
    }

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
                // Instalar localmente en lugar de globalmente
                bat 'npm install json-server'
                bat 'npm install'
                
                // Verificar instalación local
                bat 'dir node_modules\\.bin\\json-server*'
            }
        }

        stage('Iniciar y probar API') {
            steps {
                script {
                    try {
                        // 1. Iniciar json-server localmente
                        bat """
                        set PIDFILE=server.pid
                        node_modules\\.bin\\json-server --watch db.json --port 3001 > server.log 2>&1 &
                        echo %ERRORLEVEL% > %PIDFILE%
                        """
                        
                        // 2. Esperar inicio (15 segundos)
                        bat 'timeout /t 15'
                        
                        // 3. Verificar proceso
                        def pid = readFile('server.pid').trim()
                        if (pid != "0") {
                            error("Error al iniciar json-server. Código: ${pid}")
                        }
                        
                        // 4. Verificar API con PowerShell
                        def status = bat(
                            script: '@powershell -command "(Invoke-WebRequest -Uri \'http://localhost:3001/posts\' -UseBasicParsing).StatusCode"',
                            returnStdout: true
                        ).trim()
                        
                        if (status != '200') {
                            bat 'type server.log'
                            error("API no responde. Código: ${status}")
                        } else {
                            echo "✅ API funcionando correctamente"
                        }
                    } catch (e) {
                        bat 'type server.log || echo No hay logs disponibles'
                        throw e
                    }
                }
            }
        }
    }

    post {
        always {
            // Limpieza garantizada
            bat '''
            taskkill /F /IM node.exe /T > nul 2>&1 || exit 0
            del server.pid server.log > nul 2>&1 || exit 0
            '''
        }
    }
}