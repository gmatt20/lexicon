import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function deleteAllUsers() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error);
    return;
  }

  for (const user of data.users) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user.id,
    );
    if (deleteError) {
      console.error(`Failed to delete user ${user.email}:`, deleteError);
    } else {
      console.log(`Deleted user: ${user.email}`);
    }
  }
}

deleteAllUsers();
