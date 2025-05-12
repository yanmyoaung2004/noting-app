package com.yma.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NotingAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(NotingAppApplication.class, args);
	}

}
