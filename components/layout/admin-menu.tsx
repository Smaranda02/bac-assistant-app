"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItems = Array<{
  label: string;
  link: string;
}>

type Props = {
  items: MenuItems
}

export default function AdminMenu({ items }: Props) {
  const pathname = usePathname();
  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {items.map(({label, link}, index) => (
          <li key={`item-${index}`} className="me-2">
            <Link
              href={link}
              className={
                pathname.startsWith(link) ?
                "inline-block p-4 border-b-2 text-black border-black rounded-t-lg active dark:text-black dark:border-black" :
                "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
