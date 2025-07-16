import pytest
import requests

BASE_URL = "http://127.0.0.1:30000"
PRODUCTS_URL = f"{BASE_URL}/products"

ADMIN = {"email": "admin@example.com", "password": "adminpass"}
WAITER = {"email": "mesero@example.com", "password": "meseropass"}

admin_token = None
waiter_token = None
created_product_id = None

def login(user):
    resp = requests.post(f"{BASE_URL}/users/login", json=user)
    assert resp.status_code == 200
    return resp.json()["token"]

@pytest.fixture(scope="module", autouse=True)
def setup_tokens():
    global admin_token, waiter_token
    admin_token = login(ADMIN)
    waiter_token = login(WAITER)

def auth_header(token):
    return {"Authorization": f"Bearer {token}"}

def test_get_all_products():
    resp = requests.get(f"{PRODUCTS_URL}/getAll")
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"
    print("test_get_all_products PASSED")

def test_create_product_success():
    global created_product_id
    payload = {
        "id": 1001,
        "name": "Sushi Deluxe",
        "description": "Sushi variado",
        "price": 150.0
    }
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200 or resp.status_code == 201
    data = resp.json()
    assert data["status"] == "success"
    created_product_id = data["data"]["id"]
    print("test_create_product_success PASSED")

def test_get_product_by_id():
    resp = requests.get(f"{PRODUCTS_URL}/get/{1001}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["id"] == 1001
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
    payload = {"id": 1005, "name": "Sushi Deluxe", "description": "Duplicado", "price": 200}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 400 or resp.status_code == 409
    print("test_create_product_duplicate_name PASSED")

def test_create_product_unauthorized():
    payload = {"id": 1006, "name": "SinAuth", "description": "No token", "price": 50}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload)
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_create_product_unauthorized (no token) PASSED")
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_create_product_unauthorized (waiter token) PASSED")

def test_update_product_success():
    payload = {"name": "Sushi Premium", "price": 180}
    resp = requests.put(f"{PRODUCTS_URL}/update/{1001}", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["data"]["name"] == "Sushi Premium"
    print("test_update_product_success PASSED")

def test_update_product_duplicate_name():
    # Crear otro producto
    payload = {"id": 1007, "name": "Tempura", "description": "Tempura", "price": 120}
    resp = requests.post(f"{PRODUCTS_URL}/create", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200 or resp.status_code == 201
    # Intentar actualizar el producto 1001 con el nombre "Tempura"
    payload = {"name": "Tempura"}
    resp = requests.put(f"{PRODUCTS_URL}/update/{1001}", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 400 or resp.status_code == 409
    print("test_update_product_duplicate_name PASSED")

def test_update_product_stock_only():
    payload = {"stock": 50}
    resp = requests.put(f"{PRODUCTS_URL}/update/{1001}", json=payload, headers=auth_header(admin_token))
    assert resp.status_code == 200
    print("test_update_product_stock_only PASSED")

def test_update_product_unauthorized():
    payload = {"name": "IntentoNoAdmin"}
    # Sin token
    resp = requests.put(f"{PRODUCTS_URL}/update/1001", json=payload)
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_update_product_unauthorized (no token) PASSED")
    # Token de mesero
    resp = requests.put(f"{PRODUCTS_URL}/update/1001", json=payload, headers=auth_header(waiter_token))
    assert resp.status_code == 401 or resp.status_code == 403
    print("test_update_product_unauthorized (waiter token) PASSED")

def test_delete_product_success():
    resp = requests.delete(f"{PRODUCTS_URL}/delete/{1001}", headers=auth_header(admin_token))
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
