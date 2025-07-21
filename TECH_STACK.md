# Dashboard Tech Stack

This document outlines the primary technologies and libraries used in the `dashboard` project.

## Core Framework

*   **[Next.js](https://nextjs.org/)**: The project is built using Next.js, a React framework for production-grade applications. It provides features like server-side rendering, static site generation, and a rich development environment.
*   **[React](https://react.dev/)**: The user interface is built with React, a JavaScript library for building user interfaces.
*   **[TypeScript](https://www.typescriptlang.org/)**: The codebase is written in TypeScript, adding static types to JavaScript to improve code quality and maintainability.

## Styling and UI

*   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapidly building custom designs.
*   **[Radix UI](https://www.radix-ui.com/)**: Provides a set of unstyled, accessible UI components that serve as the foundation for the custom components in the application.
*   **[shadcn/ui](https://ui.shadcn.com/)**: The project appears to use the principles of `shadcn/ui`, given the `components.json` file and the use of Radix UI, Tailwind CSS, and `clsx`/`tailwind-merge`.
*   **[Lucide React](https://lucide.dev/)**: A library of simply beautiful and consistent icons.

## Data Management

*   **[Apollo Client](https://www.apollographql.com/docs/react/)**: Used for fetching data from a GraphQL API and managing state.
*   **[TanStack React Query](https://tanstack.com/query/latest)**: A powerful library for managing, caching, and synchronizing server state in React applications.
*   **[GraphQL](https://graphql.org/)**: The project is configured to consume a GraphQL API.

## Forms and Validation

*   **[React Hook Form](https://react-hook-form.com/)**: A library for building performant and flexible forms in React.
*   **[Zod](https://zod.dev/)**: A TypeScript-first schema declaration and validation library, used with React Hook Form for robust form validation.

## Authentication

*   **[NextAuth.js](https://next-auth.js.org/)**: Handles authentication within the application, providing a flexible and secure way to manage user sessions.

## Charting and Data Visualization

*   **[Recharts](https://recharts.org/)**: A composable charting library built on React components, used for creating charts and graphs.

## Local Dependencies

*   **`@vandelay-labs/schemas`**: The project depends on a local package located in the `../schemas` directory. This likely contains shared data schemas and types (e.g., Zod schemas, TypeScript interfaces) used across different parts of the Vandelay Labs monorepo.
