from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required, get_jwt_identity
from models.User import User
from utils.validators import is_valid_email
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)  # Para depuración, eliminar en producción
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Email inválido"}), 400
    if len(password) < 8:
        return jsonify({"error": "La contraseña debe tener al menos 8 caracteres"}), 400

    existing_user = User.find_by_email(email)
    if existing_user:
        return jsonify({"error": "Email ya registrado"}), 409

    try:
        user = User(name, email, password)
        user.save()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(user.to_dict()), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    user = User.find_by_email(email)
    if not user or not user.verify_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    expires = datetime.timedelta(hours=24)
    access_token = create_access_token(identity=str(user.id), expires_delta=expires)

    response = jsonify({"user": user.to_dict(), "access_token": access_token})
    set_access_cookies(response, access_token)  # sin parámetros extra que den error
    return response, 200



@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    print("Logout request received")  # Para depuración, eliminar en producción
    response = jsonify({"msg": "Logout exitoso"})
    unset_jwt_cookies(response)
    return response
