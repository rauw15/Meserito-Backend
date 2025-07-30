import pytest
import requests
from pymongo import MongoClient
import time

BASE_URL = "http://127.0.0.1:30000"
PRODUCTS_URL = f"{BASE_URL}/products"

ADMIN = {"email": "admin@example.com", "password": "adminpass"}
WAITER = {"email": "mesero@example.com", "password": "meseropass"}

admin_token = None
waiter_token = None
created_product_id = None

def clear_products_db():
    """Limpiar completamente la colección de productos"""
    try:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["meserito_test"]
        # Eliminar todos los productos
        result = db.products.delete_many({})
        print(f"🗑️ Productos eliminados: {result.deleted_count}")
        
        # También limpiar cualquier índice problema y recrear
        try:
            db.products.drop()
            print("📋 Colección products eliminada completamente")
        except Exception as e:
            print(f"⚠️ No se pudo eliminar la colección: {e}")
        
        client.close()
        time.sleep(1)  # Dar tiempo para que la operación se complete
    except Exception as e:
        print(f"❌ Error limpiando productos: {e}")

def login(user):
    resp = requests.post(f"{BASE_URL}/users/login", json=user)
    assert resp.status_code == 200
    return resp.json()["token"]

@pytest.fixture(scope="module", autouse=True)
def setup_tokens():
    global admin_token, waiter_token
    # Limpiar productos antes de empezar
    print("🚀 Iniciando setup de tests de productos...")
    clear_products_db()
    # Obtener tokens
    admin_token = login(ADMIN)
    waiter_token = login(WAITER)
    print("✅ Setup completado")

def auth_header(token):
    return {"Authorization": f"Bearer {token}"}

def test_get_all_products():
    resp = requests.get(f"{PRODUCTS_URL}/getAll")
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
    print("test_get_all_products PASSED")

def test_create_product_success():
    global created_product_id
    # Usar un ID único basado en timestamp para evitar conflictos
    unique_id = int(time.time()) % 100000 + 2000  # ID entre 2000-102000
    payload = {
        "id": unique_id,
        "name": f"Sushi Deluxe {unique_id}",
        "description": "Sushi variado para test",
        "price": 150.0
    }
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    print(f"🔍 Create response: {resp.status_code} - {resp.text}")
    
    if resp.status_code not in [200, 201]:
        # Si falla, intentar limpiar y crear de nuevo
        print("⚠️ Primera creación falló, limpiando DB y reintentando...")
        clear_products_db()
        time.sleep(1)
        resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
        print(f"🔍 Retry create response: {resp.status_code} - {resp.text}")
    
    assert resp.status_code == 200 or resp.status_code == 201
    data = resp.json()
    assert data["status"] == "success"
    created_product_id = data["data"]["id"]
    print(f"✅ Producto creado con ID: {created_product_id}")
    print("test_create_product_success PASSED")

def test_get_product_by_id():
    global created_product_id
    if not created_product_id:
        pytest.skip("No product created to test")
    
    resp = requests.get(f"{PRODUCTS_URL}/get/{created_product_id}")
    print(f"🔍 Get by ID response: {resp.status_code} - {resp.text}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["id"] == created_product_id
    print("test_get_product_by_id PASSED")

def test_get_product_by_id_not_found():
    resp = requests.get(f"{PRODUCTS_URL}/get/99999")
    assert resp.status_code == 404
    assert resp.json()["status"] == "error"
    print("test_get_product_by_id_not_found PASSED")

def test_create_product_invalid_data():
    payload = {"id": 1002, "description": "Sin nombre", "price": 50}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 400
    print("test_create_product_invalid_data (missing name) PASSED")
    payload = {"id": 1003, "name": "Negativo", "description": "Precio negativo", "price": -10}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 400
    print("test_create_product_invalid_data (negative price) PASSED")
    payload = {"id": 1004, "name": "NoNum", "description": "Precio texto", "price": "abc"}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 400
    print("test_create_product_invalid_data (non-numeric price) PASSED")

def test_create_product_duplicate_name():
    global created_product_id
    if not created_product_id:
        pytest.skip("No product created to test duplicates")
    
    # Intentar crear producto con el mismo nombre
    payload = {"id": created_product_id + 1, "name": f"Sushi Deluxe {created_product_id}", "description": "Duplicado", "price": 200}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 400 or resp.status_code == 409
    print("test_create_product_duplicate_name PASSED")

def test_create_product_unauthorized():
    payload = {"id": 9999, "name": "SinAuth", "description": "No token", "price": 50}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload)
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_create_product_unauthorized (no token) PASSED")
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_create_product_unauthorized (waiter token) PASSED")

