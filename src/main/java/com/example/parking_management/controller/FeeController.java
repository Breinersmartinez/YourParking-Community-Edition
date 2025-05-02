package com.example.parking_management.controller;

import com.example.parking_management.model.Fee;
import com.example.parking_management.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/rates")
public class FeeController {

    @Autowired
    private final FeeService feeService;
    public FeeController(FeeService feeService)
    {
        this.feeService = feeService;
    }


    @GetMapping
    public List<Fee> getAll()
    {
        return feeService.getFee();
    }


    @GetMapping("/{feeId}")
    public Optional<Fee> getById(@PathVariable("feeId") Long feeId)
    {
        return feeService.getFee(feeId);
    }


    @PostMapping
    public void getAll(@RequestBody Fee fee)
    {
        feeService.saveOrUpdate(fee);
    }


    @DeleteMapping("/{feeId}")
    public void saveOrUpdate(@PathVariable("freeId") Long feeId)
    {
        feeService.delete(feeId);
    }
}
