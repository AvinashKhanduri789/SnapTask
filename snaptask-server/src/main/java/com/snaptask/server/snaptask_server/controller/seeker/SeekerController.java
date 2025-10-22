package com.snaptask.server.snaptask_server.controller.seeker;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seeker")
public class SeekerController {

    @GetMapping("/health")
    public String healthCheck(){
        return "working...";
    }
}
