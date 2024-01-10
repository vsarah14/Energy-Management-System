package com.example.project1.device.business;

import com.example.project1.device.model.Device;
import com.example.project1.device.persistance.DeviceRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
@Component
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    //CRUD operations
    //C - create
    public Device createDevice(Device device) {
        return deviceRepository.save(device);
    }

    //R - read
    public List<Device> readDevice() {
        return deviceRepository.findAll();
    }

    //U - update
    public Device updateDevice(Device device, Integer id) {
        Device newDevice = deviceRepository.findById(id).get();

        if (Objects.nonNull(device.getName()) && !"".equalsIgnoreCase(device.getName())) {
            newDevice.setName(device.getName());
        }
        if (Objects.nonNull(device.getMaxConsumption()) && !"".equalsIgnoreCase(device.getMaxConsumption().toString())) {
            newDevice.setMaxConsumption(device.getMaxConsumption());
        }

        newDevice.setUserId(device.getUserId());

        return deviceRepository.save(newDevice);
    }

    //D - delete
    public String deleteDevice(Integer deviceId) {
        deviceRepository.deleteById(deviceId);
        return "Device deleted successfully.";
    }

    //delete the user from a device, when the user is deleted
    @Transactional
    public void deleteDeviceAndUser(Integer user_id) {
        List<Device> devices = deviceRepository.findByUserId(user_id);
        for (Device d : devices) {
            d.setUserId(null);
        }
    }

    //read devices just for a client
    public List<Device> readDeviceForUser(Integer id) {
        return deviceRepository.findByUserId(id);
    }

    //find a device by id
    public Device findById(Integer id) {
        return deviceRepository.findById(id).orElse(null);
    }


}
