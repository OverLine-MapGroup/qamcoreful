package com.qamcore.backend.checkin.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import com.qamcore.backend.common.exception.InternalServerErrorException;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Getter
@Slf4j
public class CheckInConfig {
    private String currentVersion;
    private int thresholdMedium;
    private int thresholdRed;

    private List<Question> questions;
    private Map<String, Question> questionMap;

    private final ObjectMapper objectMapper;

    public CheckInConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("surveys/default-checkin.json");
            SurveyDefinition definition = objectMapper.readValue(resource.getInputStream(), SurveyDefinition.class);

            this.currentVersion = definition.getVersion();
            this.thresholdMedium = definition.getThresholdMedium();
            this.thresholdRed = definition.getThresholdRed();
            this.questions = definition.getQuestions();

            this.questionMap = questions.stream()
                    .collect(Collectors.toMap(Question::getId, Function.identity()));

            log.info("CheckIn configuration loaded: version={}, questions={}", currentVersion, questions.size());

        } catch (IOException e) {
            InternalServerErrorException ex = new InternalServerErrorException("error.checkin.config.load.failed");
            ex.initCause(e);
            throw ex;
        }
    }

    @Data
    private static class SurveyDefinition {
        private String version;
        private int thresholdMedium;
        private int thresholdRed;
        private List<Question> questions;
    }

    @Data
    public static class Question {
        private String id;
        private String text;
        private String type;
        private int min;
        private int max;
        private int weight;
        private boolean isCritical;
    }
}