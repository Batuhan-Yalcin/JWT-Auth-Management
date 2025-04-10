package com.batuhanyalcin.springreactapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.batuhanyalcin")
@ComponentScan(basePackages = "com.batuhanyalcin")
@EnableJpaRepositories(basePackages = "com.batuhanyalcin")

public class SpringreactappApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringreactappApplication.class, args);
	}
}
