package com.example.bankitdemo.repository;

import com.example.bankitdemo.entity.LoanCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface LoanCustomerRepository extends JpaRepository<LoanCustomer, Long> {

    long countByRiskLevel(String riskLevel);

    @Query("select count(c) from LoanCustomer c where c.errorReason is not null and c.errorReason <> ''")
    long countErrorCustomers();

    @Query(value = "select coalesce(avg(loan_amount), 0) from loan_customer where loan_amount is not null", nativeQuery = true)
    BigDecimal averageLoanAmount();
}
