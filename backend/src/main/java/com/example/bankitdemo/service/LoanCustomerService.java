package com.example.bankitdemo.service;

import com.example.bankitdemo.dto.DashboardSummary;
import com.example.bankitdemo.entity.LoanCustomer;
import com.example.bankitdemo.repository.LoanCustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class LoanCustomerService {

    private static final String LOW_RISK = "低风险";
    private static final String MEDIUM_RISK = "中风险";
    private static final String HIGH_RISK = "高风险";

    private final LoanCustomerRepository repository;

    public LoanCustomerService(LoanCustomerRepository repository) {
        this.repository = repository;
    }

    public List<LoanCustomer> findAll() {
        return repository.findAll();
    }

    @Transactional
    public List<LoanCustomer> checkDataQuality() {
        List<LoanCustomer> customers = repository.findAll();
        for (LoanCustomer customer : customers) {
            customer.setErrorReason(buildErrorReason(customer));
            customer.setRiskLevel(calculateRiskLevel(customer));
        }
        return repository.saveAll(customers);
    }

    public DashboardSummary getSummary() {
        long lowRiskCount = repository.countByRiskLevel(LOW_RISK);
        long mediumRiskCount = repository.countByRiskLevel(MEDIUM_RISK);
        long highRiskCount = repository.countByRiskLevel(HIGH_RISK);
        BigDecimal averageLoanAmount = repository.averageLoanAmount().setScale(2, RoundingMode.HALF_UP);

        return new DashboardSummary(
                repository.count(),
                repository.countErrorCustomers(),
                highRiskCount,
                averageLoanAmount,
                lowRiskCount,
                mediumRiskCount,
                highRiskCount
        );
    }

    public Map<String, Long> getErrorTypes() {
        Map<String, Long> result = new LinkedHashMap<>();
        for (LoanCustomer customer : repository.findAll()) {
            String errorReason = customer.getErrorReason();
            if (errorReason == null || errorReason.isBlank()) {
                continue;
            }
            for (String reason : errorReason.split("；")) {
                if (!reason.isBlank()) {
                    result.merge(reason, 1L, Long::sum);
                }
            }
        }
        return result;
    }

    private String buildErrorReason(LoanCustomer customer) {
        List<String> reasons = new ArrayList<>();
        if (customer.getPhone() == null || !customer.getPhone().matches("\\d{11}")) {
            reasons.add("手机号格式异常");
        }
        if (customer.getIdCard() == null || customer.getIdCard().isBlank()) {
            reasons.add("身份证缺失");
        }
        if (!isPositive(customer.getLoanAmount())) {
            reasons.add("贷款金额异常");
        }
        if (!isPositive(customer.getMonthlyIncome())) {
            reasons.add("收入数据缺失");
        }
        if (customer.getCreditScore() == null || customer.getCreditScore() < 600) {
            reasons.add("信用评分偏低");
        }
        return String.join("；", reasons);
    }

    private String calculateRiskLevel(LoanCustomer customer) {
        if (!isPositive(customer.getLoanAmount()) || !isPositive(customer.getMonthlyIncome())) {
            return HIGH_RISK;
        }
        BigDecimal ratio = customer.getLoanAmount().divide(customer.getMonthlyIncome(), 2, RoundingMode.HALF_UP);
        Integer creditScore = customer.getCreditScore();

        if (creditScore == null || creditScore < 600 || ratio.compareTo(BigDecimal.valueOf(30)) > 0) {
            return HIGH_RISK;
        }
        if ((creditScore >= 600 && creditScore <= 649) || ratio.compareTo(BigDecimal.valueOf(20)) > 0) {
            return MEDIUM_RISK;
        }
        return LOW_RISK;
    }

    private boolean isPositive(BigDecimal value) {
        return value != null && value.compareTo(BigDecimal.ZERO) > 0;
    }
}
