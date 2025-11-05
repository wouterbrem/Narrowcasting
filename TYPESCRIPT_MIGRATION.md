# TypeScript Migration Plan

This document outlines a phased approach to migrating Narrowcast Pro from JavaScript to TypeScript.

## Why TypeScript?

### Benefits
- **Type Safety**: Catch errors at compile time instead of runtime
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation
- **Self-Documenting**: Types serve as inline documentation
- **Maintainability**: Easier to refactor and understand code
- **Fewer Bugs**: Many common errors prevented by type checking

### Costs
- **Learning Curve**: Team needs to learn TypeScript
- **Build Time**: Additional compilation step
- **Migration Effort**: Significant time investment (estimated 20-40 hours)
- **Library Types**: May need to add @types packages

---

## Current Status

- **Language**: 100% JavaScript
- **Files**: ~20 server files, ~10 client files, ~5 Electron files
- **LOC**: Approximately 5,000-7,000 lines

---

## Migration Strategy: Gradual (Recommended)

TypeScript allows `.js` and `.ts` files to coexist, enabling gradual migration.

### Phase 1: Setup (2-3 hours)

#### 1.1 Install TypeScript

```bash
npm install --save-dev typescript @types/node @types/express @types/uuid @types/ws
npm install --save-dev @types/react @types/react-dom @types/react-router-dom
```

#### 1.2 Create tsconfig.json

**For Server:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": false,  // Start lenient, enable gradually
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowJs": true,  // Allow JS files during migration
    "checkJs": false,  // Don't type-check JS files yet
    "noEmit": false
  },
  "include": [
    "server/**/*",
    "electron/**/*"
  ],
  "exclude": [
    "node_modules",
    "client",
    "dist"
  ]
}
```

**For Client (React):**
Client already uses TypeScript support via react-scripts. Create `client/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": false,  // Start lenient
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

#### 1.3 Update package.json Scripts

```json
{
  "scripts": {
    "build:ts": "tsc",
    "watch:ts": "tsc --watch",
    "type-check": "tsc --noEmit"
  }
}
```

---

### Phase 2: Utility Files (3-5 hours)

Start with simple utility files that have few dependencies.

#### Priority Order:
1. ✅ `server/logger.js` → `server/logger.ts`
2. ✅ Constants and config files
3. ✅ Type definitions (create `server/types/`)

**Example: logger.ts**
```typescript
import winston from 'winston';

interface LoggerOptions {
  level?: string;
  format?: winston.Logform.Format;
}

class Logger {
  private logger: winston.Logger;

  constructor(options: LoggerOptions = {}) {
    this.logger = winston.createLogger({
      level: options.level || 'info',
      format: options.format || winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
      ]
    });
  }

  info(message: string, meta?: object): void {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error): void {
    this.logger.error(message, { error });
  }
}

export default Logger;
```

---

### Phase 3: Type Definitions (4-6 hours)

Create shared type definitions before converting main files.

**server/types/index.ts**:
```typescript
export interface Slide {
  id: string;
  name: string;
  type: SlideType;
  duration: number;
  url?: string;
  videoId?: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SlideType =
  | 'webpage'
  | 'youtube'
  | 'weather'
  | 'rss'
  | 'clock'
  | 'image'
  | 'social'
  | 'news'
  | 'html';

export interface Presentation {
  id: string;
  name: string;
  description?: string;
  slides: PresentationSlide[];
  loop: boolean;
  branding?: BrandingConfig;
  createdAt: string;
  updatedAt?: string;
}

export interface PresentationSlide {
  slideId: string;
  duration: number;
  order: number;
}

export interface Device {
  id: string;
  name: string;
  host: string;
  port: number;
  status: DeviceStatus;
  currentContent?: string;
}

export type DeviceStatus = 'idle' | 'casting' | 'error' | 'offline';

export interface BrandingConfig {
  logo?: {
    enabled: boolean;
    url: string | null;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    size: 'small' | 'medium' | 'large';
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  text?: {
    enabled: boolean;
    content: string;
    position: string;
    fontSize: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

---

### Phase 4: Manager Classes (8-12 hours)

Convert core business logic classes, one at a time.

#### Order:
1. ✅ `slide-manager.js` → `slide-manager.ts`
2. ✅ `presentation-manager.js` → `presentation-manager.ts`
3. ✅ `branding-manager.js` → `branding-manager.ts`
4. ✅ `chromecast-manager.js` → `chromecast-manager.ts`
5. ✅ `schedule-manager.js` → `schedule-manager.ts`

**Example: slide-manager.ts**
```typescript
import { v4 as uuidv4 } from 'uuid';
import { Slide, SlideType } from './types';

class SlideManager {
  private slides: Map<string, Slide>;