def test_update_product_success():
    global created_product_id
    if not created_product_id:
        pytest.skip("No product created to update")
        
    payload = {"name": "Sushi Premium", "price": 180}
    resp = requests.put(f"{PRODUCTS_URL}/update/{created_product_id}", json=payload, headers=auth_header(admin_token))
    print(f"🔍 Update response: {resp.status_code} - {resp.text}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["name"] == "Sushi Premium"
    print("test_update_product_success PASSED")

def test_update_product_duplicate_name():
    global created_product_id
    if not created_product_id:
        pytest.skip("No product created to test")
        
    # Crear otro producto para probar duplicados
    temp_id = created_product_id + 10
    payload = {"id": temp_id, "name": "Tempura Test", "description": "Tempura para test", "price": 120}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    print(f"🔍 Create Tempura response: {resp.status_code} - {resp.text}")
    assert resp.status_code == 200 or resp.status_code == 201
    
    # Intentar actualizar el producto original con el nombre "Tempura Test"
    payload = {"name": "Tempura Test"}
    resp = requests.put(f"{PRODUCTS_URL}/update/{created_product_id}", json=payload, headers=auth_header(admin_token))
    print(f"🔍 Update duplicate name response: {resp.status_code} - {resp.text}")
    assert resp.status_code == 400 or resp.status_code == 409
    print("test_update_product_duplicate_name PASSED")

def test_update_product_stock_only():
    global created_product_id
    if not created_product_id:
        pytest.skip("No product created to update")
        
    payload = {"stock": 50}
    resp = requests.put(f"{PRODUCTS_URL}/update/{created_product_id}", json=payload, headers=auth_header(admin_token))
    print(f"🔍 Update stock response: {resp.status_code} - {resp.text}")
    assert resp.status_code == 200
    print("test_update_product_stock_only PASSED")

def test_update_product_unauthorized():
    global created_product_id
    if not created_product_id:
        pytest.skip("No product created to test")
        
    payload = {"name": "IntentoNoAdmin"}
    # Sin token
    resp = requests.put(f"{PRODUCTS_URL}/update/{created_product_id}", json=payload)
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_update_product_unauthorized (no token) PASSED")
    # Token de mesero
    resp = requests.put(f"{PRODUCTS_URL}/update/{created_product_id}", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_update_product_unauthorized (waiter token) PASSED")

def test_delete_product_success():
    global created_product_id
    if not created_product_id:
        pytest.skip("No product created to delete")
        
    resp = requests.delete(f"{PRODUCTS_URL}/delete/{created_product_id}", headers=auth_header(admin_token))
    print(f"🔍 Delete response: {resp.status_code} - {resp.text}")
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
    print("test_delete_product_success PASSED")

def test_delete_product_not_found():
    resp = requests.delete(f"{PRODUCTS_URL}/delete/99999", headers=auth_header(admin_token))
    assert resp.status_code == 404
    print("test_delete_product_not_found PASSED")

def test_delete_product_unauthorized():
    # Sin token
    resp = requests.delete(f"{PRODUCTS_URL}/delete/1001")
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_delete_product_unauthorized (no token) PASSED")
    # Token de mesero
    resp = requests.delete(f"{PRODUCTS_URL}/delete/1001", headers=auth_header(waiter_token))
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_delete_product_unauthorized (waiter token) PASSED")
