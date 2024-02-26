package com.example.devicemonitoring.repository;

import com.example.devicemonitoring.data.DeviceMonitoring;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<DeviceMonitoring, Integer> {
    DeviceMonitoring findByDeviceId(Integer deviceId);
}
