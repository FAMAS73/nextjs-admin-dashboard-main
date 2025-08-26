# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **ACC Web Server Manager** built on the NextAdmin template - a Next.js admin dashboard for managing Assetto Corsa Competizione (ACC) dedicated servers. The application provides a web-based interface to replace manual JSON configuration file editing, with live server monitoring and community features.

### Key Technologies
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** with custom design system
- **React 19** with Server Components
- **ApexCharts** for data visualization
- **NextAuth** for Steam authentication (planned)
- **Supabase** for database and auth (planned)
- **next-themes** for dark/light mode support

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Dashboard home with server overview
│   ├── auth/              # Authentication pages
│   ├── calendar/          # Server schedule management
│   ├── charts/            # Analytics and telemetry
│   ├── forms/             # Server configuration forms
│   ├── pages/settings/    # Application settings
│   ├── profile/           # User profile management
│   ├── tables/            # Data tables (results, leaderboards)
│   └── ui-elements/       # UI component demos
├── components/
│   ├── Auth/              # Authentication components
│   ├── Charts/            # ApexCharts wrapper components
│   ├── FormElements/      # Server configuration form inputs
│   ├── Layouts/           # Header, sidebar, and layout components
│   └── Tables/            # Data table components with API integration
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── services/              # API services and data fetching
└── types/                 # TypeScript type definitions
```

### Core Components Architecture

**Layout System:**
- `src/app/layout.tsx` - Root layout with sidebar and header
- `src/components/Layouts/sidebar/` - Collapsible sidebar with navigation
- `src/components/Layouts/header/` - Top header with user info and theme toggle

**Data Flow:**
- Server Components for initial data fetching
- API integration with loading skeletons in tables and charts
- Search params used for dropdown selections and data refetching
- Mock data services in `src/services/charts.services.ts`

**Theme System:**
- Custom Tailwind configuration with extensive color palette
- Dark/light mode support via next-themes
- Satoshi font family with custom CSS

## Key Features Being Built

Based on the SRS documentation (`doc/SRS.md`), this application will include:

1. **Server Configuration Interface** - Web UI for ACC server JSON config files
2. **Live Server Monitoring** - Real-time server logs and timing data
3. **User Authentication** - Steam OAuth integration via Supabase
4. **Driver Statistics** - ELO rankings and race history
5. **Community Features** - Media uploads and leaderboards

### ACC Server Configuration Files
The application manages these ACC server configuration files:
- `configuration.json` - Network settings (TCP/UDP ports, lobby registration)
- `settings.json` - Server rules, passwords, car restrictions
- `event.json` - Track, weather, session configuration
- `eventRules.json` - Pit stop rules and stint requirements
- `assistRules.json` - Driving assist restrictions
- `entrylist.json` - Driver registration and car assignments

## Development Guidelines

### Code Patterns
- Use Server Components by default, Client Components when needed
- Implement loading states with skeleton components
- Follow existing component structure in `components/` directory
- Use TypeScript strictly with proper type definitions
- Implement responsive design with Tailwind breakpoints

### Styling Conventions
- Use Tailwind CSS classes exclusively
- Follow the custom spacing and color system defined in `tailwind.config.ts`
- Support both light and dark themes
- Use semantic class names for better maintainability

### Form Development
- Build configuration forms using components in `FormElements/`
- Map form inputs to ACC server configuration parameters per SRS specifications
- Implement form validation for server configuration constraints
- Support import/export of JSON configuration files

### Data Integration
- Use API routes for server communication
- Implement loading skeletons for async operations
- Handle error states gracefully
- Support real-time updates via WebSockets (planned)

## Current State

This is a dashboard template being adapted for ACC server management. The basic UI structure is complete with navigation, theming, and component library. The ACC-specific functionality needs to be implemented according to the Software Requirements Specification in `doc/SRS.md`.