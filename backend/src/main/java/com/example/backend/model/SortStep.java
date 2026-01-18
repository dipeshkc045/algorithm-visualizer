package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SortStep {
    private List<Integer> array;
    private List<Integer> comparing; // Indices being compared
    private boolean swapping; // Are they swapping?
    private List<Integer> sorted; // Indices that are sorted
    private String description;
}
