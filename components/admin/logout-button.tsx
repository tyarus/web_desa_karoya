import { LogOut } from "lucide-react";

import { logoutAdmin } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAdmin}>
      <Button type="submit" variant="outline" size="sm">
        <LogOut className="size-4" />
        Keluar
      </Button>
    </form>
  );
}
