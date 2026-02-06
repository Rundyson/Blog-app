import { Link } from "react-router-dom";

export default function BlogCard({ blog }: any) {
  return (
    <div className="blog-card">
      {blog.image_url && (
        <img
          src={blog.image_url}
          alt="blog"
          style={{ width: "100%", borderRadius: 10, marginBottom: 10 }}
        />
      )}
      <h2 className="bc-title title">{blog.title}</h2>
      <p className="bc-content title">{blog.content.slice(0, 100)}...</p>
      <Link to={`/blog/${blog.id}`} className="bc-id">
        Read More
      </Link>
    </div>
  );
}
