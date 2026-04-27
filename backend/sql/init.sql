CREATE DATABASE IF NOT EXISTS bank_it_demo DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bank_it_demo;

DROP TABLE IF EXISTS loan_customer;

CREATE TABLE loan_customer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(50),
    phone VARCHAR(20),
    id_card VARCHAR(30),
    loan_amount DECIMAL(15, 2),
    monthly_income DECIMAL(15, 2),
    credit_score INT,
    apply_date DATE,
    status VARCHAR(30),
    risk_level VARCHAR(20),
    error_reason VARCHAR(500)
);

INSERT INTO loan_customer
(customer_name, phone, id_card, loan_amount, monthly_income, credit_score, apply_date, status, risk_level, error_reason)
VALUES
('张明', '13800138001', '320102199801011234', 120000.00, 9000.00, 720, '2026-01-12', '已放款', NULL, NULL),
('李娜', '13900139002', '320102199702021235', 260000.00, 10000.00, 635, '2026-01-20', '审批中', NULL, NULL),
('王强', '13700137003', '320102199603031236', 380000.00, 9000.00, 660, '2026-02-03', '审批中', NULL, NULL),
('赵敏', '1360013600', '320102199504041237', 90000.00, 8000.00, 690, '2026-02-11', '已放款', NULL, NULL),
('陈磊', '13500135005', NULL, 150000.00, 7000.00, 610, '2026-02-18', '待补件', NULL, NULL),
('周婷', '13400134006', '320102199306061239', 0.00, 8500.00, 705, '2026-03-01', '已拒绝', NULL, NULL),
('吴昊', '13300133007', '320102199207071240', 200000.00, NULL, 680, '2026-03-08', '待补件', NULL, NULL),
('郑雪', '13200132008', '320102199108081241', 80000.00, 6500.00, 580, '2026-03-15', '已拒绝', NULL, NULL);
