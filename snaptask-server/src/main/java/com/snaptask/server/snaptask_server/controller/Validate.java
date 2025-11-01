package com.snaptask.server.snaptask_server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Validate {

    @GetMapping("/validateToken")
    public ResponseEntity<String> validate(){
        return ResponseEntity.ok("working...");
    }
}
