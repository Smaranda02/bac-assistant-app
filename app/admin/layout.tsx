import AdminMenu from "@/components/layout/admin-menu";

const adminMenu = [
  {label: "Panou de control", link: "/admin/dashboard"},
  {label: "Conținut", link: "/admin/content"},
  {label: "Utilizatori", link: "/admin/users"}
]

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminMenu items={adminMenu}/>
      <div className="m-2">
        {children}
      </div>
    </>
  );
}
