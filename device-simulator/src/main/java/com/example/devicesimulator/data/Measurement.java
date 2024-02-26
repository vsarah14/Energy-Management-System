package com.example.devicesimulator.data;

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
