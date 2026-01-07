import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Search, 
  FlaskConical, 
  BarChart3, 
  Database,
  Settings,
  HelpCircle,
  Dna
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Search", href: "/search", icon: Search },
  { name: "Prediction", href: "/predict", icon: FlaskConical },
  { name: "Model Comparison", href: "/models", icon: BarChart3 },
  { name: "Data Explorer", href: "/data", icon: Database },
];

const secondaryNav = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Dna className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">BioInsight</h1>
            <p className="text-xs text-muted-foreground">Lite Edition</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Main
          </p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="border-t border-sidebar-border px-3 py-4">
          <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Support
          </p>
          {secondaryNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">ChEMBL v36</span>
              <br />
              500 compounds loaded
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
