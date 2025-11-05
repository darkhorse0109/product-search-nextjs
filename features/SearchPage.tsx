'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import LoadingIndicator from '@/components/loading-indicator'
import PlatformProducts from '@/components/platform-products'
import TopProducts from '@/components/top-products'
import useProducts from '@/hooks/use-products'
import { type ProductResponse, DEFAULT_PRODUCT_RESPONSE } from '@/types/Product.d'

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const { data, isLoading } = useProducts(searchKeyword, DEFAULT_PRODUCT_RESPONSE)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchInputRef.current?.value.trim()
    if (query) {
      setSearchKeyword(query) // This will trigger a new search through useProducts
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoadingIndicator />
      </div>
    )
  }

  const jan_code = data?.jan_code
  const amazon_products = data?.amazon_products || []
  const yahoo_products = data?.yahoo_products || []
  const rakuten_products = data?.rakuten_products || []

  const allProducts = [
    ...amazon_products,
    ...yahoo_products,
    ...rakuten_products,
  ]

  const cheapestProducts = allProducts
    .sort((a, b) => a.price - b.price)
    .slice(0, 3)

  return (
    <div className="flex flex-col grow bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
      <div className="flex flex-col grow">
        <div className="flex flex-col grow space-y-6">
          <form onSubmit={handleSearch} className="flex items-center gap-4 w-full">
            <div className="flex-1">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="型番や商品名を入力（例: 4518340264816やEA628W-25B）"
                defaultValue={searchKeyword}
                className="rounded-sm px-3 py-5 overflow-hidden whitespace-nowrap text-ellipsis"
              />
            </div>
            <Button type="submit"
              className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-none text-white px-8"
            >
              検索
            </Button>
          </form>

          {jan_code && (
            <>
              <p className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white p-4 rounded shadow-sm">
                <span className="font-mono text bg-gradient-to-r from-m-purple to-m-blue bg-clip-text text-transparent font-semibold tracking-wide">
                  JAN Code:
                </span>
                <span className="font-mono text bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent font-medium tracking-wider">
                  <span className="font-bold">{jan_code}</span>を使用して検索しました
                </span>
              </p>
              <TopProducts products={cheapestProducts} />
              <PlatformProducts
                amazon_products={amazon_products}
                yahoo_products={yahoo_products}
                rakuten_products={rakuten_products}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage