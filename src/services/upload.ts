import { supabase } from "./supabase";


function getFileText(name: string) {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop()!.toLowerCase() : "png";
}

export async function uploadImage(file: File, folder: "blogs" | "comments") {
    const ext = getFileText(file.name);
    const filename = `${folder}/${crypto.randomUUID()}.${ext}`;

    const {error: uploadError } = await supabase.storage
    .from("blog-images")
    .upload(filename, file, {upsert: false});

    if (uploadError) throw uploadError;

    const {data} = supabase.storage.from("blog-images").getPublicUrl(filename);
    return data.publicUrl;
}