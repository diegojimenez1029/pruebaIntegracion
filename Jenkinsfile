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
            }
        }

        stage('Iniciar servidor') {
            steps {
                script {
                    bat 'taskkill /F /IM node.exe /T > nul 2>&1 || exit 0'
                    bat '''
                    start "JSONServer" /B cmd /C "node_modules\\.bin\\json-server --watch db.json --port 3000 > server.log 2>&1 & echo %^% > server.pid"
                    '''
                    sleep 15
                }
            }
        }

        stage('Probar API') {
            steps {
                script {
                    def pid = readFile('server.pid').trim()
                    def status = bat(
                        script: '@powershell -command "$response = try { (Invoke-WebRequest -Uri \'http://localhost:3000/posts\' -UseBasicParsing).StatusCode } catch { 0 }; echo $response"',
                        returnStdout: true
                    ).trim()
                    
                    if (status != '200') {
                        bat 'type server.log'
                        error("API no responde. Código: ${status}")
                    }
                }
            }
        }
    }

    post {
        always {
            bat '''
            taskkill /F /IM node.exe /T > nul 2>&1 || exit 0
            taskkill /FI "WINDOWTITLE eq JSONServer*" /F > nul 2>&1 || exit 0
            del server.pid server.log > nul 2>&1 || exit 0
            '''
        }
    }
}