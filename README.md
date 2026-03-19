# Todo CLI

A Clean Code todo management CLI application built with Deno and TypeScript, following functional programming principles and Clean Architecture.

## Features

- ✅ **Full CRUD Operations**: Add, list, complete, delete, search todos
- 🏷️ **Tag System**: Organize todos with tags, supports tag management (list, rename, delete)
- 📅 **Due Dates**: Natural language parsing (today, tomorrow, next week) and overdue warnings
- 🎨 **Priority Levels**: High, medium, low with color coding
- 📂 **Categories**: Group todos by category
- 🔍 **Search & Filter**: Full-text search with multiple filter options
- 💾 **Persistent Storage**: SQLite database with normalized schema
- 🎯 **Type-Safe**: Built with TypeScript in strict mode

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd todo

# Run directly (Deno will install dependencies automatically)
deno run -A mod.ts --help

# Or install globally (optional)
deno install -A -n todo mod.ts
```

## Usage

### Basic Commands

```bash
# Add a new todo
todo add "Implement user authentication"

# Add with options
todo add "Write API docs" \
  --priority high \
  --category documentation \
  --tags api,docs \
  --due tomorrow

# List all todos
todo list

# List with filters
todo list --status pending
todo list --priority high
todo list --category backend
todo list --tag urgent
todo list --overdue

# Show todo details
todo show 1

# Complete a todo
todo complete 1

# Delete a todo
todo delete 1

# Search todos
todo search "authentication"
todo search "bug" --priority high
```

### Tag Management

```bash
# List all tags with usage counts
todo tags

# Rename a tag globally
todo tags rename urgent high-priority

# Delete a tag from all todos
todo tags delete obsolete
```

### Command Aliases

- `list` → `ls`
- `complete` → `done`
- `delete` → `rm`
- `search` → `find`

### Options Reference

**Add Command:**
- `--description, -d`: Detailed description
- `--priority, -p`: Priority level (high, medium, low)
- `--category, -c`: Category name
- `--due`: Due date (YYYY-MM-DD, today, tomorrow, next week)
- `--tags, -t`: Comma-separated tags

**List/Search Commands:**
- `--status, -s`: Filter by status (pending, completed, cancelled)
- `--priority, -p`: Filter by priority
- `--category, -c`: Filter by category
- `--tag, -t`: Filter by tag
- `--overdue`: Show only overdue todos

## Architecture

### Layers

1. **Domain Layer** (`src/domain/`): Pure business logic and entities
   - Value objects with validation (TodoId, Priority, Tag, etc.)
   - Todo entity with state transitions
   - Repository interface

2. **Application Layer** (`src/application/`): Use cases and DTOs
   - Use case functions (addTodo, listTodos, etc.)
   - Data transfer objects

3. **Infrastructure Layer** (`src/infrastructure/`): External concerns
   - SQLite database implementation
   - CLI formatters and utilities

4. **Presentation Layer** (`src/presentation/`): User interface
   - Command handlers
   - Cliffy CLI integration

### Key Principles

- **Functional Programming**: Pure functions, immutable data, no classes
- **Function Declarations**: Use `function` keyword over arrow functions
- **Railway-Oriented Programming**: Result type for error handling
- **No Exceptions**: All errors handled via Result types in domain/application
- **Type Safety**: TypeScript strict mode with branded types

### Database Schema

```sql
-- Main todos table
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
  status TEXT CHECK(status IN ('pending', 'completed', 'cancelled')),
  category TEXT,
  due_date TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

-- Normalized tags table
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,           -- lowercase for lookups
  display_name TEXT NOT NULL           -- original casing
);

-- Many-to-many junction table
CREATE TABLE todo_tags (
  todo_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (todo_id, tag_id),
  FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## Development

```bash
# Run the application
deno task start

# Run with custom database location
DATABASE_PATH=/custom/path/todos.db deno run -A mod.ts list

# Format code
deno task fmt

# Lint code
deno task lint

# Type check
deno task check
```

### Project Structure

```
src/
├── shared/              # Shared utilities (Result type, errors, parsers)
├── domain/              # Domain layer (entities, value objects)
│   ├── repository.ts    # Repository interface
│   └── types/           # Value objects (Todo, Tag, Priority, etc.)
├── application/         # Application layer (use cases, DTOs)
│   ├── dtos/
│   └── usecases/
├── infrastructure/      # Infrastructure layer
│   ├── database/        # SQLite implementation
│   └── cli/             # CLI formatters
└── presentation/        # Presentation layer
    └── commands/        # Command handlers
```

### Database Location

By default, the database is stored at `~/.todo-cli/todos.db`

## Examples

```bash
# Morning routine
todo list --overdue
todo list --status pending --priority high

# Create a new feature todo
todo add "Add export functionality" \
  --priority medium \
  --category feature \
  --tags export,enhancement \
  --due "next week" \
  --description "Allow users to export todos to JSON/CSV formats"

# Review todos by tag
todo list --tag bugfix
todo tags

# Clean up completed todos
todo list --status completed
todo delete 5

# Rename a commonly used tag
todo tags rename bug bugfix

# Search for specific work
todo search "authentication" --category backend
```

## Technical Details

- **Runtime**: Deno 2.x
- **Language**: TypeScript (strict mode)
- **Database**: SQLite via `@db/sqlite`
- **CLI Framework**: Cliffy
- **Architecture**: Clean Architecture with functional programming
- **Error Handling**: Railway-oriented programming with Result types

## Status

✅ **Complete** - All features implemented and tested

## License

MIT
