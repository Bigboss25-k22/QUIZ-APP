# UI architecture rules

This directory is the reusable visual layer of Quizboard. Atomic Design describes how components compose; folder names describe ownership and dependency boundaries.

## Placement

- `tokens`: color, typography, spacing, radius, and elevation values. No React code.
- `components`: small domain-independent controls such as `Button`, `FormField`, and `Surface`.
- `patterns`: reusable compositions such as `PageHeader`, `SearchField`, and `MetricCard`.
- `layouts`: product shells and navigation structures shared by multiple routes.
- `features/*/ui`: components that know domain terms or workflows such as quiz answers, results, authentication, or account state.

## Import direction

```text
app → features → ui → lib
app ───────────→ ui → lib
```

`ui` must not import from `features`. A route `page.tsx` should compose feature or UI components and avoid owning request, mutation, timer, or form state.

## Component contract

- Prefer named exports and typed props.
- Keep client boundaries as small as possible.
- Preserve native HTML semantics before adding ARIA.
- Support `className` where layout composition needs it.
- Avoid boolean-prop combinations when a clear variant communicates intent.
- Add a colocated story for reusable visual states and a test for important behavior or accessibility contracts.
