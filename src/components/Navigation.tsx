import { signOut } from "next-auth/react";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="mb-2 flex h-min space-x-8">
      <NavItem type="link" href="/" text="Spy" />
      <NavItem type="link" href="/sessions" text="Events" />
      <NavItem type="button" onClick={signOut} text="Sign out" />
    </nav>
  );
};

type NavLink = {
  type: "link";
  href: string;
};

type NavButton = {
  type: "button";
  onClick: () => void;
};

type NavItem = (NavLink | NavButton) & { text: string };

const NavItem: React.FC<NavItem> = (props) => {
  const className =
    "text-xl transition-colors hover:text-gray-500 focus:text-gray-500";

  return props.type === "link" ? (
    <Link href={props.href}>
      <a className={className}>{props.text}</a>
    </Link>
  ) : (
    <button onClick={props.onClick} className={className}>
      {props.text}
    </button>
  );
};

export default Navigation;
