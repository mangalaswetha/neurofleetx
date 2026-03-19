package com.neurofleetx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.neurofleetx")
public class NeuroFleetXApplication {
    public static void main(String[] args) {
        SpringApplication.run(NeuroFleetXApplication.class, args);
    }
}
