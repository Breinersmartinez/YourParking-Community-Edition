package com.example.parking_management.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.parking_management.Entity.Space;
import com.example.parking_management.Service.SpaceService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
public Optional<Space> getById(@PathVariable("spaceId") Long spaceId)
{
    return spaceService.getSpace(spaceId);
}

@PostMapping
public void getAll(@RequestBody Space space)
{
    spaceService.saveOrUpdate(space);
}

@DeleteMapping("/{spaceId}")
public void saveOrUpdate(@PathVariable("spaceId" ) Long spaceId) {
    spaceService.delete(spaceId);
}

  
}
