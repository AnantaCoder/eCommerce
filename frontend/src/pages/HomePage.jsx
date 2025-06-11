import EcommerceHero from "../components/EcommerceHero";
import ProductGrid from "../features/product/Product";

export default function HomePage() {
  return (
    <div>
      <EcommerceHero />
      <h1 className="text-4xl text-center p-2 pb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500">
        Trending Now 🔥
      </h1>
      <ProductGrid />
    </div>
  );
}
