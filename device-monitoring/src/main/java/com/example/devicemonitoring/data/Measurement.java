package com.example.devicemonitoring.data;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Measurement {
    private Integer deviceId;
    private long timestamp;
    private Float measurementValue;
}
