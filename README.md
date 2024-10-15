# DishSwap

DishSwap is a recipe sharing platform where food enthusiasts can discover, share, and swap their favorite recipes with others around the world.

Visit the live site: [https://dishswap.vercel.app](https://dishswap.vercel.app)

## Features

- User authentication (signup, login, profile management)
- Browse and search recipes
- Filter recipes by cuisine, difficulty, and cooking time
- View detailed recipe information including ingredients and instructions
- Add recipes to favorites
- Comment on recipes
- React to recipes (Can't Wait, Cooked & Banged, Cooked & Dislike)
- Submit new recipes
- Responsive design for mobile and desktop

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Framer Motion

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Routes

- `/api/recipes`: Get all recipes, add new recipe
- `/api/recipes/[id]`: Get specific recipe
- `/api/recipes/user`: Get user's recipes
- `/api/users`: User authentication
- `/api/comments`: Get and add comments
- `/api/favorites`: Manage favorite recipes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the (LICENSE).

## Contact

For any inquiries, please reach out to David Seibold at d.seibold@icloud.com.

Link to Figma Wireframes: https://www.figma.com/design/YUWI7hCgaddAs2AeDXWSY4/DishSwap?m=auto&t=Gsmn6Kx4Fkhn8PeP-6
