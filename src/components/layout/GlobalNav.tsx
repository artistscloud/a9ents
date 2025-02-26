
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function GlobalNav() {
  const navigate = useNavigate();
  
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="/placeholder.svg" 
              alt="Logo" 
              className="h-8 w-auto"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
