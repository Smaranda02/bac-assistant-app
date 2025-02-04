import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";

const components: { title: string; href: string }[] = [
  {
    title: "Matematică",
    href: "/1/content"
  },
  {
    title: "Informatică",
    href: "/2/content"
  }
]

export default function AppNavigationMenu() {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild active={true}>
            <Link href="/">
              Pagină principală
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Materii</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-4">
              {components.map((component) => (
                <li
                  key={component.title}
                >
                <NavigationMenuLink asChild>
                  <a
                    className={
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    }
                    href={component.href}
                  >
                    <div className="text-sm font-medium leading-none">{component.title}</div>
                  </a>
                </NavigationMenuLink>
              </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
