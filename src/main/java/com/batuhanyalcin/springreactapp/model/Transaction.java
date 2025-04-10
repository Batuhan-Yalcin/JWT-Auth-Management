package com.batuhanyalcin.springreactapp.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "date")
	private LocalDate date;
	
	@Column(name = "total_cost")
	private BigDecimal totalCost;
	
	@Column(name = "covered_amount")
	private BigDecimal coveredAmount;
	
	@Column(name = "covered_amount")
	private BigDecimal uncoveredAmount;
	
	

}
