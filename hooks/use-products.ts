import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  type ProductResponse,
  DEFAULT_PRODUCT_RESPONSE,
} from '@/types/Product.d'

function useProducts(keyword: string, defaultValue: ProductResponse) {
  const queryKey = useMemo(() => ['product', keyword], [keyword])

  return useQuery<ProductResponse>({
    queryKey,
    queryFn: async () => {
      try {
        if (!keyword) {
          return DEFAULT_PRODUCT_RESPONSE
        }
        
        const { data: products} = await axios.post<ProductResponse>('/api/search', {
          keyword,
        })

        return products.jan_code ? products : defaultValue
      } catch (error) {
        console.error('Product search error:', error)
        return defaultValue
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export default useProducts
