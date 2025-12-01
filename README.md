# Snippet Manager

A modern and intuitive application for organizing your code snippets, notes, and links. Built with React, TypeScript, and Zustand, this tool helps you keep your valuable information easily accessible and well-categorized.

## Features

*   **Snippet Management**: Create, edit, delete, and pin various types of snippets.
*   **Multiple Snippet Types**: Supports text, code, markdown, and link snippets.
*   **Code Editor**: Integrated CodeMirror editor for code snippets with syntax highlighting.
*   **Markdown Preview**: Live preview for markdown content.
*   **Categorization**: Organize snippets into nested categories for better structure.
*   **Tagging System**: Assign custom tags with distinct colors to snippets for quick filtering.
*   **Search Functionality**: Efficiently search through your snippets by title, content, tags, and categories.
*   **Persistent Storage**: Your data is automatically saved locally using Zustand's persistence middleware.
*   **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
*   **Responsive Design**: Optimized for various screen sizes with a collapsible sidebar.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
*   **Zustand**: A small, fast, and scalable bear-bones state-management solution.
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
    (Replace `<your-repository-url>` with the actual URL of your repository.)

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    This will start the development server, and you can view the application in your browser, usually at `http://localhost:5173`.

## Usage

*   **Create a New Snippet**: Click the "New Snippet" button in the header to open the form. You can choose the snippet type (Text, Code, Markdown, Link), assign it to a category, and add tags.
*   **Organize Categories**: Use the sidebar to manage your categories. You can add new categories, nest them, and edit or delete existing ones.
*   **Manage Tags**: Add new tags from the snippet form or the sidebar. Tags can be assigned colors and used to filter your snippets.
*   **Filter Snippets**: Select a category or tag from the sidebar to filter the displayed snippets. You can clear filters using the "Clear filters" button.
*   **Search**: Use the search icon in the header to open the search modal. You can search by keywords and apply tag/category filters.
*   **Pin Snippets**: Click the star icon on a snippet card to pin it. Pinned snippets appear in a dedicated section in the sidebar for quick access.
*   **Toggle View Mode**: Switch between grid and list view for snippets using the icon in the header.
*   **Dark Mode**: Toggle dark mode on/off using the sun/moon icon in the header.

## Project Structure

The project follows a standard React application structure:

*   `src/components`: Contains all reusable UI components (e.g., `Header`, `Sidebar`, `SnippetCard`).
*   `src/store`: Houses the Zustand stores (`appStore`, `categoryStore`, `snippetStore`, `tagStore`) for managing application state.
*   `src/types`: Defines TypeScript interfaces for data structures used throughout the application.
*   `src/utils`: Utility functions for common tasks like ID generation, date formatting, and text manipulation.
*   `src/App.tsx`: The main application component.
*   `src/main.tsx`: Entry point for the React application.
*   `src/index.css`: Main CSS file, importing Tailwind CSS.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please feel free to open an issue or submit a pull request.

