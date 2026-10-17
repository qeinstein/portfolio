import { HomePage } from "@/src/pages/home-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function App() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <HomePage />
      <SiteFooter />
    </div>
  );
}

export default App;
