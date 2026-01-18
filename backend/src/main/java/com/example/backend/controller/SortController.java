package com.example.backend.controller;

import com.example.backend.model.SortResult;
import com.example.backend.service.SortService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sort")
@CrossOrigin(origins = "http://localhost:3000")
public class SortController {

    @Autowired
    private SortService sortService;

    @PostMapping("/bubble")
    public SortResult bubbleSort(@RequestBody int[] array) {
        return sortService.bubbleSort(array);
    }
}
