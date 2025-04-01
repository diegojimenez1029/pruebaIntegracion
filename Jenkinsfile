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
                bat 'npm install -g json-server'
                bat 'npm install'
            }
        }

        stage('Iniciar y probar API') {
            steps {
                script {
                    // 1. Iniciar el servidor de forma asíncrona
                    bat '''
                    @echo off
                    set PIDFILE=server.pid
                    
                    :: Iniciar json-server y guardar PID
                    start "JSON Server" /B cmd /C "json-server --watch db.json --port 3001 & echo %%~dpnx0 > %PIDFILE%"
                    
                    :: Esperar inicio
                    timeout /t 10
                    
                    :: Verificar respuesta
                    curl -s -o response.txt -w "%%{http_code}" http://localhost:3001/posts
                    set /p STATUS=<response.txt
                    
                    if not "%STATUS%"=="200" (
                        echo ERROR: API no responde. Código: %STATUS%
                        type response.txt
                        taskkill /F /FI "WINDOWTITLE eq JSON Server*" > nul 2>&1
                        exit 1
                    )
                    
                    echo API iniciada correctamente
                    '''
                }
            }
        }
    }

    post {
        always {
            // Limpieza garantizada
            bat '''
            taskkill /F /FI "WINDOWTITLE eq JSON Server*" > nul 2>&1 || exit 0
            del server.pid response.txt > nul 2>&1 || exit 0
            '''
        }
    }
}