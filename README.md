# DishSwap

DishSwap is a unique recipe-sharing platform designed for food enthusiasts who love to discover, share, and swap their favorite dishes, inspired by anime-style visuals. With a focus on sharing recipes between friends and family, DishSwap aims to build connections through the art of cooking.

Visit the live site: [https://dishswap.vercel.app](https://dishswap.vercel.app)

## How DishSwap is Different

DishSwap stands apart from traditional recipe-sharing platforms by featuring an anime-inspired aesthetic, seasonal challenges, and friend-focused sharing. Users can interact with their friends' recipes and share feedback, providing a more meaningful context and connection than random web recipes.

## Features

- **User Authentication**: Signup, login, and secure profile management with JWT authentication.
- **Recipe Management**: Create, view, edit, and delete your own recipes. Recipes can include images, ingredients, and instructions.
- **Social Interactions**: Comment on recipes, add them to your favorites, and react with custom reactions (Can't Wait, Cooked & Banged, Cooked & Dislike).
- **Profile Viewing**: View other users' profiles and the recipes they have shared.
- **Seasonal Challenges**: Participate in seasonal recipe challenges, featuring ingredients that are in season.
- **Responsive Design**: Optimized for both mobile and desktop experiences.

## Technologies Used

- **Frontend**: Next.js, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express-like API routes within Next.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens) for secure user sessions

## Getting Started

To run this project locally:

1. **Clone the repository**:
   ```
   git clone https://github.com/username/dishswap.git
   ```
2. **Install dependencies**:
   ```
   npm install
   ```
3. **Set up environment variables**: Use the `.env.example` file as a reference to configure your environment.
4. **Run the development server**:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Backend Overview

### API Endpoints

- **User Authentication and Management**:
  - `/api/users` - Handles user registration and login, with password hashing for security.
  - `/api/profile` - Allows users to view and manage their profile details, including their favorite recipes.
- **Recipe and Favorites Management**:
  - `/api/recipes` - Manage recipes (create, retrieve, update, delete). File uploads are managed with `multer`, and image data is stored as Base64 for efficient retrieval.
  - `/api/recipes/[id]` - Fetch specific recipes using the recipe ID.
  - `/api/favorites` - Add or remove recipes from favorites, accessible only by authenticated users.
- **Comments on Recipes**:
  - `/api/comments` - Add and retrieve comments on recipes.

### JWT Authentication

JWTs are used to authenticate and verify user identities, ensuring secure access to profile information, recipe creation, and management.

## Example Workflow

1. **User Registration/Login**: User registers or logs in, and receives a JWT for secure session management.
2. **Recipe Creation**: Create a new recipe using the `/api/recipes` endpoint. Images are handled with `multer`, and the request must include a valid JWT.
3. **Viewing and Interacting with Recipes**: Users can view recipes, add comments, and mark recipes as favorites.

## Error Handling and Security

- **Error Handling**: Comprehensive error handling is implemented for invalid inputs, unauthorized access, and other edge cases.
- **Security**: Passwords are hashed using `bcrypt` and sensitive routes are protected with `verifyToken` middleware for JWT verification.

## Future Enhancements

- **Seasonal Recipe Challenges**: Encourage users to participate in seasonal challenges, showcasing recipes with seasonal ingredients.
- **Top Recipe and Top Chef Boards**: Highlight the most popular recipes and the most active users on leaderboards.
- **Feedback Notifications**: Notify users when someone comments on or reacts to their recipe.
- **Social Sharing**: Allow users to share their favorite recipes directly to social media.

## Contributing

We welcome contributions! Feel free to fork the repository, make changes, and submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

For any inquiries, reach out to David Seibold at [d.seibold@icloud.com](mailto:d.seibold@icloud.com).

Link to Figma Wireframes: [DishSwap Wireframes](https://www.figma.com/design/YUWI7hCgaddAs2AeDXWSY4/DishSwap?m=auto&t=Gsmn6Kx4Fkhn8PeP-6)

---

DishSwap is a platform for connecting through cooking, with a personal touch that makes sharing recipes fun and engaging. Dive in and start swapping today!
