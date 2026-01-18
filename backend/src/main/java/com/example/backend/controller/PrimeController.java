package com.example.backend.controller;

import com.example.backend.model.PrimeResult;
import com.example.backend.service.PrimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prime")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend access
public class PrimeController {

    private final PrimeService primeService;

    @GetMapping("/check")
    public PrimeResult check(@RequestParam long n) {
        return primeService.checkPrimality(n);
    }
}
