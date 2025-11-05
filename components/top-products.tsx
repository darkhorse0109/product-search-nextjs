import Image from 'next/image'
import Link from 'next/link'
import { type Product } from '@/types/Product'

interface TopProductsProps {
  products: Product[];
}

const tableHeaders = ['ランキング', '商品画像', 'ショップ', '商品名', '価格（税込）', 'リンク']

const TopProducts = ({ products }: TopProductsProps) => {
  return (
    <div className="relative p-5 sm:p-8 bg-gray-100 rounded-xl shadow-[5px_5px_15px_#d1d1d1,-5px_-5px_15px_#ffffff]">
      <h2 className="text-3xl font-bold mb-8 text-gray-700 tracking-wide bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent text-center">
        価格比較
      </h2>
      <div className="text-sm text-gray-500 mb-8 space-y-1 pl-4 border-l-4 border-gray-200">
        <p>※ 経時情報からECサイトの最安値商品を表示しています。</p>
        <p>※ APIを通して取得できないデータは除外されています。</p>
      </div>

      <div className="bg-gray-100 rounded-lg overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-7 p-4 rounded-t-xl bg-white">
            {tableHeaders.map((header, i) => (
              <div key={i} className={`${i === 3 ? 'col-span-2' : 'col-span-1'} text-gray-600 font-bold text-center`}>
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
                  className="grid grid-cols-7 p-6 transition-all duration-300
                           bg-gray-50 hover:bg-white first:rounded-t-none last:rounded-b-xl"
                >
                  {/* Rest of the component remains the same */}
                  <div className="col-span-1 flex items-center justify-center">
                    {index === 0 ? (
                      <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 
                                     text-amber-800 px-4 py-2 rounded-lg text-base font-bold
                                     border-2 border-amber-500 shadow-lg shadow-amber-200/50
                                     flex items-center gap-2">
                        <span>🥇</span>
                        <span>1位</span>
                      </span>
                    ) : index === 1 ? (
                      <span className="bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300
                                     text-gray-700 px-4 py-2 rounded-lg text-base font-bold
                                     border-2 border-gray-400 shadow-lg shadow-gray-200/50
                                     flex items-center gap-2">
                        <span>🥈</span>
                        <span>2位</span>
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700
                                     text-amber-100 px-4 py-2 rounded-lg text-base font-bold
                                     border-2 border-amber-800 shadow-lg shadow-amber-200/50
                                     flex items-center gap-2">
                        <span>🥉</span>
                        <span>3位</span>
                      </span>
                    )}
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <div className="relative w-20 h-20 rounded overflow-hidden bg-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    {product.platform === 'Yahooショッピング' ? (
                      <span className="px-3 py-2 rounded bg-green-50 text-green-700
                                     border border-green-200">
                        {product.platform}
                      </span>
                    ) : product.platform === '楽天市場' ? (
                      <span className="px-3 py-2 rounded bg-orange-50 text-orange-700
                                     border border-orange-200">
                        {product.platform}
                      </span>
                    ) : (
                      <span className="px-3 py-2 rounded bg-blue-50 text-blue-700
                                     border border-blue-200">
                        {product.platform}
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
  )
}

export default TopProducts