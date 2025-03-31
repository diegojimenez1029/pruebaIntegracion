pipeline {
    agent any // Ejecuta en cualquier agente disponible

    stages {
        stage('Clonar repositorio') {
            steps {
                script {
                    // Detectar sistema operativo
                    if (isUnix()) {
                        sh 'git clone https://github.com/diegojimenez1029/pruebaIntegracion.git'
                        dir('pruebaIntegracion') {
                            sh 'git checkout master'
                        }
                    } else {
                        bat 'git clone https://github.com/diegojimenez1029/pruebaIntegracion.git'
                        dir('pruebaIntegracion') {
                            bat 'git checkout master'
                        }
                    }
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Iniciar API') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'nohup json-server --watch db.json --port 3001 &'
                        sh 'sleep 5'
                        def response = sh(script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/posts', returnStdout: true).trim()
                    } else {
                        bat 'start /B json-server --watch db.json --port 3001'
                        bat 'timeout /t 5'
                        def response = bat(script: '@powershell -command "(Invoke-WebRequest -Uri http://localhost:3001/posts -UseBasicParsing).StatusCode"', returnStdout: true).trim()
                    }
                    
                    if (response != "200") {
                        error("API no responde. Código: ${response}")
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'pkill -f "json-server" || true'
                } else {
                    bat 'taskkill /F /IM node.exe /T || exit 0'
                }
            }
        }
    }
}