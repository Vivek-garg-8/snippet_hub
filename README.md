# Snippet Manager

A modern and intuitive application for organizing your code snippets, notes, and links. Built with React, TypeScript, and Supabase, this tool helps you keep your valuable information easily accessible, well-categorized, and synced across devices.

## Features

*   **Authentication**: Secure user authentication powered by Supabase.
*   **Cloud Storage**: Your data is safely stored in the cloud using Supabase, ensuring access from anywhere.
*   **Snippet Management**: Create, edit, delete, and pin various types of snippets.
*   **Multiple Snippet Types**: Supports text, code, markdown, and link snippets.
*   **Code Editor**: Integrated CodeMirror editor for code snippets with syntax highlighting.
*   **Markdown Preview**: Live preview for markdown content.
*   **Categorization**: Organize snippets into nested categories for better structure.
*   **Tagging System**: Assign custom tags with distinct colors to snippets for quick filtering.
*   **Search Functionality**: Efficiently search through your snippets by title, content, tags, and categories.
*   **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
*   **Responsive Design**: Optimized for various screen sizes with a collapsible sidebar.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **Zustand**: A small, fast, and scalable bear-bones state-management solution.
*   **Supabase**: The open source Firebase alternative for database and authentication.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **CodeMirror**: A versatile text editor implemented in JavaScript for the browser.
*   **Lucide React**: A collection of beautiful and customizable open-source icons.
*   **Vite**: A fast build tool that provides an extremely fast development experience.

## Installation

To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone <your-repository-url>
    cd snippet-manager
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**:
    *   Go to your Supabase project dashboard.
    *   Open the SQL Editor.
    *   Copy the contents of `supabase/snippets.sql` and run it to set up the necessary tables and policies.

5.  **Run the development server**:
    ```bash
    npm run dev
    ```
    This will start the development server, usually at `http://localhost:5173`.

## Usage

*   **Sign Up/Login**: Create an account or log in to access your personal snippets.
*   **Create a New Snippet**: Click the "New Snippet" button in the header to open the form. Choose the type (Text, Code, Markdown, Link), assign a category, and add tags.
*   **Organize Categories**: Use the sidebar to manage your categories. You can add new categories, nest them, and edit or delete existing ones.
*   **Manage Tags**: Add new tags from the snippet form or the sidebar. Tags can be assigned colors and used to filter your snippets.
*   **Filter Snippets**: Select a category or tag from the sidebar to filter the displayed snippets.
*   **Search**: Use the search icon in the header to open the search modal.
*   **Pin Snippets**: Click the star icon on a snippet card to pin it for quick access.
*   **Dark Mode**: Toggle dark mode using the sun/moon icon in the header.

## Project Structure

*   `src/components`: Reusable UI components.
*   `src/store`: Zustand stores (`authStore`, `snippetStore`, etc.) for state management.
*   `src/lib`: Configuration files (e.g., `supabase.ts`).
*   `src/types`: TypeScript interfaces.
*   `src/utils`: Utility functions.
*   `supabase`: SQL scripts for database setup.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
