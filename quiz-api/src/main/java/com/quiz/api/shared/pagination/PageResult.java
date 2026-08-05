package com.quiz.api.shared.pagination;

import java.util.List;

public record PageResult<T>(List<T> content, int page, int size, long totalElements, int totalPages, boolean last) {
}
