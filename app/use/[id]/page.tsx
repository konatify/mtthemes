export default async function UseThemeRedirect({ params }: { params: { id: string } }) {
  const cleanId = params.id.trim();

  const { data, error } = await supabase
    .from('themes')
    .select('link')
    .eq('share_id', cleanId)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    return <div>Error loading theme.</div>;
  }

  if (!data) {
    return (
      <div style={{ color: 'white', padding: '20px' }}>
        <h1>Theme not found</h1>
        <p>We searched for ID: <strong>{cleanId}</strong></p>
        <p>Please check the database to ensure this share_id exists exactly as shown.</p>
      </div>
    );
  }

  redirect(data.link);
}
