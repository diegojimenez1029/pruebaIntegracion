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
            // 1. Iniciar el servidor y redirigir output a un archivo
            bat 'start /B json-server --watch db.json --port 3001 > server.log 2>&1'
            
            // 2. Esperar que el servidor esté listo
            bat 'timeout /t 10'
            
            // 3. Verificar si el puerto está en uso
            def portCheck = bat(script: '@powershell -command "Test-NetConnection -ComputerName localhost -Port 3001"', returnStdout: true)
            if (!portCheck.contains('TcpTestSucceeded : True')) {
                error("El servidor no se inició correctamente")
            }
            
            // 4. Verificar respuesta HTTP
            def response = bat(script: '@powershell -command "(Invoke-WebRequest -Uri http://localhost:3001/posts -UseBasicParsing).StatusCode"', returnStdout: true).trim()
            if (response != "200") {
                error("API no responde. Código: ${response}")
            }
            
            // 5. Mostrar logs para diagnóstico
            bat 'type server.log'
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