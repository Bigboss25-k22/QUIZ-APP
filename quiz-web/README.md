# Quizboard Web

Next.js App Router frontend for Quiz API. The browser calls `/api/*`; a Next Route Handler forwards those requests to Spring Boot using `API_ORIGIN` at runtime.

## Development

1. Copy `.env.example` to `.env` and set `API_ORIGIN`.
2. Run `npm install` and `npm run dev`.
3. Open `http://localhost:3000`.

## Commands

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run storybook`
- `npm run build-storybook`
- `npm run build`
- `npm run start`

## Frontend architecture

```text
src/
├── app/                 # Next.js routes and page composition
├── features/
│   ├── auth/{api,model,ui}
│   └── quiz/{api,model,ui}
├── ui/
│   ├── tokens/          # Design tokens only
│   ├── components/      # Domain-independent building blocks
│   ├── patterns/        # Reusable UI compositions
│   └── layouts/         # Application shells and navigation
└── lib/                 # Framework-agnostic utilities and HTTP client
```

Atomic Design is used as a composition rule, not as literal `atoms/molecules/organisms` folders. A component stays in its feature when it knows auth or quiz vocabulary. It moves to `ui/components` only when it is domain-independent and has a stable reusable contract. See [`src/ui/README.md`](src/ui/README.md).

### State ownership

- TanStack Query owns remote data, cache, retries, and API mutations.
- Zustand owns client-only session/workflow state; stores are created inside providers for Next.js request isolation.
- React Hook Form owns form state and submission lifecycle.
- Zod is the source of runtime schemas for forms, API responses, and persisted exam drafts.

Do not copy Query data into Zustand or put form values into a global store. Component-local UI state remains regular React state.

## Docker

Build with `docker build -t quiz-web .` and run with `docker run -p 3000:3000 -e API_ORIGIN=http://host.docker.internal:8082 quiz-web`.
