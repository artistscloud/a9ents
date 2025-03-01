
import { Link } from "react-router-dom";

export function NavLinks() {
  return (
    <div className="flex items-center gap-8">
      <Link to="/" className="text-xl font-bold">
        Home
      </Link>
      <Link to="/about" className="text-muted-foreground hover:text-foreground">
        About
      </Link>
      <Link to="/features" className="text-muted-foreground hover:text-foreground">
        Features
      </Link>
      <Link to="/use-cases" className="text-muted-foreground hover:text-foreground">
        Use Cases
      </Link>
      <Link to="/contact" className="text-muted-foreground hover:text-foreground">
        Contact
      </Link>
    </div>
  );
}
