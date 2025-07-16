import pytest
import requests

BASE_URL = "http://127.0.0.1:30000"

# Usuarios de prueba
ADMIN = {"email": "admin@example.com", "password": "adminpass"}
WAITER = {"email": "mesero@example.com", "password": "meseropass"}
NEW_USER = {
    "name": "Nuevo Usuario",
    "email": "nuevo@example.com",
    "password": "nuevopass",
    "role": "mesero"
}

admin_token = None
waiter_token = None
created_user_id = None

def login(email, password):
    response = requests.post(f"{BASE_URL}/users/login", json={"email": email, "password": password})
    return response

def get_token(user):
    resp = login(user["email"], user["password"])
    return resp.json().get("token")

def test_login_admin_success():
    global admin_token
    resp = login(ADMIN["email"], ADMIN["password"])
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
    assert data["user"]["role"] == "administrador"
    admin_token = data["token"]
    print("✅ test_login_admin_success PASÓ")

def test_login_waiter_success():
    global waiter_token
    resp = login(WAITER["email"], WAITER["password"])
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
    assert data["user"]["role"] == "mesero"
    waiter_token = data["token"]
    print("✅ test_login_waiter_success PASÓ")

def test_login_wrong_password():
    resp = login(ADMIN["email"], "wrongpassword")
    assert resp.status_code == 401
    assert "error" in resp.json()
    print("✅ test_login_wrong_password PASÓ")

def test_login_nonexistent_email():
    resp = login("noexiste@example.com", "cualquierpass")
    assert resp.status_code == 401 or resp.status_code == 404
    print("✅ test_login_nonexistent_email PASÓ")

def test_login_empty_fields():
    resp = login("", "")
    assert resp.status_code == 400 or resp.status_code == 401
    print("✅ test_login_empty_fields PASÓ")

def test_get_users_admin():
    global admin_token
    if not admin_token:
        admin_token = get_token(ADMIN)
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = requests.get(f"{BASE_URL}/users/get", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    print("✅ test_get_users_admin PASÓ")

def test_get_users_no_token():
    resp = requests.get(f"{BASE_URL}/users/get")
    assert resp.status_code == 401 or resp.status_code == 403
    print("✅ test_get_users_no_token PASÓ")

def test_get_users_waiter_token():
    global waiter_token
    if not waiter_token:
        waiter_token = get_token(WAITER)
    headers = {"Authorization": f"Bearer {waiter_token}"}
    resp = requests.get(f"{BASE_URL}/users/get", headers=headers)
    assert resp.status_code == 403
    print("✅ test_get_users_waiter_token PASÓ")

def test_create_user_success():
    global admin_token, created_user_id
    if not admin_token:
        admin_token = get_token(ADMIN)
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = requests.post(f"{BASE_URL}/users/create", json=NEW_USER, headers=headers)
    assert resp.status_code == 201 or resp.status_code == 200
    data = resp.json()
    assert "id" in data or "_id" in data
    created_user_id = data.get("id") or data.get("_id")
    print("✅ test_create_user_success PASÓ")

def test_create_user_duplicate_email():
    global admin_token
    if not admin_token:
        admin_token = get_token(ADMIN)
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = requests.post(f"{BASE_URL}/users/create", json=NEW_USER, headers=headers)
    assert resp.status_code == 400 or resp.status_code == 409
    print("✅ test_create_user_duplicate_email PASÓ")

def test_create_user_invalid_data():
    global admin_token
    if not admin_token:
        admin_token = get_token(ADMIN)
    headers = {"Authorization": f"Bearer {admin_token}"}
    invalid_user = {"email": "invalido@example.com", "password": "123", "role": "invalido"}
    resp = requests.post(f"{BASE_URL}/users/create", json=invalid_user, headers=headers)
    assert resp.status_code == 400
    print("✅ test_create_user_invalid_data PASÓ")

def test_update_user():
    global admin_token, created_user_id
    if not admin_token:
        admin_token = get_token(ADMIN)
    if not created_user_id:
        pytest.skip("No user created to update")
    headers = {"Authorization": f"Bearer {admin_token}"}
    update_data = {"name": "Usuario Actualizado"}
    resp = requests.put(f"{BASE_URL}/users/update/{created_user_id}", json=update_data, headers=headers)
    assert resp.status_code == 200
    print("✅ test_update_user PASÓ")

def test_delete_user():
    global admin_token, created_user_id
    if not admin_token:
        admin_token = get_token(ADMIN)
    if not created_user_id:
        pytest.skip("No user created to delete")
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = requests.delete(f"{BASE_URL}/users/delete/{created_user_id}", headers=headers)
    assert resp.status_code == 200
    print("✅ test_delete_user PASÓ")