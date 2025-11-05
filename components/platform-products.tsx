import Image from 'next/image'
import Link from 'next/link'
import { type Product } from '@/types/Product'

interface PlatformProductsProps {
  amazon_products: Product[];
  yahoo_products: Product[];
  rakuten_products: Product[];
}

const tableHeaders = ['商品画像', 'ショップ', '商品名', '価格（税込）', 'リンク']

const PlatformProducts = ({ amazon_products, yahoo_products, rakuten_products }: PlatformProductsProps) => {
  return (
    <div className="relative p-5 sm:p-8 bg-gray-100 rounded-xl shadow-[5px_5px_15px_#d1d1d1,-5px_-5px_15px_#ffffff]">
      <h2 className="text-3xl font-bold mb-8 text-gray-700 tracking-wide bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent text-center">
        プラットフォーム別商品比較
      </h2>

      {[
        { title: 'Amazon商品一覧', products: amazon_products, platform: 'Amazon' },
        { title: 'Yahooショッピング商品一覧', products: yahoo_products, platform: 'Yahooショッピング' },
        { title: '楽天市場商品一覧', products: rakuten_products, platform: '楽天市場' }
      ].map(({ title, products, platform }) => (
        <div key={platform} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
          <div className="bg-gray-100 rounded-lg overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-6 p-4 rounded-t-xl bg-white">
                {tableHeaders.map((header, i) => (
                  <div key={i} className={`${i === 2 ? 'col-span-2' : 'col-span-1'} text-gray-600 font-bold text-center`}>
                    {header}
                  </div>
                ))}
              </div>

              <div className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <div className="p-8 bg-gray-50 rounded-b-xl">
                    <p className="text-center text-gray-600 font-medium">
                      ただいま表示できるデータがありません。
                    </p>
                  </div>
                ) : (
                  products.map((product, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 p-6 transition-all duration-300
                               bg-gray-50 hover:bg-white first:rounded-t-none last:rounded-b-xl"
                    >
                      <div className="col-span-1 flex items-center justify-center">
                        <div className="relative w-20 h-20 rounded overflow-hidden bg-white">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Image
                              src="/no-image.png"
                              alt="NO-IMAGE"
                              fill
                              className="absolute object-cover"
                            />
                          )}
                        </div>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        {platform === 'Yahooショッピング' ? (
                          <span className="px-3 py-2 rounded bg-green-50 text-green-700
                                         border border-green-200">
                            {platform}
                          </span>
                        ) : platform === '楽天市場' ? (
                          <span className="px-3 py-2 rounded bg-orange-50 text-orange-700
                                         border border-orange-200">
                            {platform}
                          </span>
                        ) : (
                          <span className="px-3 py-2 rounded bg-blue-50 text-blue-700
                                         border border-blue-200">
                            {platform}
                          </span>
                        )}
                      </div>

                      <div className="col-span-2 flex items-center justify-center">
                        <span className="text-sm text-gray-600 line-clamp-2 px-4 py-2 rounded
                                       bg-white border border-gray-100 text-center">
                          {product.name}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        <span className="text-lg font-bold bg-gradient-to-r from-m-purple to-m-blue 
                                       bg-clip-text text-transparent">
                          ¥{product.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        <Link
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-3 rounded text-sm font-medium
                                   bg-gradient-to-r from-m-purple to-m-blue
                                   text-white transition-all duration-300
                                   transform hover:scale-105
                                   text-center"
                        >
                          商品を見る
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlatformProducts