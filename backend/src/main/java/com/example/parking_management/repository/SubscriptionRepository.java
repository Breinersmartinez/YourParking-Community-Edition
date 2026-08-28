package com.example.parking_management.repository;

import com.example.parking_management.model.subscription.Subscription;
import com.example.parking_management.model.subscription.enums.SubscriptionState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUser_IdCard(Integer idCard);
    List<Subscription> findByEstado(SubscriptionState estado);
    List<Subscription> findByVehicle_Plate(String plate);
}
