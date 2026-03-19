package com.neurofleetx.services;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
    return vehicleRepository.findById(id).map(existing -> {
        existing.setName(vehicle.getName());
        existing.setModel(vehicle.getModel());
        existing.setStatus(vehicle.getStatus());
        existing.setFuelLevel(vehicle.getFuelLevel());
        existing.setBatteryLevel(vehicle.getBatteryLevel());
        existing.setLatitude(vehicle.getLatitude());
        existing.setLongitude(vehicle.getLongitude());
        existing.setMileage(vehicle.getMileage());
        existing.setSeats(vehicle.getSeats());
        existing.setIsEv(vehicle.getIsEv());
        return vehicleRepository.save(existing);
    }).orElseThrow(() -> new RuntimeException("Vehicle not found"));
}

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatus(Vehicle.VehicleStatus.AVAILABLE);
    }
}
