package com.example.parking_management.monthlyPayment.period.model;

import com.example.parking_management.monthlyPayment.monthlyPayment.model.MonthlyPayment;
import com.example.parking_management.monthlyPayment.paymentApplication.model.PaymentApplication;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "periodos")
public class Period {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mensualidad_id", nullable = false)
    private MonthlyPayment monthlyPayment;

    @Column(name = "anio_mes", nullable = false)
    private LocalDate yearMonth;

    @Column(name = "monto", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate dueDate;

    @Column(name = "fecha_generacion", nullable = false)
    private LocalDateTime generationDate;

    @OneToMany(mappedBy = "period", fetch = FetchType.LAZY)
    private List<PaymentApplication> applications = new ArrayList<>();

    protected Period() {
    }

    public BigDecimal calculateBalance() {
        BigDecimal applied = applications == null ? BigDecimal.ZERO : applications.stream()
            .map(PaymentApplication::getAppliedAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return amount.subtract(applied).setScale(2, RoundingMode.HALF_UP);
    }

    public PeriodStatus calculateStatus(LocalDate currentDate) {
        if (applications != null && applications.stream().anyMatch(a -> a.getAppliedAmount() == null)) {
            throw new IllegalStateException("Existe una aplicación de pago con monto nulo");
        }
        BigDecimal balance = calculateBalance();
        if (balance.compareTo(BigDecimal.ZERO) <= 0) {
            return PeriodStatus.PAID;
        }
        if (currentDate.isAfter(dueDate)) {
            return PeriodStatus.OVERDUE;
        }
        if (applications != null && !applications.isEmpty()) {
            return PeriodStatus.PARTIAL;
        }
        return PeriodStatus.PENDING;
    }
}
