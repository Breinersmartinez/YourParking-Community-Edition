package com.example.parking_management.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.parking_management.Entity.Space;
import com.example.parking_management.Repository.SpaceRepository;

@Service
public class SpaceService {


    @Autowired
SpaceRepository spaceRepository;


public List<Space> getSpace()
{
return spaceRepository.findAll();
}


public Optional<Space> getSpace(Long id)
{
return spaceRepository.findById(id);
}

public void saveOrUpdate(Space space )
{
spaceRepository.save(space);
}


public void delete( Long id)
{
spaceRepository.deleteById(id);
}


}
