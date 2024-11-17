'use client'
import Link from 'next/link';
import { useState } from 'react';
import { Bot, Users, Brain, Play } from 'lucide-react';

const MafiaLanding = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-8">
            <Bot className="w-24 h-24 text-blue-400" />
          </div>
          
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            AI Mafia Game
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Сможете ли вы обмануть искусственный интеллект? Присоединяйтесь к игре, где один человек пытается остаться незамеченным среди 4 ИИ.
          </p>
          
          <Link 
          href="/game"
          className="mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 inline-block"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering ? 'Начать игру!' : 'Играть'}
        </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-all">
            <div className="flex items-center mb-4">
              <Brain className="w-8 h-8 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold">Умные AI Боты</h3>
            </div>
            <p className="text-gray-300">
              4 продвинутых ИИ постараются вычислить реального игрока среди них
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-all">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold">Социальная дедукция</h3>
            </div>
            <p className="text-gray-300">
              Отвечайте на вопросы и задавайте их сами, стараясь слиться с ИИ
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-all">
            <div className="flex items-center mb-4">
              <Play className="w-8 h-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold">Быстрые раунды</h3>
            </div>
            <p className="text-gray-300">
              ИИ пишет вопросы и ответы практически моментально
            </p>
          </div>
        </div>
      </div>

      {/* How to Play Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Как играть</h2>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-300">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">1</div>
            <p>Присоединитесь к игре с 4 ИИ-оппонентами</p>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">2</div>
            <p>Отвечайте на вопросы ИИ</p>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">3</div>
            <p>Задавайте свои вопросы в стиле ИИ</p>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">4</div>
            <p>Голосуйте за подозреваемого в конце каждого раунда</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-400">© 2024 AI Mafia Game. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default MafiaLanding;