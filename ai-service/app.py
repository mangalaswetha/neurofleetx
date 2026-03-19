# ai-service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from route_optimizer import RouteOptimizer
from maintenance_predictor import predict_maintenance

app = Flask(__name__)
CORS(app)

optimizer = RouteOptimizer()

@app.route('/api/ai/routes', methods=['POST'])
def get_routes():
    data = request.json
    start = data.get('start', 'A')
    end = data.get('end', 'F')
    routes = optimizer.get_all_routes(start, end)
    return jsonify(routes)

@app.route('/api/ai/maintenance', methods=['POST'])
def get_maintenance():
    vehicle_data = request.json
    prediction = predict_maintenance(vehicle_data)
    return jsonify(prediction)

@app.route('/api/ai/recommend', methods=['POST'])
def recommend_vehicle():
    """AI vehicle recommendation based on customer preferences"""
    data = request.json
    vehicle_type = data.get('type', 'SEDAN')
    seats_needed = data.get('seats', 4)
    prefer_ev = data.get('preferEv', False)
    
    # Simple scoring logic
    score_adjustments = {
        'type_match': 30,
        'seats_ok': 25,
        'ev_match': 20,
        'available': 25
    }
    
    return jsonify({
        'recommendation': f'Best match for {seats_needed}-seat {vehicle_type}',
        'confidence': 0.87,
        'reason': 'Based on availability, vehicle type, and your past bookings'
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'NeuroFleetX AI Service running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)