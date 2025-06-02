from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Order import Order
from models.Product import Product

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    user_identity = get_jwt_identity()
    user_id = user_identity.get('id')
    data = request.get_json()

    shipping_address = data.get('shipping_address')
    items = data.get('items')  # Lista de {product_id, quantity}

    if not shipping_address or not items:
        return jsonify({"error": "Datos incompletos"}), 422

    order = Order(user_id=user_id, shipping_address=shipping_address)

    try:
        for item in items:
            product = Product.find_by_id(item['product_id'])
            if not product or product.stock < item['quantity']:
                return jsonify({"error": f"Producto {item['product_id']} sin stock suficiente"}), 400
            order.add_item(product, item['quantity'])

        order.process_order()  # Implementa lógica de stock y estado
        order.save()  # Guarda la orden en base de datos
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(order.get_order_summary()), 201

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_identity = get_jwt_identity()
    user_id = user_identity.get('id')

    orders = Order.find_by_user(user_id)
    orders_data = [order.get_order_summary() for order in orders]

    return jsonify(orders_data), 200

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_identity = get_jwt_identity()
    user_id = user_identity.get('id')

    order = Order.find_by_id(order_id)
    if not order:
        return jsonify({"error": "Orden no encontrada"}), 404
    if order.user_id != user_id:
        return jsonify({"error": "Acceso denegado"}), 403

    return jsonify(order.get_order_summary()), 200
