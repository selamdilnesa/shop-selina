"use client";

import { useState } from "react";

type Product = {
  id: number;
  title: string;
};

type ProductSearchProps = {
  products: Product[];
  onSearch: (filteredProducts: Product[]) => void;
};

export default function ProductSearch({
  products,
  onSearch,
}: ProductSearchProps) {
  const [searchTitle, setSearchTitle] = useState("");

  function handleSearch(value: string) {
    setSearchTitle(value);

    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );

    onSearch(filtered);
  }

  return (
    <div className="my-8">
      <input
        type="text"
        value={searchTitle}
        onChange={(event) => handleSearch(event.target.value)}
        placeholder="Search products by title on shop selina..."
        aria-label="Search products by title on shop selina ..."
        className="w-full rounded-full border border-[#e8dfd2] bg-white px-5 py-3 text-sm text-[#402b20] outline-none transition placeholder:text-[#a79587] focus:border-[#b18a50] dark:border-[#49372b] dark:bg-[#30231d] dark:text-[#faf7f2] dark:placeholder-[#c4b4a7]/60 dark:focus:border-[#c6a16b] sm:max-w-md"
      />
    </div>
  );
}