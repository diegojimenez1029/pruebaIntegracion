pipeline {
    agent any

    environment {
        // Ruta donde npm instala los paquetes globales
        NPM_GLOBAL = bat(script: 'npm root -g', returnStdout: true).trim()
        PATH = "${NPM_GLOBAL};${env.PATH}"
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
                bat 'npm install -g json-server'
                // Verificar instalación
                bat 'where json-server'
                bat 'npm install'
            }
        }

        stage('Iniciar y probar API') {
            steps {
                script {
                    try {
                        // 1. Iniciar json-server directamente (sin start)
                        bat """
                        set PIDFILE=server.pid
                        json-server --watch db.json --port 3001 > server.log 2>&1 &
                        echo %ERRORLEVEL% > %PIDFILE%
                        """
                        
                        // 2. Esperar inicio
                        bat 'timeout /t 15'
                        
                        // 3. Verificar proceso
                        def pid = readFile('server.pid').trim()
                        if (pid != "0") {
                            error("Error al iniciar json-server. Código: ${pid}")
                        }
                        
                        // 4. Verificar API
                        def status = bat(
                            script: '@powershell -command "(Invoke-WebRequest -Uri \'http://localhost:3001/posts\' -UseBasicParsing).StatusCode"',
                            returnStdout: true
                        ).trim()
                        
                        if (status != '200') {
                            error("API no responde. Código: ${status}")
                        }
                    } catch (e) {
                        // Mostrar logs en caso de error
                        bat 'type server.log || echo No hay logs'
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