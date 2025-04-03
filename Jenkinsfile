pipeline {
    agent any

    stages {
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
                // Verificar que json-server está instalado
                bat 'dir node_modules\\.bin\\json-server*'
            }
        }

        stage('Iniciar servidor') {
            steps {
                script {
                    // 1. Limpiar procesos previos
                    bat 'taskkill /F /IM node.exe /T > nul 2>&1 || exit 0'
                    
                    // 2. Crear db.json si no existe
                    bat 'if not exist db.json echo {} > db.json'
                    
                    // 3. Iniciar json-server y capturar PID correctamente
                    bat '''
                    set PIDFILE=server.pid
                    start "JSONServer" /B cmd /C "node_modules\\.bin\\json-server --watch db.json --port 3000 > server.log 2>&1 & echo !^! > %PIDFILE%"
                    '''
                    
                    // 4. Esperar 15 segundos para que el servidor inicie
                    sleep 15
                    
                    // 5. Verificar que el archivo PID existe
                    bat 'if not exist server.pid exit 1'
                }
            }
        }

        stage('Probar API') {
            steps {
                script {
                    // 1. Leer PID del archivo
                    def pid = readFile('server.pid').trim()
                    
                    // 2. Verificar que el proceso está corriendo
                    def processRunning = bat(
                        script: '@powershell -command "$(Get-Process -Id '+pid+' -ErrorAction SilentlyContinue) -ne $null"',
                        returnStdout: true
                    ).trim()
                    
                    if (processRunning != 'True') {
                        error("El proceso del servidor no está corriendo")
                    }
                    
                    // 3. Verificar respuesta HTTP
                    def status = bat(
                        script: '@powershell -command "$response = try { (Invoke-WebRequest -Uri \'http://localhost:3000/posts\' -UseBasicParsing).StatusCode } catch { 0 }; echo $response"',
                        returnStdout: true
                    ).trim()
                    
                    // 4. Mostrar logs si hay error
                    if (status != '200') {
                        bat 'type server.log || echo No hay logs disponibles'
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
            bat '''
            taskkill /F /IM node.exe /T > nul 2>&1 || exit 0
            taskkill /FI "WINDOWTITLE eq JSONServer*" /F > nul 2>&1 || exit 0
            del server.pid server.log > nul 2>&1 || exit 0
            '''
        }
    }
}