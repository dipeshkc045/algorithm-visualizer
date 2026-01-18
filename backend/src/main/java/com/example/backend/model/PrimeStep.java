package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrimeStep {
    private long divisor;
    private String expression;
    private String result;

    @JsonProperty("isMatch")
    private boolean isMatch;

    private String status; // e.g., "Checking", "Found Divisor", "No Divisor"
}
