package com.example.bankitdemo.controller;

import com.example.bankitdemo.dto.DashboardSummary;
import com.example.bankitdemo.entity.LoanCustomer;
import com.example.bankitdemo.service.LoanCustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoanCustomerController {

    private final LoanCustomerService service;

    public LoanCustomerController(LoanCustomerService service) {
        this.service = service;
    }

    @GetMapping("/customers")
    public List<LoanCustomer> getCustomers() {
        return service.findAll();
    }

    @PostMapping("/check")
    public List<LoanCustomer> checkDataQuality() {
        return service.checkDataQuality();
    }

    @GetMapping("/dashboard/summary")
    public DashboardSummary getSummary() {
        return service.getSummary();
    }

    @GetMapping("/dashboard/error-types")
    public Map<String, Long> getErrorTypes() {
        return service.getErrorTypes();
    }
}
