package com.example.parking_management.service;

import com.example.parking_management.dto.subscriptionDTO.SubscriptionRequest;
import com.example.parking_management.dto.subscriptionDTO.SubscriptionResponse;
import com.example.parking_management.model.subscription.Subscription;
import com.example.parking_management.model.subscription.enums.SubscriptionState;
import com.example.parking_management.model.subscription.enums.SubscriptionType;
import com.example.parking_management.model.user.User;
import com.example.parking_management.model.vehicles.Vehicle;
import com.example.parking_management.repository.SubscriptionRepository;
import com.example.parking_management.repository.UserRepository;
import com.example.parking_management.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               UserRepository userRepository,
                               VehicleRepository vehicleRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<SubscriptionResponse> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public SubscriptionResponse getSubscriptionById(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado con ID: " + id));
        return convertToResponse(subscription);
    }

    public List<SubscriptionResponse> getSubscriptionsByUser(Integer idCard) {
        return subscriptionRepository.findByUser_IdCard(idCard).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionResponse createSubscription(SubscriptionRequest request) {
        User user = userRepository.findById(request.getIdCard())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + request.getIdCard()));

        Vehicle vehicle = null;
        if (request.getPlate() != null) {
            vehicle = vehicleRepository.findByPlate(request.getPlate())
                    .orElseThrow(() -> new RuntimeException("Vehículo no encontrado con placa: " + request.getPlate()));
        }

        LocalDate inicio = request.getFechaInicio() != null ? request.getFechaInicio() : LocalDate.now();
        LocalDate fin = request.getFechaFin() != null ? request.getFechaFin() : calculateEndDate(inicio, request.getTipoAbono());

        Subscription subscription = Subscription.builder()
                .user(user)
                .vehicle(vehicle)
                .tipoAbono(request.getTipoAbono())
                .fechaInicio(inicio)
                .fechaFin(fin)
                .monto(request.getMonto())
                .estado(fin.isBefore(LocalDate.now()) ? SubscriptionState.VENCIDO : SubscriptionState.ACTIVO)
                .build();

        Subscription saved = subscriptionRepository.save(subscription);
        return convertToResponse(saved);
    }

    @Transactional
    public SubscriptionResponse updateState(Long id, SubscriptionState estado) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado con ID: " + id));
        subscription.setEstado(estado);
        Subscription saved = subscriptionRepository.save(subscription);
        return convertToResponse(saved);
    }

    @Transactional
    public void deleteSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abono no encontrado con ID: " + id));
        subscriptionRepository.delete(subscription);
    }

    private LocalDate calculateEndDate(LocalDate inicio, SubscriptionType tipo) {
        if (tipo == null) {
            return inicio.plusMonths(1);
        }
        switch (tipo) {
            case MENSUAL:
                return inicio.plusMonths(1).minusDays(1);
            case TRIMESTRAL:
                return inicio.plusMonths(3).minusDays(1);
            case ANUAL:
                return inicio.plusYears(1).minusDays(1);
            default:
                return inicio.plusMonths(1);
        }
    }

    private SubscriptionResponse convertToResponse(Subscription subscription) {
        return SubscriptionResponse.builder()
                .idAbono(subscription.getIdAbono())
                .idCard(subscription.getUser() != null ? subscription.getUser().getIdCard() : null)
                .plate(subscription.getVehicle() != null ? subscription.getVehicle().getPlate() : null)
                .tipoAbono(subscription.getTipoAbono())
                .fechaInicio(subscription.getFechaInicio())
                .fechaFin(subscription.getFechaFin())
                .monto(subscription.getMonto())
                .estado(subscription.getEstado())
                .build();
    }
}
