import React, { useState } from 'react'
import PageLayOut from '../layout/PageLayOut'
import { QrCode, Camera, RefreshCw, CheckCircle } from 'lucide-react'
import ReturnManually from '../assets/components/modal/ReturnManually'

const ReturnPage = () => {
  const [returnManually, setReturnManually] = useState(false)
  const handleModalReturn = ()=>{
    setReturnManually((prev)=> !prev)
  }
  return (
    <PageLayOut>
     {returnManually &&  <ReturnManually  onClose={handleModalReturn}/>}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#ffe6ea] rounded-lg">
                <QrCode className="w-8 h-8 text-[#db002f]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Return Equipment</h1>
                <p className="text-gray-600 mt-2">Scan QR code to mark equipment as returned</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scanner Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg inline-flex">
                  <Camera className="w-12 h-12 text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">QR Code Scanner</h2>
                <p className="text-gray-600">Position the QR code within the frame to scan</p>

                {/* Scanner Placeholder */}
                <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Scanner will activate here</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-[#db002f] text-white px-4 py-3 rounded-lg hover:bg-[#b50025] transition-colors">
                    <Camera className="w-5 h-5" />
                    <span>Start Camera</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                    <span>Retry</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions & Info Section */}
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Return Equipment</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ffe6ea] text-[#db002f] rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      1
                    </div>
                    <p className="text-gray-700">Locate the QR code sticker on the equipment</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ffe6ea] text-[#db002f] rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      2
                    </div>
                    <p className="text-gray-700">Position the QR code within the camera view</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ffe6ea] text-[#db002f] rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      3
                    </div>
                    <p className="text-gray-700">Wait for automatic scan confirmation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ffe6ea] text-[#db002f] rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      4
                    </div>
                    <p className="text-gray-700">Confirm return details and submit</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending Returns</span>
                    <span className="font-semibold text-[#db002f]">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Today's Returns</span>
                    <span className="font-semibold text-green-600">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Overdue</span>
                    <span className="font-semibold text-orange-600">3</span>
                  </div>
                </div>
              </div>

              {/* Manual Entry Option */}
              <div className="bg-[#ffe6ea] border border-[#ffbaba] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#a30024] mb-2">Can't Scan?</h3>
                <p className="text-[#a30024] text-sm mb-4">
                  If the QR code is damaged or unavailable, you can manually enter the equipment ID.
                </p>
                <button
                onClick={handleModalReturn}
                className="w-full bg-white text-[#db002f] border border-[#db002f] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Enter Equipment ID Manually
                </button>
              </div>
            </div>
          </div>

          {/* Recent Returns */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Returns</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Laptop Dell XPS 15</p>
                    <p className="text-sm text-gray-500">Returned by John Smith</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Projector Epson 123</p>
                    <p className="text-sm text-gray-500">Returned by Sarah Johnson</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">4 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayOut>
  )
}

export default ReturnPage