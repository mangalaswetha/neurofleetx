# ai-service/route_optimizer.py
import heapq

class RouteOptimizer:
    def __init__(self):
        # Simulated city graph: node -> [(neighbor, distance_km, traffic_factor)]
        self.graph = {
            'A': [('B', 5.2, 1.0), ('C', 8.1, 1.3)],
            'B': [('A', 5.2, 1.0), ('D', 3.4, 0.9), ('E', 7.1, 1.5)],
            'C': [('A', 8.1, 0.8), ('E', 4.2, 1.1)],
            'D': [('B', 3.4, 1.0), ('F', 2.1, 0.7)],
            'E': [('B', 7.1, 1.0), ('C', 4.2, 1.0), ('F', 3.8, 1.2)],
            'F': [('D', 2.1, 0.9), ('E', 3.8, 1.0)],
        }
    
    def dijkstra(self, start, end, optimize_for='time'):
        """
        optimize_for: 'time', 'distance', or 'eco' (fuel efficiency)
        """
        distances = {node: float('inf') for node in self.graph}
        distances[start] = 0
        pq = [(0, start, [start])]
        
        while pq:
            cost, current, path = heapq.heappop(pq)
            
            if current == end:
                eta_minutes = int(cost * 3)  # rough ETA estimate
                return {
                    'path': path,
                    'distance_km': round(cost, 2),
                    'eta_minutes': eta_minutes,
                    'route_type': optimize_for,
                    'traffic_score': round(cost / len(path), 2)
                }
            
            for neighbor, dist, traffic in self.graph.get(current, []):
                if optimize_for == 'time':
                    weight = dist * traffic
                elif optimize_for == 'eco':
                    weight = dist * 1.1  # slightly longer but more fuel efficient
                else:
                    weight = dist
                
                new_cost = cost + weight
                if new_cost < distances[neighbor]:
                    distances[neighbor] = new_cost
                    heapq.heappush(pq, (new_cost, neighbor, path + [neighbor]))
        
        return None
    
    def get_all_routes(self, start, end):
        """Return fastest, shortest, and eco routes"""
        return {
            'fastest': self.dijkstra(start, end, 'time'),
            'shortest': self.dijkstra(start, end, 'distance'),
            'eco': self.dijkstra(start, end, 'eco'),
        }