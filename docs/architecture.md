# Architecture Documentation

## Project Overview

**Spatium** is a Discord bot management platform built with Next.js 15, utilizing Convex as the backend database and real-time infrastructure, with Clerk for authentication. The project follows a monorepo structure with pnpm as the package manager.

## Current Architecture

### Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4.x with custom UI components
- **Authentication**: Clerk (with deprecation warnings)
- **Database**: Convex (real-time database)
- **Package Manager**: pnpm with workspace configuration
- **TypeScript**: Full TypeScript support
- **UI Components**: Radix UI with custom shadcn/ui components

### Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages with dynamic routes
│   │   ├── pricing/           # Pricing page
│   │   └── servers/           # Server management pages
│   ├── components/            # React components
│   │   ├── Clerk/            # Clerk authentication components
│   │   ├── app/              # Main app components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── theme/            # Theme provider and toggle
│   │   └── ui/               # Reusable UI components (shadcn/ui)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and configs
│   └── middleware.ts         # Next.js middleware
├── convex/                   # Convex backend functions
│   ├── _generated/           # Auto-generated types and APIs
│   ├── auth.config.ts        # Authentication configuration
│   ├── schema.ts             # Database schema
│   ├── users.ts              # User-related functions
│   ├── discord.ts            # Discord API integration
│   └── cron.ts               # Scheduled functions
├── public/                   # Static assets
│   └── fonts/                # Custom fonts (Minecraft-Regular)
└── docs/                     # Documentation
```

### Database Schema

The Convex schema includes the following main entities:

1. **users**: User management with Clerk and Discord integration
2. **discordServers**: Discord server information and metadata
3. **serverMetrics**: Time-series data for server analytics
4. **botCommands**: Command usage tracking
5. **serverSettings**: Per-server configuration
6. **alerts**: System alerts and notifications

### Key Features

- **Dashboard**: Server management interface with dynamic routing
- **Discord Integration**: OAuth flow and API interaction
- **Real-time Updates**: Convex provides real-time database updates
- **Theme Support**: Dark/light mode with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Current Pain Points

### 1. Deprecated Dependencies

**Severity: High**

- `@clerk/clerk-sdk-node@5.1.6` is deprecated (EOL January 10, 2025)
- Migration to `@clerk/express` or alternative needed
- Potential breaking changes in authentication flow

### 2. Code Style Inconsistencies

**Severity: Medium**

- No consistent code formatting across the codebase
- Mixed quote styles and inconsistent spacing
- No automated formatting enforcement
- ESLint configuration is minimal

### 3. Type Safety Issues

**Severity: Medium**

- Missing explicit return types for some functions
- Inconsistent use of TypeScript features
- No strict TypeScript configuration for newer features

### 4. Monorepo Configuration

**Severity: Low**

- pnpm workspace configuration is minimal
- No shared configuration for tools across potential packages
- Limited workspace optimization

### 5. Build and Development Experience

**Severity: Low**

- No pre-commit hooks for code quality
- Limited npm scripts for development workflow
- No automated dependency updates

### 6. Documentation Gaps

**Severity: Medium**

- Limited inline documentation
- No component documentation
- Missing API documentation for Convex functions

## Recommended Improvements

### Immediate Actions

1. **Migrate from deprecated Clerk SDK**
   - Update to latest Clerk packages
   - Test authentication flows
   - Update integration patterns

2. **Implement consistent code formatting**
   - ✅ Add Prettier configuration
   - ✅ Configure ESLint with TypeScript rules
   - ✅ Add formatting scripts to package.json

3. **Enhance TypeScript configuration**
   - Enable stricter type checking
   - Add explicit return types where needed
   - Improve type safety across the codebase

### Medium-term Improvements

1. **Enhanced monorepo setup**
   - Consider splitting into packages if needed
   - Shared configuration for tools
   - Dependency management optimization

2. **Development workflow enhancements**
   - Pre-commit hooks with husky
   - Automated testing setup
   - CI/CD pipeline configuration

3. **Documentation improvements**
   - Component documentation with Storybook
   - API documentation for Convex functions
   - Setup and deployment guides

### Long-term Considerations

1. **Performance optimization**
   - Bundle analysis and optimization
   - Image optimization
   - Caching strategies

2. **Monitoring and observability**
   - Error tracking integration
   - Performance monitoring
   - User analytics

3. **Security enhancements**
   - Security headers configuration
   - Dependency vulnerability scanning
   - API rate limiting

## Development Guidelines

### Code Style

- Use Prettier for consistent formatting
- Follow ESLint rules for code quality
- Prefer functional components and hooks
- Use TypeScript for all new code

### Component Organization

- Place reusable UI components in `src/components/ui/`
- Feature-specific components in respective feature folders
- Use proper TypeScript interfaces for props

### Convex Functions

- Organize functions by feature/domain
- Use proper error handling
- Document function parameters and return types
- Follow Convex best practices for queries and mutations

## Conclusion

The current architecture provides a solid foundation for a Discord bot management platform. The main areas for improvement focus on code quality, consistency, and developer experience. The implemented Prettier and ESLint configuration addresses immediate formatting concerns, while the identified pain points provide a roadmap for future improvements.

The project benefits from modern tools and frameworks, but would benefit from more rigorous development practices and better documentation to support team collaboration and maintainability.
