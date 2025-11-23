// components/Pagination.tsx
"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

// Функція для створення діапазону сторінок (1, 2, 3, 4, 5, ..., Last)
const generatePagination = (current: number, total: number) => {
  const pages = [];
  const maxPagesToShow = 5;

  // Початкові сторінки
  for (let i = 1; i <= Math.min(total, maxPagesToShow); i++) {
    pages.push(i);
  }

  // Якщо сторінка далеко, додаємо еліпси та кінцеві сторінки
  if (total > maxPagesToShow) {
    if (current > maxPagesToShow - 1 && current < total - 1) {
      // Додаємо еліпси, поточну та сусідні сторінки
      pages.length = maxPagesToShow - 2; // Обрізаємо для вставки
      pages.splice(pages.length - 1, 0, "...");
      pages.splice(pages.length - 1, 0, current - 1, current, current + 1);
    }
    // Додаємо еліпси перед останньою сторінкою
    if (current < total - 1 && !pages.includes("...")) {
      pages.push("...");
    }
    // Гарантуємо, що остання сторінка присутня
    if (!pages.includes(total)) {
      pages.push(total);
    }
  }

  // Видаляємо дублікати та '...' в кінці/початку
  return Array.from(new Set(pages.filter((p) => p !== current))).sort(
    (a, b) =>
      (typeof a === "string" ? -1 : (a as number)) -
      (typeof b === "string" ? -1 : (b as number))
  );
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (typeof pageNumber === "number") {
      params.set("page", pageNumber.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  const PaginationButton = ({
    page,
    isActive,
  }: {
    page: number | string;
    isActive: boolean;
  }) => (
    <Link
      href={typeof page === "number" ? createPageURL(page) : "#"}
      className={`px-3 py-1 mx-1 rounded text-sm font-semibold transition duration-150 ${
        isActive
          ? "bg-red-600 text-white"
          : page === "..."
          ? "text-gray-400 cursor-default"
          : "bg-gray-800 text-white hover:bg-gray-700"
      } ${typeof page !== "number" ? "pointer-events-none" : ""}`}
    >
      {page}
    </Link>
  );

  return (
    <div className="flex justify-center mt-10 p-4">
      <PaginationButton
        page={currentPage > 1 ? currentPage - 1 : 1}
        isActive={false}
      >
        &laquo; Попередня
      </PaginationButton>

      {/* Відображення номерів сторінок */}
      {pages.map((page, index) => {
        const isCurrent = page === currentPage;
        return (
          <PaginationButton key={index} page={page} isActive={isCurrent} />
        );
      })}

      <PaginationButton
        page={currentPage < totalPages ? currentPage + 1 : totalPages}
        isActive={false}
      >
        Наступна &raquo;
      </PaginationButton>
    </div>
  );
}
