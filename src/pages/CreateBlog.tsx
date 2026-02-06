import { useState } from "react";
import { supabase } from "../services/supabase";
import { uploadImage } from "../services/upload";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";

export default function CreateBlog() {
  const user = useSelector((s: RootState) => s.auth.user);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const publish = async () => {
    if (!user) return alert("Please login first.");
    if (!title.trim() || !content.trim()) return alert("Title and content required.");

    try {
      setLoading(true);

      let image_url: string | null = null;
      if (file) image_url = await uploadImage(file, "blogs");

      const { data, error } = await supabase
        .from("blogs")
        .insert([
          {
            user_id: user.id,
            title,
            content,
            image_url,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      navigate(`/blog/${data.id}`);
    } catch (e: any) {
      alert(e.message ?? "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card-stack" >
        <h1 className="title">Create Blog</h1>

        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="textarea" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />

        <input
          className="input-image"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button className="button" onClick={publish} disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
