import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="layout-wrap">
      <Header />
      <div style={{ width: "min(fit-content, 80%)", margin: "0 auto" }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
