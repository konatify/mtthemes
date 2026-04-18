export default async function UseThemeRedirect({ params }: { params: { id: string } }) {
  const targetId = params.id;
  
  const cleanId = targetId.trim();

  const { data, error } = await supabase
    .from('themes')
    .select('link')
    .eq('share_id', cleanId)
    .maybeSingle();

  console.log("DEBUG: Searching for ID:", cleanId);
  console.log("DEBUG: Supabase Result:", data);
  console.log("DEBUG: Supabase Error:", error);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Theme not found. (Tried searching for: {cleanId})</div>;

  redirect(data.link);
}
