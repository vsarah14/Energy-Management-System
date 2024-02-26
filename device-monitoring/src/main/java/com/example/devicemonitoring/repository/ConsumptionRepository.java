package com.example.devicemonitoring.repository;

import com.example.devicemonitoring.data.Consumption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsumptionRepository extends JpaRepository<Consumption,Integer> {
}
