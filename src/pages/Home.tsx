import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { setBlogs } from "../features/blog/blogSlice";
import BlogCard from "../components/BlogCard";

const PAGE_SIZE = 5;

export default function Home() {
  const dispatch = useDispatch();
  const blogs = useSelector((state: RootState) => state.blog.blogs);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      dispatch(setBlogs(data ?? []));
      setHasNext((data?.length ?? 0) === PAGE_SIZE);
      setLoading(false);
    };

    fetchBlogs();
  }, [page, dispatch]);

  return (
    <div className="blog-home">
      {loading && <p>Loading...</p>}
<div className="blog-list">
     {blogs.map((b) => (
        <BlogCard key={b.id} blog={b} />
      ))}
</div>
   

      <div className="buttonPN">
        <button disabled={page === 1 || loading} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>

        <span className="title"> Page {page} </span>

        <button disabled={!hasNext || loading} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
