package com.example.project1.device.persistance;

import com.example.project1.device.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Integer> {
    void deleteByUserId(Integer user_id);

    List<Device> findByUserId(Integer user_id);
}
