package com.quiz.api.security;

import com.quiz.api.user.application.UserService;
import com.quiz.api.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SpringSecurityUserDetailsService implements UserDetailsService {
    private final UserService users;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = users.getByEmail(email);
        return toUserDetails(user);
    }

    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        return toUserDetails(users.getById(id));
    }

    private UserDetails toUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPassword()).roles(user.getRole().name()).build();
    }
}
