from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db_handler import DBHandler

cart_bp = Blueprint('cart', __name__)
db = DBHandler()

@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    try:
        query = '''
            SELECT c.id as cart_id, p.id as product_id, p.name, p.price, c.quantity
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        '''
        rows = db.fetch_all(query, (user_id,))
        cart_items = [dict(row) for row in rows]
        return jsonify(cart_items), 200
    except Exception as e:
        return jsonify({"error": "Error obteniendo carrito", "message": str(e)}), 500


@cart_bp.route('/', methods=['POST'])
@jwt_required()
def add_to_cart():
    print("Headers:", dict(request.headers))  # te dice si Flask lo recibe
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"error": "Falta product_id"}), 400

    try:
        # Verificar si ya existe el producto en el carrito para este usuario
        existing = db.fetch_one(
            "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?",
            (user_id, product_id)
        )

        if existing:
            # Actualizar cantidad sumando la nueva
            new_quantity = existing['quantity'] + quantity
            db.execute_query(
                "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
                (new_quantity, user_id, product_id)
            )
        else:
            # Insertar nuevo producto en carrito
            db.execute_query(
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
                (user_id, product_id, quantity)
            )

        return jsonify({"message": "Producto agregado al carrito"}), 200
    except Exception as e:
        return jsonify({"error": "Error agregando al carrito", "message": str(e)}), 500


@cart_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    user_id = get_jwt_identity()
    try:
        db.execute_query(
            "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
            (user_id, product_id)
        )
        return jsonify({"message": "Producto eliminado del carrito"}), 200
    except Exception as e:
        return jsonify({"error": "Error eliminando producto del carrito", "message": str(e)}), 500
