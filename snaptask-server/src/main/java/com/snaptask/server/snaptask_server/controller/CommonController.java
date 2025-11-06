package com.snaptask.server.snaptask_server.controller;

import com.snaptask.server.snaptask_server.dto.user.SetLocationDto;
import com.snaptask.server.snaptask_server.service.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/common")
public class CommonController {
    private final UserService userService;
    private CommonController(UserService userService){
        this.userService = userService;
    }
    /*
     * Update the poster’s current location.
     * Example: PUT /poster/profile/location
     */
    @PutMapping("/location")
    public ResponseEntity<?> updateLocation(@Valid @RequestBody SetLocationDto dto) {
        return userService.setLocation(dto);
    }
}
