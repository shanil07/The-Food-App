package com.foodapp.backend.repository;

import org.springframework.data.repository.CrudRepository;

import com.foodapp.backend.pojo.User;

import java.util.Optional;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> findByEmail (String email);
}
