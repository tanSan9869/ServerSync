create table if not exists servers(
    id int auto_increment primary key,
    name varchar(255) not null,
    host varchar(255) not null,
    port int default 80,
    status ENUM('up','down','unknown') default 'unknown',
    created_at timestamp default current_timestamp
)

create table if not exists metrics(
    id int auto_increment primary key,
    server_id int not null,
    cpu_usage FLOAT,
    memory_usage FLOAT,
    disk_usage FLOAT,
    uptime_seconds BIGINT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_id INT NOT NULL,
    type ENUM('cpu', 'memory', 'disk', 'down') NOT NULL,
    message TEXT,
    threshold FLOAT,
    actual_value FLOAT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
)