package com.example.backend.service;

import com.example.backend.model.PrimeResult;
import com.example.backend.model.PrimeStep;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PrimeService {

    public PrimeResult checkPrimality(long n) {
        long startTime = System.currentTimeMillis();
        List<PrimeStep> steps = new ArrayList<>();

        if (n < 2) {
            steps.add(PrimeStep.builder()
                    .divisor(0)
                    .expression("n < 2")
                    .result(String.valueOf(n))
                    .isMatch(false)
                    .status("Not Prime (Less than 2)")
                    .build());
            return buildResult(n, false, steps, startTime);
        }

        if (n == 2) {
            steps.add(PrimeStep.builder()
                    .divisor(2)
                    .expression("n == 2")
                    .result("true")
                    .isMatch(true)
                    .status("Prime (Even Prime)")
                    .build());
            return buildResult(n, true, steps, startTime);
        }

        if (n % 2 == 0) {
            steps.add(PrimeStep.builder()
                    .divisor(2)
                    .expression(n + " % 2 == 0")
                    .result("0")
                    .isMatch(true)
                    .status("Found Divisor (Even)")
                    .build());
            return buildResult(n, false, steps, startTime);
        }

        // Add initial step explaining the algorithm
        steps.add(PrimeStep.builder()
                .divisor(0)
                .expression("Start: Check if " + n + " is prime")
                .result("√" + n + " ≈ " + (long) Math.sqrt(n))
                .isMatch(false)
                .status("Algorithm: Test divisors from 2 to √" + n)
                .build());

        if (n % 2 == 0) {
            steps.add(PrimeStep.builder()
                    .divisor(2)
                    .expression(n + " % 2")
                    .result("0")
                    .isMatch(true)
                    .status("Found Divisor (Even)")
                    .build());
            return buildResult(n, false, steps, startTime);
        }

        steps.add(PrimeStep.builder()
                .divisor(2)
                .expression(n + " % 2")
                .result(String.valueOf(n % 2))
                .isMatch(false)
                .status("Not divisible by 2 (Odd number)")
                .build());

        long limit = (long) Math.sqrt(n);
        boolean isPrime = true;

        for (long i = 3; i <= limit; i += 2) {
            long remainder = n % i;
            boolean match = (remainder == 0);

            steps.add(PrimeStep.builder()
                    .divisor(i)
                    .expression(n + " % " + i)
                    .result(String.valueOf(remainder))
                    .isMatch(match)
                    .status(match ? "Found Divisor - Not Prime!" : "Not divisible by " + i)
                    .build());

            if (match) {
                isPrime = false;
                break;
            }

            // Limit steps for very large numbers to avoid UI lag
            if (steps.size() > 100) {
                steps.add(PrimeStep.builder()
                        .divisor(i)
                        .expression("...")
                        .result("...")
                        .isMatch(false)
                        .status("Steps limited for visualization")
                        .build());
                break;
            }
        }

        // Add final summary step
        if (isPrime) {
            steps.add(PrimeStep.builder()
                    .divisor(0)
                    .expression("Checked all divisors up to √" + n)
                    .result("No divisors found")
                    .isMatch(false)
                    .status("Conclusion: " + n + " is PRIME")
                    .build());
        }

        return buildResult(n, isPrime, steps, startTime);
    }

    private PrimeResult buildResult(long n, boolean isPrime, List<PrimeStep> steps, long startTime) {
        return PrimeResult.builder()
                .number(n)
                .isPrime(isPrime)
                .steps(steps)
                .timeTakenMs(System.currentTimeMillis() - startTime)
                .message(isPrime ? n + " is a prime number." : n + " is not a prime number.")
                .build();
    }
}
