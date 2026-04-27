package com.example.bankitdemo.dto;

import java.math.BigDecimal;

public record DashboardSummary(
        long totalCustomers,
        long errorCustomers,
        long highRiskCustomers,
        BigDecimal averageLoanAmount,
        long lowRiskCount,
        long mediumRiskCount,
        long highRiskCount
) {
}
