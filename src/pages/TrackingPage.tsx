import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

export default function TrackingPage() {
  const { id } = useParams();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Your payment is being processed</p>
        </div>

        <div className="border-t border-b py-4 my-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tracking ID</span>
            <span className="font-mono font-medium">{id}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Payment received</span>
          </div>
          <div className="flex items-center space-x-4 text-blue-600">
            <Clock className="h-5 w-5" />
            <span>Processing payment</span>
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500 text-center">
          You will receive an email confirmation once the payment is processed.
        </p>
      </div>
    </div>
  );
}