# Express TypeScript Tutorial

A small Express API written in TypeScript. It demonstrates route handlers, request logging middleware, environment configuration, and basic in-memory user and product endpoints.

## Prerequisites

- Node.js 20 or later
- npm 10 or later

Check the installed versions:

```bash
node --version
npm --version
```

## Create the project from scratch

Create a directory, initialize an npm package, and configure it for ESM:

```bash
mkdir express-tutorial
cd express-tutorial
npm init -y
npm pkg set type=module
```

Install the runtime dependencies and TypeScript development tools:

```bash
npm install express dotenv
npm install -D typescript tsx @types/express @types/node
```

Create the source directory and a TypeScript configuration file:

```bash
mkdir src
npx tsc --init
```

Add scripts for development, compiling, and running the compiled application:

```bash
npm pkg set scripts.dev="tsx watch src/index.ts"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
```

Update the generated `tsconfig.json` with the settings described in [TypeScript configuration](#typescript-configuration). Create `src/index.ts`, then start the server with `npm run dev`.

## Generate `.gitignore`

Generate a Node.js `.gitignore` template with `gitignore-cli`:

```bash
npx gitignore node
```

Add these project-specific entries to the generated `.gitignore` so local environment values and build output are not committed:

```gitignore
# Environment variables
.env
.env.*
!.env.example

# TypeScript build output
dist/
```

Alternatively, create `.gitignore` yourself with the complete minimal contents below:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
npm-debug.log*
```

## Install dependencies

From the project root, install the dependencies declared in `package.json`:

```bash
npm install
```

## Run in development

The development server uses `tsx` to execute TypeScript directly and restart when files change:

```bash
npm run dev
```

The API listens on `http://localhost:3000` by default.

## Configure the port

The application loads environment variables with `dotenv`. Create a `.env` file in the project root to override the default port:

```dotenv
PORT=4000
```

Then start the development server again. The API will be available at `http://localhost:4000`.

## TypeScript configuration

The project configuration is in `tsconfig.json`.

| Setting | Purpose |
| --- | --- |
| `rootDir: "./src"` | Treats `src` as the TypeScript source directory. |
| `outDir: "./dist"` | Writes compiled JavaScript and generated type files to `dist`. |
| `module: "nodenext"` | Uses Node.js ESM module rules. |
| `target: "esnext"` | Targets current JavaScript features supported by modern Node.js. |
| `strict: true` | Enables strict TypeScript type checking. |
| `declaration: true` | Generates `.d.ts` declaration files during builds. |
| `sourceMap: true` | Generates source maps for debugging compiled code. |

Because `package.json` includes `"type": "module"` and TypeScript uses `nodenext`, local TypeScript imports must use the JavaScript extension:

```ts
import { loggingMiddleware } from './middlewares.js';
```

TypeScript resolves that import to `src/middlewares.ts` while developing, and Node.js resolves it to `dist/middlewares.js` after compilation.

## Build and run compiled code

Compile the project:

```bash
npm run build
```

This produces the application under `dist`. Run the compiled server with:

```bash
node dist/index.js
```

## Project structure

```text
src/
  index.ts        Express app, routes, and in-memory data
  middlewares.ts  Request logging middleware
  types.ts        User, Product, and query TypeScript interfaces
tsconfig.json     TypeScript compiler configuration
package.json      Dependencies and npm scripts
```

## API endpoints

All data is stored in memory, so it is reset whenever the server restarts.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Returns `Hello, World!`. |
| `GET` | `/api/users` | Returns all users. |
| `GET` | `/api/users?filter=name&value=jane` | Filters users by a field and partial value. |
| `GET` | `/api/users/:userId` | Returns one user by numeric ID. |
| `POST` | `/api/users` | Creates a user. |
| `PUT` | `/api/users/:userId` | Replaces the user's `name`, `email`, and `password` fields. |
| `PATCH` | `/api/users/:userId` | Updates one or more user fields. |
| `DELETE` | `/api/users/:userId` | Deletes a user. |
| `GET` | `/api/products` | Returns all products. |

Create a user:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alex Doe\",\"email\":\"alex@example.com\",\"password\":\"example-password\"}"
```

## Available npm scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the TypeScript server in watch mode using `tsx`. |
| `npm run build` | Compiles TypeScript from `src` into `dist`. |
| `npm run start:dev` | Starts `nodemon` with `index.js`; this script requires a root-level `index.js` and is not used by the current TypeScript source layout. |
| `npm start` | Runs the package start script. For the current build layout, use `node dist/index.js` after `npm run build`. |