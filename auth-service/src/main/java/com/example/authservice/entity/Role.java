package com.example.authservice.entity;

import com.example.authservice.enums.RoleName;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role extends BaseEntity{
    @Enumerated(EnumType.STRING)
    @Column(name = "name",nullable = false,unique = true,length = 50)
    private RoleName name;

    @Column(name = "description", length = 150)
    private String description;

    public Role(){

    }

    public Role(RoleName name){
        this.name = name;
    }
}
