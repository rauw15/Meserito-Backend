#!/usr/bin/env python3
"""
Script de inicio rápido para ejecutar las pruebas de autenticación
"""
import subprocess
import sys
import time
import requests

BASE_URL = "http://127.0.0.1:30000"

def check_server():
    """Verifica si el servidor está funcionando"""
    try:
        response = requests.get(f"{BASE_URL}/users/get", timeout=2)
        return True
    except:
        return False

def start_server():
    """Inicia el servidor en segundo plano"""
    print("🖥️ Iniciando servidor...")
    process = subprocess.Popen(
        ["npm", "start"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    # Esperar a que el servidor esté listo
    for i in range(30):
        if check_server():
            print("✅ Servidor iniciado correctamente")
            return process
        time.sleep(1)
        print(f"⏳ Esperando servidor... {i+1}/30")
    
    print("❌ No se pudo iniciar el servidor")
    process.terminate()
    return None

def setup_database():
    """Configura la base de datos de pruebas"""
    print("🗄️ Configurando base de datos...")
    try:
        subprocess.run(["python", "test/setup_test_db.py"], check=True)
        print("✅ Base de datos configurada")
        return True
    except subprocess.CalledProcessError:
        print("❌ Error configurando base de datos")
        return False

def run_tests():
    """Ejecuta las pruebas"""
    print("🧪 Ejecutando pruebas...")
    try:
        result = subprocess.run(["pytest", "test/auth/test_auth.py", "-v"], 
                              capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("Errores:", result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error ejecutando pruebas: {e}")
        return False

def main():
    print("🚀 Iniciando pruebas rápidas de autenticación")
    
    # Verificar si el servidor ya está ejecutándose
    if check_server():
        print("✅ Servidor ya está ejecutándose")
        server_process = None
    else:
        server_process = start_server()
        if not server_process:
            return 1
    
    # Configurar base de datos
    if not setup_database():
        if server_process:
            server_process.terminate()
        return 1
    
    # Ejecutar pruebas
    success = run_tests()
    
    # Detener servidor si lo iniciamos
    if server_process:
        print("🛑 Deteniendo servidor...")
        server_process.terminate()
        server_process.wait()
    
    if success:
        print("\n🎉 ¡Todas las pruebas pasaron!")
        return 0
    else:
        print("\n💥 Algunas pruebas fallaron")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 