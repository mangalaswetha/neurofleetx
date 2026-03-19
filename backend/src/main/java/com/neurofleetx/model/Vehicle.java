package com.neurofleetx.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String model;

    @Enumerated(EnumType.STRING)
    private VehicleType type;

    @Column(name = "plate_number")
    private String plateNumber;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(name = "fuel_level")
    private Double fuelLevel = 100.0;

    @Column(name = "battery_level")
    private Double batteryLevel = 100.0;

    private Double latitude = 13.0827;
    private Double longitude = 80.2707;
    private Double mileage = 0.0;
    private Integer seats = 5;

    @Column(name = "is_ev")
    private Boolean isEv = false;

    public enum VehicleType {
        SEDAN, SUV, TRUCK, BUS, EV
    }

    public enum VehicleStatus {
        AVAILABLE, IN_USE, MAINTENANCE, IDLE
    }

    // ─── Getters and Setters ───────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public VehicleType getType() { return type; }
    public void setType(VehicleType type) { this.type = type; }

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }

    public Double getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(Double fuelLevel) { this.fuelLevel = fuelLevel; }

    public Double getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Double batteryLevel) { this.batteryLevel = batteryLevel; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getMileage() { return mileage; }
    public void setMileage(Double mileage) { this.mileage = mileage; }

    public Integer getSeats() { return seats; }
    public void setSeats(Integer seats) { this.seats = seats; }

    public Boolean getIsEv() { return isEv; }
    public void setIsEv(Boolean isEv) { this.isEv = isEv; }
}