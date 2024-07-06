import { Route, Routes } from "react-router-dom";
import { PostList } from "./components/PostList";
import { Post } from "./components/Post";
import { PostProvider } from "./contexts/PostContext";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route
          path="/posts/:id"
          element={
            <PostProvider>
              <Post />
            </PostProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
