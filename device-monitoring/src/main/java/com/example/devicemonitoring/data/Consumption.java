package com.example.devicemonitoring.data;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "_consumption")
public class Consumption {
    @Id
    @GeneratedValue
    private Integer consumptionId;
    private long timestamp;
    private Float totalConsumption;
    private Float maxConsumption;
    private Integer deviceId;
}
