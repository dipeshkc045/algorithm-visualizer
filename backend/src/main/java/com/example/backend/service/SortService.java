package com.example.backend.service;

import com.example.backend.model.SortResult;
import com.example.backend.model.SortStep;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class SortService {

    public SortResult bubbleSort(int[] inputArray) {
        long startTime = System.currentTimeMillis();
        List<SortStep> steps = new ArrayList<>();

        // Convert input array to List for easier handling in steps
        List<Integer> array = new ArrayList<>();
        for (int i : inputArray)
            array.add(i);

        int n = array.size();
        List<Integer> sortedIndices = new ArrayList<>();

        // Initial step
        steps.add(SortStep.builder()
                .array(new ArrayList<>(array))
                .comparing(List.of())
                .swapping(false)
                .sorted(new ArrayList<>(sortedIndices))
                .description("Starting Bubble Sort. Array size: " + n)
                .build());

        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                // Comparison step
                steps.add(SortStep.builder()
                        .array(new ArrayList<>(array))
                        .comparing(List.of(j, j + 1))
                        .swapping(false)
                        .sorted(new ArrayList<>(sortedIndices))
                        .description("Comparing " + array.get(j) + " and " + array.get(j + 1))
                        .build());

                if (array.get(j) > array.get(j + 1)) {
                    // Swap logic
                    int temp = array.get(j);
                    array.set(j, array.get(j + 1));
                    array.set(j + 1, temp);
                    swapped = true;

                    // Swap step
                    steps.add(SortStep.builder()
                            .array(new ArrayList<>(array))
                            .comparing(List.of(j, j + 1))
                            .swapping(true)
                            .sorted(new ArrayList<>(sortedIndices))
                            .description("Swapping " + array.get(j + 1) + " and " + array.get(j)) // Note: values
                                                                                                  // swapped in
                                                                                                  // description context
                            .build());
                } else {
                    // No swap step (optional, but good for visualization)
                }
            }
            // Mark end of pass sorted index
            sortedIndices.add(n - 1 - i);

            steps.add(SortStep.builder()
                    .array(new ArrayList<>(array))
                    .comparing(List.of())
                    .swapping(false)
                    .sorted(new ArrayList<>(sortedIndices))
                    .description("Pass " + (i + 1) + " complete. Element " + array.get(n - 1 - i) + " is sorted.")
                    .build());

            if (!swapped) {
                // Optimization: Mark all remaining as sorted
                for (int k = 0; k < n - 1 - i; k++) {
                    if (!sortedIndices.contains(k))
                        sortedIndices.add(k);
                }
                break;
            }
        }

        // Ensure all are marked sorted
        if (sortedIndices.size() < n) {
            for (int k = 0; k < n; k++) {
                if (!sortedIndices.contains(k))
                    sortedIndices.add(k);
            }
        }

        // Final step
        steps.add(SortStep.builder()
                .array(new ArrayList<>(array))
                .comparing(List.of())
                .swapping(false)
                .sorted(new ArrayList<>(sortedIndices))
                .description("Sorting complete!")
                .build());

        return SortResult.builder()
                .steps(steps)
                .timeTakenMs(System.currentTimeMillis() - startTime)
                .algorithm("Bubble Sort")
                .build();
    }
}
