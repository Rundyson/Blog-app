import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { uploadImage } from "../services/upload";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export default function EditBlog() {
  const { id } = useParams();
  const user = useSelector((s: RootState) => s.auth.user);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("blogs").select("*").eq("id", id).single();
      if (error) return alert(error.message);
      setTitle(data.title);
      setContent(data.content);
      setCurrentImage(data.image_url);
    })();
  }, [id]);

  const save = async () => {
    if (!user) return alert("Login first.");

    try {
      setLoading(true);
      let image_url = currentImage;

      if (file) image_url = await uploadImage(file, "blogs");

      const { error } = await supabase
        .from("blogs")
        .update({ title, content, image_url })
        .eq("id", id);

      if (error) throw error;

      navigate(`/blog/${id}`);
    } catch (e: any) {
      alert(e.message ?? "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="edit-wrapper" >
        <h1 className="title">Edit Blog</h1>

        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} />

        {currentImage && (
          <img src={currentImage} alt="current" />
        )}

        <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

        <button className="button" onClick={save} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
