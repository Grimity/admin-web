import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminLayout } from '@/components/AdminLayout/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { FeedListPage } from '@/pages/FeedListPage/FeedListPage';
import { FeedDetailPage } from '@/pages/FeedDetailPage/FeedDetailPage';
import { FeedCommentListPage } from '@/pages/FeedCommentListPage/FeedCommentListPage';
import { PostListPage } from '@/pages/PostListPage/PostListPage';
import { PostDetailPage } from '@/pages/PostDetailPage/PostDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Navigate to="/feeds" replace />} />
              <Route path="/feeds" element={<FeedListPage />} />
              <Route path="/feeds/:id" element={<FeedDetailPage />} />
              <Route path="/feed-comments" element={<FeedCommentListPage />} />
              <Route path="/posts" element={<PostListPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/feeds" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
