package com.quiz.api.user.infrastructure.initializer;

import com.quiz.api.user.application.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DefaultAdminInitializer implements ApplicationRunner {
    private final UserService users;

    @Override
    public void run(ApplicationArguments args) {
        users.ensureDefaultAdmin();
    }
}
