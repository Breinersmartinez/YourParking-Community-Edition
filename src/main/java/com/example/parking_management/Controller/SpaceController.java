package com.example.parking_management.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.parking_management.Entity.Space;
import com.example.parking_management.Service.SpaceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping(path="api/spaces")
public class SpaceController {

    @Autowired
private SpaceService spaceService;



@GetMapping
public List<Space> getAll()
{
    return spaceService.getSpace();
}

@GetMapping("/{spaceId}")
public Optional<Space> getById()
{
    
}



}
