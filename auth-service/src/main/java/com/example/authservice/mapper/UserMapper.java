package com.example.authservice.mapper;

import com.example.authservice.dto.response.UserResponse;
import com.example.authservice.entity.Role;
import com.example.authservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", source = "roles", qualifiedByName = "mapRoles")
    UserResponse toResponse(User user);

    @Named("mapRoles")
    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
    }
}