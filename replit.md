# Inner World - Digital Therapeutic Platform

## Overview

Inner World is a digital therapeutic platform designed for emotional and sensory registration for neurodivergent children and adolescents. The platform provides a safe, interactive environment where young users can express their emotions through multiple modalities including avatars, emotional registries, group chats, and digital containment tools. Built with Next.js and React, it features both individual and group therapy modes with facilitator oversight.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15.2.4 with React Server Components and TypeScript
- **Styling**: Tailwind CSS with custom design system based on OPCIÓN brand colors
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React hooks with local component state management
- **Font System**: Geist Sans and Geist Mono fonts

### Component Structure
- **Modular Components**: Each major feature is isolated into its own component (avatar editor, emotional registration, group chat, facilitator dashboard, etc.)
- **Reusable UI**: Standardized UI components in `/components/ui/` directory
- **Feature Components**: Specialized components for core platform features in `/components/` directory

### Design System
- **Brand Colors**: Custom OPCIÓN color palette (orange, yellow, blue, pink, gray)
- **Theming**: Light/dark mode support with CSS custom properties
- **Animations**: Custom fade-in and slide-up animations for smooth user experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

### Application State Management
- **Multi-State App**: Single-page application with state-based navigation between different views
- **User Roles**: Separate interfaces for NNA (children/adolescents) and facilitators
- **Session Management**: Individual and group therapy session modes
- **Data Flow**: Props-based data passing between components

### Core Features Architecture
- **Avatar System**: Customizable avatars with progression and unlockable content
- **Emotional Registration**: Multi-modal input (text, voice, images) with guided and free-form options
- **Group Communication**: Real-time chat with moderation and privacy controls
- **Digital Containment**: Therapeutic tools for emotional regulation (breathing exercises, calming activities)
- **Analytics**: AI-powered reporting and emotional pattern recognition
- **Data Logging**: Comprehensive activity tracking and export capabilities

### Security and Privacy
- **User Authentication**: Alias-based login system for privacy protection
- **Role-Based Access**: Different permission levels for participants vs facilitators
- **Data Protection**: Comprehensive logging with export controls for therapeutic oversight

## External Dependencies

### Core Framework Dependencies
- **Next.js**: React framework for production-ready applications
- **React**: UI library with hooks and server components
- **TypeScript**: Type safety and enhanced development experience

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Component variant management
- **clsx**: Conditional className utility

### Form and Data Handling
- **React Hook Form**: Form state management and validation
- **Hookform Resolvers**: Form validation resolvers

### Additional Features
- **date-fns**: Date manipulation and formatting
- **Embla Carousel**: Carousel component for interactive elements
- **input-otp**: OTP input components
- **cmdk**: Command palette functionality

### Analytics and Monitoring
- **Vercel Analytics**: Performance and usage analytics

### Development Dependencies
- **Autoprefixer**: CSS vendor prefixing
- **Geist Font**: Typography system

### Deployment Platform
- **Vercel**: Hosting and deployment platform with automatic builds
- **v0.app Integration**: Synchronized development workflow with v0.app for rapid prototyping

The platform is designed to be extensible, with clear separation between therapeutic features and administrative tools, ensuring both user safety and facilitator effectiveness in digital therapy sessions.