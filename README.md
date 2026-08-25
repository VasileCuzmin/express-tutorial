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
npm install -D typescript tsx nodemon @types/express @types/node
```

Create the source directory and a TypeScript configuration file:

```bash
mkdir src
npx tsc --init
```

Add scripts for development, compiling, and running the compiled application:

```bash
npm pkg set scripts.dev="tsx watch src/index.ts"
npm pkg set scripts.start:dev="nodemon --watch src --ext ts --exec tsx src/index.ts"
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

## npm dependency basics

`package.json` records the packages the project needs, while `package-lock.json` records the exact resolved versions installed for reproducible installs. Commit both files, but do not commit `node_modules`; npm recreates that directory from the package files.

### Dependencies and dev dependencies

Packages under `dependencies` are needed when the application runs in production. This project lists `express` and `dotenv` there because the compiled API imports them at runtime.

Packages under `devDependencies` are only needed to develop, build, test, or type-check the project. This includes `typescript`, `tsx`, `nodemon`, and the `@types/*` packages. A normal `npm install` installs both groups. Production deployments can skip development tools with:

```bash
npm install --omit=dev
```

Use these commands to add or remove packages:

```bash
# Add a runtime dependency.
npm install express

# Add a development-only dependency. -D is short for --save-dev.
npm install -D nodemon

# Install a specific version.
npm install express@5.2.1

# Remove a dependency and update package.json and package-lock.json.
npm uninstall nodemon
```

### Version ranges

Package versions use semantic versioning in the form `major.minor.patch`. In `"express": "^5.2.1"`, the caret (`^`) permits compatible updates from `5.2.1` up to, but not including, `6.0.0`. It can therefore accept patch releases, such as `5.2.2`, and minor releases, such as `5.3.0`, while avoiding a new major version that may contain breaking changes.

`npm install` follows the exact versions recorded in `package-lock.json` when that file is present. To intentionally update packages within their allowed ranges, run:

```bash
npm update
```

Use `npm outdated` to see installed, wanted, and latest versions before updating. A version without a prefix, such as `"express": "5.2.1"`, pins that exact version. A tilde range, `~5.2.1`, permits patch updates only, from `5.2.1` up to, but not including, `5.3.0`.

### Update compatible packages

Use `npm update` for routine dependency maintenance when you want the newest patch and minor versions already allowed by the ranges in `package.json`. For example, `"express": "^5.2.1"` can update to a newer `5.x.x` version, but not to `6.0.0`. npm records the resolved update in `package-lock.json`; the version range in `package.json` usually does not need to change.

Check available updates, apply compatible updates, then verify the application:

```bash
npm outdated
npm update
npm run build
```

To update one package instead of every compatible dependency, provide its name:

```bash
npm update express
```

Use `npm update` after reviewing the `Wanted` versions from `npm outdated`, for routine bug and compatible security fixes, or in a dedicated dependency-maintenance change. Review and commit the resulting `package-lock.json` update after the build and tests pass.

`npm update` does not adopt a new major version. Upgrade a major version intentionally with `npm install` so `package.json` changes, then review the package release notes and test for breaking changes:

```bash
npm install express@6
```

### Clean unused packages with npm prune

`npm prune` removes extraneous packages from `node_modules`: packages that are installed locally but are no longer declared in `package.json` or required by a declared dependency. It is useful after switching branches or manually changing dependency files. It changes `node_modules`, not `package.json`.

Preview the packages that would be removed before making changes:

```bash
npm prune --dry-run
```

Remove the unused packages:

```bash
npm prune
```

For a production deployment, remove development dependencies after the application has been built:

```bash
npm ci
npm run build
npm prune --omit=dev
node dist/index.js
```

`npm ci` installs the exact dependency versions from `package-lock.json`. The `--omit=dev` option removes development tools such as `typescript`, `tsx`, and `nodemon`, while retaining runtime packages such as `express` and `dotenv`.

## Run in development

The development server uses `tsx` to execute TypeScript directly and restart when files change:

```bash
npm run dev
```

The API listens on `http://localhost:3000` by default.

## Use nodemon in development

`nodemon` monitors files for changes and restarts a command when a watched file changes. It is useful when you want to control which files trigger restarts or use a command other than `tsx watch`.

Install it as a development dependency:

```bash
npm install -D nodemon
```

Configure an npm script that watches TypeScript files in `src` and runs the application with `tsx`:

```bash
npm pkg set scripts.start:dev="nodemon --watch src --ext ts --exec tsx src/index.ts"
```

Run the nodemon-based development server:

```bash
npm run start:dev
```

The `--watch src` option limits watching to source files, `--ext ts` restarts only for TypeScript changes, and `--exec tsx src/index.ts` tells nodemon how to run the TypeScript entry point. Use either `npm run dev` or `npm run start:dev`; both restart the API after source changes.

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
| `npm run start:dev` | Watches `src` with `nodemon` and runs `src/index.ts` through `tsx`. |
| `npm start` | Runs the package start script. For the current build layout, use `node dist/index.js` after `npm run build`. |