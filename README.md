# RC-CUSTOME Repository

## Project Preview
![testTask](https://github.com/user-attachments/assets/99fc0f21-198c-44e0-ad5d-8f5bb35e0da8)


## Overview

The `RECUSTOME` repository houses two separate projects:

1. **Backend Project (rc-custome-be)**: A NestJS-based application for managing backend operations.
2. **Frontend Project (rc-custome-fe)**: A React-based application for the frontend interface.

## Folder Structure

-   **`rc-custome-be/`**: Contains the backend service.
-   **`rc-custome-fe/`**: Contains the frontend application.

## Prerequisites

Ensure the following tools are installed:

-   Node.js (>= 16.x)
-   npm or yarn

## Backend (`rc-custome-be`)

### Scripts

The `package.json` includes several scripts to streamline development:

| Script        | Description                           |
| ------------- | ------------------------------------- |
| `build`       | Builds the application using NestJS.  |
| `start`       | Starts the application.               |
| `start:dev`   | Starts the application in watch mode. |
| `start:debug` | Starts the application in debug mode. |
| `start:prod`  | Starts the production build.          |
| `lint`        | Lints the codebase using ESLint.      |

### Installation

1. Navigate to the `rc-custome-be` folder:
    ```bash
    cd rc-custome-be
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Config .env file:
    ```bash
    add .env file with related credentials
    ```

### Running the Application

-   **Development Mode**:

    ```bash
    npm run start:dev
    ```

-   **Production Mode**:

    ```bash
    npm run start:prod
    ```

## Frontend (`rc-custome-fe`)

### Scripts

The `package.json` includes several scripts to streamline development:

| Script    | Description                            |
| --------- | -------------------------------------- |
| `dev`     | Starts the development server.         |
| `build`   | Builds the application for production. |
| `preview` | Previews the production build.         |
| `lint`    | Lints the codebase using ESLint.       |
| `test`    | Runs unit tests using Vitest.          |

### Installation

1. Navigate to the `rc-custome-fe` folder:
    ```bash
    cd rc-custome-fe
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Config .env file:
    ```bash
    add .env file with related credentials
    ```

### Running the Application

-   **Development Mode**:

    ```bash
    npm run dev
    ```

-   **Build for Production**:

    ```bash
    npm run build
    ```

-   **Preview Production Build**:

    ```bash
    npm run preview
    ```

-   **Testing**:
    ```bash
    npm run test
    ```

## Common Commands

-   **Install All Dependencies**:
    Run this command from the root directory to install dependencies for both projects:
    ```bash
    npm install --workspaces
    ```

## Contributing

Feel free to submit issues or pull requests. Ensure that:

-   Code is formatted using Prettier.
-   ESLint checks are passed.
