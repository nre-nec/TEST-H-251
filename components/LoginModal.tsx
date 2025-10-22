import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CORRECT_PASSWORD = '202030305';

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      onSuccess();
    } else {
      setError('كلمة المرور غير صحيحة. حاول مرة أخرى.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-sm w-full transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">الوصول مطلوب</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          هذه المنطقة محمية. يرجى إدخال كلمة المرور للمتابعة.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ادخل كلمة المرور هنا"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;