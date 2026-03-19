# ai-service/maintenance_predictor.py

def predict_maintenance(vehicle_data):
    """
    Simple rule-based + threshold predictor.
    In production, this would be a trained ML model.
    """
    issues = []
    
    mileage = vehicle_data.get('mileage', 0)
    engine_temp = vehicle_data.get('engine_temp', 90)
    tire_pressure = vehicle_data.get('tire_pressure', 32)
    fuel_level = vehicle_data.get('fuel_level', 100)
    last_service_km = vehicle_data.get('last_service_km', 0)
    
    km_since_service = mileage - last_service_km
    
    # Engine oil check (every 5000km)
    if km_since_service > 4500:
        issues.append({
            'type': 'Engine Oil',
            'severity': 'HIGH' if km_since_service > 5000 else 'MEDIUM',
            'message': f'Oil change due in {max(0, 5000 - km_since_service):.0f} km',
            'action': 'Schedule oil change'
        })
    
    # Engine temperature
    if engine_temp > 100:
        issues.append({
            'type': 'Engine Temperature',
            'severity': 'CRITICAL',
            'message': f'Engine temp {engine_temp}°C — overheating risk',
            'action': 'Check coolant immediately'
        })
    
    # Tire pressure
    if tire_pressure < 28 or tire_pressure > 36:
        issues.append({
            'type': 'Tire Pressure',
            'severity': 'MEDIUM',
            'message': f'Tire pressure {tire_pressure} PSI — abnormal',
            'action': 'Check and inflate/deflate tires'
        })
    
    # Low fuel
    if fuel_level < 15:
        issues.append({
            'type': 'Fuel Level',
            'severity': 'HIGH',
            'message': f'Fuel critically low: {fuel_level}%',
            'action': 'Refuel immediately'
        })
    
    # Overall health score (0-100)
    health_score = 100
    for issue in issues:
        if issue['severity'] == 'CRITICAL': health_score -= 30
        elif issue['severity'] == 'HIGH': health_score -= 20
        elif issue['severity'] == 'MEDIUM': health_score -= 10
    
    return {
        'vehicle_id': vehicle_data.get('vehicle_id'),
        'health_score': max(0, health_score),
        'issues': issues,
        'status': 'CRITICAL' if health_score < 40 else 'WARNING' if health_score < 70 else 'HEALTHY'
    }