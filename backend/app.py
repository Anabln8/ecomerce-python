from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from database.db_handler import DBHandler
from config.settings import settings

# Importa tus blueprints
from api.auth import auth_bp
from api.products import products_bp
from api.orders import orders_bp
from api.cart import cart_bp

import logging

app = Flask(__name__)

# Configuraciones
app.config['JWT_SECRET_KEY'] = 'tu_secreto_jwt_aqui_cambia_por_algo_seguro'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False  # Cambiar a True si usas HTTPS en producción
app.config["JWT_COOKIE_HTTPONLY"] = True 
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # 24 horas en segundos

# Inicializa extensiones
jwt = JWTManager(app)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Registra blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(cart_bp, url_prefix='/api/cart/')

# Configura logging para debugging
logging.basicConfig(level=logging.DEBUG)

# Instancia de base de datos
db = DBHandler()

# Manejo global de errores para respuestas JSON
@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad Request", "message": str(e)}), 400

@app.errorhandler(401)
def unauthorized(e):
    return jsonify({"error": "Unauthorized", "message": str(e)}), 401

@app.errorhandler(403)
def forbidden(e):
    return jsonify({"error": "Forbidden", "message": str(e)}), 403

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found", "message": str(e)}), 404

@app.errorhandler(409)
def conflict(e):
    return jsonify({"error": "Conflict", "message": str(e)}), 409

@app.errorhandler(422)
def unprocessable_entity(e):
    return jsonify({"error": "Unprocessable Entity", "message": str(e)}), 422

@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Excepción no manejada: {e}")
    return jsonify({"error": "Internal Server Error", "message": "Ocurrió un error inesperado."}), 500

if __name__ == '__main__':
    try:
        db.create_tables()
        app.logger.info("Base de datos inicializada correctamente")
    except Exception as e:
        app.logger.error(f"Error al inicializar la base de datos: {e}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
