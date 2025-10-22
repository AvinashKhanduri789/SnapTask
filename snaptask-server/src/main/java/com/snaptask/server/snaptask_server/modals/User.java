package com.snaptask.server.snaptask_server.modals;

import com.snaptask.server.snaptask_server.enums.UserRole;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Represents a registered user in the SnapTask platform.
 *
 * Optimized for:
 * - Fast lookup by email/phone
 * - Efficient geospatial queries (2dsphere index)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
@CompoundIndex(def = "{'role': 1, 'workplace': 1}")
public class User implements UserDetails {

    @Id
    private String id;

    @Field("name")
    private String name;

    @Indexed(unique = true)
    @Field("email")
    private String email;

    @Indexed(unique = true, sparse = true)
    @Field("phone")
    private String phone;

    @Field("password")
    @Size(min = 8, message = "Password length should be minimum 8")
    private String password;

    @Field("verificationCode")
    private String verificationCode;

    @Field("verificationCodeExpireTime")
    private java.time.Instant verificationCodeExpireTime;

    @Field("isEnable")
    private boolean enable;

    @Field("workplace")
    private String workplace;

    @Field("skills")
    private List<String> skills;

    @Field("address")
    private String address;

    /**
     * Store the exact geographic coordinates as GeoJSON Point.
     * 2dsphere index allows efficient $near and radius queries.
     */
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    @Field("geo_location")
    private GeoJsonPoint geoJsonPoint;

    @Field("bio")
    private String bio;

    @Field("role")
    private UserRole role;

    @Field("rating")
    @Builder.Default
    private double rating = 0.0;

    @CreatedDate
    @Field("join_date")
    @Builder.Default
    private LocalDateTime joinDate = LocalDateTime.now();

    @LastModifiedDate
    @Field("updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Field("roleId")
    private String roleId;

    // --- UserDetails methods ---
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enable;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.name());
        return List.of(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }
}
