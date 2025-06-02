from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from database.db_handler import DBHandler

products_bp = Blueprint('products', __name__)
db = DBHandler()  # instancia de tu clase para manejar la DB

@products_bp.route('/', methods=['GET'])
def list_products():
    max_price = request.args.get('max_price', type=float)
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)

    if page <= 0 or limit <= 0:
        return jsonify({"error": "Parámetros inválidos para paginación"}), 400

    try:
        offset = (page - 1) * limit
        query = "SELECT * FROM products WHERE is_active = 1"
        params = []

        if max_price is not None:
            query += " AND price <= ?"
            params.append(max_price)

        query += " LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        rows = db.fetch_all(query, tuple(params))
        products = [dict(row) for row in rows]

        # obtener total sin límite para paginación
        count_query = "SELECT COUNT(*) as total FROM products WHERE is_active = 1"
        count_params = []
        if max_price is not None:
            count_query += " AND price <= ?"
            count_params.append(max_price)
        count_result = db.fetch_one(count_query, tuple(count_params))
        total = count_result['total'] if count_result else 0

        return jsonify({
            "products": products,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total
            }
        }), 200

    except Exception as e:
        return jsonify({"error": "Ocurrió un error inesperado.", "message": str(e)}), 500


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    query = "SELECT * FROM products WHERE id = ? AND is_active = 1"
    row = db.fetch_one(query, (product_id,))
    if not row:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(dict(row)), 200


@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({"error": "Acceso denegado"}), 403

    data = request.get_json()
    try:
        query = '''
            INSERT INTO products (name, description, price, stock, category, image_url, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        '''
        params = (
            data.get('name'),
            data.get('description'),
            data.get('price'),
            data.get('stock'),
            data.get('category'),
            data.get('image_url'),
            data.get('is_active', 1)
        )
        db.execute_query(query, params)
        return jsonify({"message": "Producto creado exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
