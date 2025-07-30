-- 创建数据库
CREATE DATABASE IF NOT EXISTS agricultural_trace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agricultural_trace;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('admin', 'farmer', 'user') DEFAULT 'user',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 公司/农户表
CREATE TABLE IF NOT EXISTS companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  type ENUM('farm', 'processor', 'distributor', 'retailer') NOT NULL,
  address TEXT,
  contact_person VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  license_number VARCHAR(100),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 产品表
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  specifications JSON,
  images JSON,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
);

-- 溯源步骤定义表
CREATE TABLE IF NOT EXISTS steps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  sort_order INT DEFAULT 0,
  required_fields JSON,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 溯源记录主表
CREATE TABLE IF NOT EXISTS trace_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trace_code VARCHAR(50) UNIQUE NOT NULL,
  product_id INT NOT NULL,
  company_id INT NOT NULL,
  batch_number VARCHAR(50),
  production_date DATE,
  expiry_date DATE,
  quantity DECIMAL(10,2),
  unit VARCHAR(20),
  status ENUM('active', 'completed', 'recalled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  INDEX idx_trace_code (trace_code),
  INDEX idx_product_id (product_id)
);

-- 溯源步骤记录表
CREATE TABLE IF NOT EXISTS trace_steps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trace_code VARCHAR(50) NOT NULL,
  step_id INT NOT NULL,
  step_order INT NOT NULL,
  operator_name VARCHAR(50),
  operator_id INT,
  location VARCHAR(200),
  timestamp TIMESTAMP NOT NULL,
  data JSON,
  images JSON,
  notes TEXT,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trace_code) REFERENCES trace_records(trace_code),
  FOREIGN KEY (step_id) REFERENCES steps(id),
  FOREIGN KEY (operator_id) REFERENCES users(id),
  INDEX idx_trace_code (trace_code),
  INDEX idx_step_order (step_order)
);

-- 查询日志表
CREATE TABLE IF NOT EXISTS query_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trace_code VARCHAR(50),
  ip_address VARCHAR(45),
  user_agent TEXT,
  result ENUM('success', 'not_found', 'error') NOT NULL,
  response_time INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_trace_code (trace_code),
  INDEX idx_created_at (created_at)
);

-- 插入初始数据

-- 管理员用户 (密码: 123456)
INSERT IGNORE INTO users (username, password, name, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', 'admin');

-- 分类数据
INSERT INTO categories (name, description, icon, sort_order) VALUES
('蔬菜类', '新鲜蔬菜产品', '🥬', 1),
('水果类', '新鲜水果产品', '🍎', 2),
('粮食类', '谷物粮食产品', '🌾', 3),
('肉类', '畜禽肉类产品', '🥩', 4),
('水产类', '水产海鲜产品', '🐟', 5);

-- 公司数据
INSERT INTO companies (name, type, address, contact_person, phone) VALUES
('绿野农场', 'farm', '山东省潍坊市寿光市', '张三', '13800138001'),
('新鲜加工厂', 'processor', '山东省济南市历城区', '李四', '13800138002'),
('快运物流', 'distributor', '北京市朝阳区', '王五', '13800138003'),
('超市连锁', 'retailer', '上海市浦东新区', '赵六', '13800138004');

-- 溯源步骤定义
INSERT INTO steps (name, description, icon, sort_order, required_fields) VALUES
('种植/养殖', '产品的种植或养殖阶段', '🌱', 1, '["location", "date", "method", "materials"]'),
('采收/屠宰', '产品的采收或屠宰阶段', '✂️', 2, '["date", "quantity", "quality", "operator"]'),
('加工处理', '产品的加工处理阶段', '🏭', 3, '["process_type", "date", "equipment", "standards"]'),
('包装标识', '产品的包装和标识阶段', '📦', 4, '["package_type", "date", "batch", "labels"]'),
('运输配送', '产品的运输配送阶段', '🚚', 5, '["transport_method", "route", "temperature", "time"]'),
('质量检测', '产品的质量检测阶段', '🔬', 6, '["test_items", "results", "standards", "certificate"]');

-- 产品数据
INSERT INTO products (name, category, description, specifications) VALUES
('有机白菜', '蔬菜类', '无农药有机种植白菜', '{"weight": "500g", "origin": "山东寿光"}'),
('红富士苹果', '水果类', '优质红富士苹果', '{"weight": "250g", "grade": "一级", "origin": "山东烟台"}'),
('五常大米', '粮食类', '东北五常优质大米', '{"weight": "5kg", "grade": "特级", "origin": "黑龙江五常"}');

-- 示例溯源记录
INSERT INTO trace_records (trace_code, product_id, company_id, batch_number, production_date, quantity, unit) VALUES
('TEST-TRACE-0001', 1, 1, 'BC20240101', '2024-01-01', 100.00, 'kg'),
('DEMO-001', 2, 1, 'AP20240102', '2024-01-02', 50.00, 'kg'),
('SAMPLE-002', 3, 1, 'RC20240103', '2024-01-03', 200.00, 'kg');

-- 示例溯源步骤
INSERT INTO trace_steps (trace_code, step_id, step_order, operator_name, location, timestamp, data, notes) VALUES
('TEST-TRACE-0001', 1, 1, '张三', '绿野农场A区', '2024-01-01 08:00:00', '{"method": "有机种植", "fertilizer": "有机肥"}', '使用有机肥料，无农药种植'),
('TEST-TRACE-0001', 2, 2, '李四', '绿野农场A区', '2024-01-15 10:00:00', '{"quality": "优质", "weight": "100kg"}', '采收时天气良好，品质优良'),
('TEST-TRACE-0001', 4, 3, '王五', '新鲜加工厂', '2024-01-15 14:00:00', '{"package": "保鲜袋", "batch": "BC20240101"}', '真空包装，保持新鲜');