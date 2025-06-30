import EcommerceHero from "../components/EcommerceHero";
import ProductGrid from "../features/product/Product";
import AIChatWidget from "../features/support/AIChatWidget";

export default function HomePage() {

  return (
    <div>
      <EcommerceHero />
      <AIChatWidget />
      <h1 className="text-4xl text-center p-2 pb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">
        Trending Now 🔥
      </h1>
      <ProductGrid />
      <br />
      <br />
    </div>
  );
}
