package org.example.backproject.service;

import org.example.backproject.entity.Users;
import org.example.backproject.repository.UsersRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.userdetails.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsersService implements UserDetailsService {
    private final UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println(">> [ERROR] 사용자 없음: " + email);
                    return new UsernameNotFoundException("사용자 없음: " + email);
                });

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }

    @Transactional
    public void deleteByEmail(String email){
        usersRepository.deleteByEmail(email);
    }
}