  constructor() {
    this.slides = new Map();
  }

  createSlide(data: Partial<Slide>): Slide {
    this.validateSlideData(data);

    const slide: Slide = {
      id: uuidv4(),
      name: data.name!,
      type: data.type!,
      duration: data.duration || 60,
      createdAt: new Date().toISOString(),
      ...data
    };

    this.slides.set(slide.id, slide);
    return slide;
  }

  getSlide(id: string): Slide | null {
    return this.slides.get(id) || null;
  }

  getAllSlides(): Slide[] {
    return Array.from(this.slides.values());
  }

  getSlidesByType(type: SlideType): Slide[] {
    return this.getAllSlides().filter(s => s.type === type);
  }

  private validateSlideData(data: Partial<Slide>): void {
    if (!data.name) {
      throw new Error('Slide name is required');
    }
    if (!data.type) {
      throw new Error('Slide type is required');
    }
    // More validation...
  }
}

export default SlideManager;
```

---

### Phase 5: API Routes (5-7 hours)

Convert Express routes with proper typing.

**server/routes/slides.ts**:
```typescript
import { Router, Request, Response } from 'express';
import SlideManager from '../slide-manager';
import { Slide, PaginationParams, PaginatedResponse } from '../types';

const router = Router();
const slideManager = new SlideManager();

// Type-safe request handlers
router.get('/slides', (req: Request, res: Response<Slide[] | PaginatedResponse<Slide>>) => {
  const { page, limit, search } = req.query;

  // Pagination logic with types
  const params: PaginationParams = {
    page: Number(page) || 1,
    limit: Number(limit) || 0
  };

  // Implementation...
});

router.post('/slides', (req: Request<{}, {}, Partial<Slide>>, res: Response<{ success: boolean; slide: Slide }>) => {
  try {
    const slide = slideManager.createSlide(req.body);
    res.json({ success: true, slide });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
```

---

### Phase 6: React Components (6-8 hours)

Convert React components to TypeScript.

**client/src/pages/Slides.tsx**:
```typescript
import React, { useState, useEffect } from 'react';
import { Slide, SlideType } from '../types';
import { slideAPI } from '../services/api';

interface SlidesProps {
  slides: Slide[];
}

const Slides: React.FC<SlidesProps> = ({ slides }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<SlideType | ''>('');

  const handleCreate = async (data: Partial<Slide>): Promise<void> => {
    setLoading(true);
    try {
      await slideAPI.create(data);
    } catch (error) {
      console.error('Failed to create slide:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slides-page">
      {/* Component JSX */}
    </div>
  );
};

export default Slides;
```

---

### Phase 7: Enable Strict Mode (2-3 hours)

After all files are converted, gradually enable strict TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,  // Enable all strict checks
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

Fix all errors revealed by strict mode.

---

## Estimated Timeline

| Phase | Description | Time | Complexity |
|-------|-------------|------|------------|
| 1 | Setup & Configuration | 2-3 hours | Low |
| 2 | Utility Files | 3-5 hours | Low |
| 3 | Type Definitions | 4-6 hours | Medium |
| 4 | Manager Classes | 8-12 hours | High |
| 5 | API Routes | 5-7 hours | Medium |
| 6 | React Components | 6-8 hours | Medium |
| 7 | Strict Mode & Polish | 2-3 hours | Medium |
| **Total** | **Full Migration** | **30-44 hours** | **Medium-High** |

---

## Alternative: JSDoc (Faster, No Migration)

For type safety without full migration, use JSDoc:

```javascript
/**
 * @typedef {Object} Slide
 * @property {string} id
 * @property {string} name
 * @property {'webpage'|'youtube'|'clock'} type
 * @property {number} duration
 */

/**
 * Create a new slide
 * @param {Partial<Slide>} data - Slide data
 * @returns {Slide} Created slide
 */
function createSlide(data) {
  // Implementation
}
```

**Benefits**: Type checking without migration (1-2 hours setup)
**Drawbacks**: Less powerful than TypeScript, no transpilation

---

## Recommendation

**For v2.2.0**: Stay with JavaScript + JSDoc (quick wins)
**For v3.0.0**: Full TypeScript migration (major version allows breaking changes)

---

## Testing Strategy

1. **Unit Tests**: Keep existing Jest tests, add type tests
2. **Integration Tests**: Test API endpoints with typed requests
3. **Type Coverage**: Aim for >90% type coverage
4. **CI/CD**: Add `npm run type-check` to CI pipeline

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Express with TypeScript](https://dev.to/colinross/express-with-typescript-5e3)
- [React with TypeScript](https://react-typescript-cheatsheet.netlify.app/)
- [Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)

---

**Status**: Plan created, not started

**Recommendation**: Defer to v3.0.0, use JSDoc for immediate type safety
