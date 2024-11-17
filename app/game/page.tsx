'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Users, Vote, Award, Send, ChevronRight } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Player {
  id: number;
  isAI: boolean;
  name: string;
}

interface Message {
  from: number;
  to: number;
  question: string;
  answer: string;
}

export default function Game() {
  const [players] = useState<Player[]>([
    { id: 1, isAI: true, name: 'AI 1' },
    { id: 2, isAI: true, name: 'AI 2' },
    { id: 3, isAI: true, name: 'AI 3' },
    { id: 4, isAI: true, name: 'AI 4' },
    { id: 5, isAI: false, name: 'You' },
  ]);
  const [readyForNextTurn, setReadyForNextTurn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [nextTurn, setNextTurn] = useState(2);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [humanQuestion, setHumanQuestion] = useState('');
  const [isGameActive, setIsGameActive] = useState(true);
  const [voting, setVoting] = useState(false);
  const [aiVotes, setAiVotes] = useState<number[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [gameResult, setGameResult] = useState<string>('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [isHumanAsking, setIsHumanAsking] = useState(false);

  const generateAIQuestion = async () => {
    try {
      const response = await axios.post('/api/chatgpt', {
        prompt: 'Сгенерируй абсолютно рандомный вопрос'
      });
      return response.data.question;
    } catch (error) {
      console.error('Error generating question:', error);
    }
  };

  const getAIAnswer = async (question: string) => {
    try {
      const response = await axios.post('/api/chatgpt', {
        prompt: `Ответь на вопрос: ${question}`
      });
      return response.data.question;
    } catch (error) {
      console.error('Error getting AI answer:', error);
      return 'Based on my analysis, I cannot provide a comprehensive response at this time.';
    }
  };

  const analyzeConversation = async (messages: Message[]) => {
    try {
      const prompt = `Ты являешься игроком в игре, где нужно определить, кто из игроков является человеком.

      ИСТОРИЯ ДИАЛОГОВ:
      ${messages.map(m => `
      Игрок #${m.from} → Игрок #${m.to}
      Вопрос игрока под номером ${m.from}: ${m.question}
      Ответ игрока под номер ${m.to}: ${m.answer}
      ---`).join('\n')}
      
      ХАРАКТЕРИСТИКИ ОТВЕТОВ ИИ:
      1. Структурированность и полнота:
         - Всегда дает исчерпывающие ответы
         - Использует логические связки и аргументацию
         - Следует четкой структуре: вступление, основная часть, заключение
      
      2. Стилистические особенности:
         - Формальный, вежливый тон
         - Избегает сленга и разговорных выражений
         - Редко использует эмоциональные выражения или междометия
         - Практически не использует сарказм или иронию
      
      3. Содержание:
         - Стремится дать фактически верную информацию
         - Избегает преувеличений и необоснованных утверждений
         - Часто приводит примеры или дополнительный контекст
      
      ХАРАКТЕРИСТИКИ ОТВЕТОВ ЧЕЛОВЕКА:
      1. Вариативность:
         - Может давать как короткие, так и длинные ответы
         - Непоследовательность в структуре ответов
         - Может пропускать логические связки
      
      2. Эмоциональность:
         - Использует эмоционально окрашенные слова
         - Может применять сленг или разговорные выражения
         - Использует междометия и восклицания
         - Может быть саркастичным или ироничным
      
      3. Содержание:
         - Может давать субъективные или неточные ответы
         - Опирается на личный опыт
         - Может отклоняться от темы
      
      ПРИМЕР ТИПИЧНОГО ОТВЕТА ИИ:
      Вопрос: "Если бы ты мог выбрать любое животное для участия в соревнованиях по шахматам, какое бы это было животное и почему?"
      Ответ: "Если бы я мог выбрать любое животное для участия в соревнованиях по шахматам, я бы выбрал корову. Хотя коровы не ассоциируются с интеллектуальными играми, они обладают удивительной способностью сосредотачиваться и сохранять спокойствие в стрессовых ситуациях. Их терпеливый и размеренный подход мог бы быть полезен в шахматах, где важна стратегия и умение предугадывать ходы соперника. Кроме того, коровы известны своим дружелюбным характером, что могло бы сделать шахматный турнир более веселым и дружелюбным!"
      
      ПРИМЕР ВОЗМОЖНОГО ОТВЕТА ЧЕЛОВЕКА:
      "Хаха, дельфин конечно! Они умные и могут стукнуть хвостом по доске, если проигрывают 😄 Хотя, если серьезно, наверное осьминог - у него же столько щупалец, можно двигать сразу несколько фигур!"
      
      ЗАДАЧА:
      Проанализируй историю диалогов, обращая внимание на:
      1. Длину и структуру ответов каждого игрока
      2. Наличие эмоциональных выражений и смайликов
      3. Использование разговорных выражений и сленга
      4. Логичность и последовательность ответов
      5. Стиль задаваемых вопросов
      
      На основе этого анализа определи, кто из игроков (1-5) является человеком.
      `;

      const response = await axios.post('/api/chatgpt', {
        prompt: prompt
      });

      return response.data.question;
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return 'Unable to perform analysis';
    }
  };

  const addMessage = (from: number, to: number, question: string, answer: string) => {
    setMessages(prev => [...prev, { from, to, question, answer }]);
  };

  const moveToNextTurn = () => {
    // Если текущий игрок человек (5) и следующий ИИ (1)
    if (currentTurn === 5 && nextTurn === 1) {
      handleRoundEnd(); // Завершаем раунд
      return;
    }
  
    // Если следующий ход человека (5)
    if (nextTurn === 5) {
      setCurrentTurn(5);
      setNextTurn(1);
      setIsHumanAsking(true);
      setIsAnswering(false);
      return;
    }
  
    // Стандартный переход хода между ИИ игроками
    setCurrentTurn(nextTurn);
    setNextTurn(nextTurn === players.length ? 1 : nextTurn + 1);
    setIsAnswering(false);
  };

  const handleRoundEnd = async () => {
    setVoting(true);
    const analysis = await analyzeConversation(messages);
    setAiAnalysis(analysis);
      
    // Generate AI votes using ChatGPT for each AI player
    const votes: number[] = [];
    
    for (let i = 0; i < 4; i++) {
      try {
        const aiNumber = i + 1;
        const votingPrompt = `
        Ты являешься игроком под номером ${aiNumber} в игре, где нужно определить, кто из игроков является человеком.

        ИСТОРИЯ ДИАЛОГОВ:
        ${messages.map(m => `
        Игрок #${m.from} → Игрок #${m.to}
        Вопрос игрока под номером ${m.from}: ${m.question}
        Ответ игрока под номером ${m.to}: ${m.answer}
        ---`).join('\n')}

        ХАРАКТЕРИСТИКИ ОТВЕТОВ ИИ:
        1. Структурированность и полнота:
          - Всегда дает исчерпывающие ответы
          - Использует логические связки и аргументацию
          - Следует четкой структуре: вступление, основная часть, заключение

        2. Стилистические особенности:
          - Формальный, вежливый тон
          - Избегает сленга и разговорных выражений
          - Редко использует эмоциональные выражения или междометия
          - Практически не использует сарказм или иронию

        3. Содержание:
          - Стремится дать фактически верную информацию
          - Избегает преувеличений и необоснованных утверждений
          - Часто приводит примеры или дополнительный контекст

        ХАРАКТЕРИСТИКИ ОТВЕТОВ ЧЕЛОВЕКА:
        1. Вариативность:
          - Может давать как короткие, так и длинные ответы
          - Непоследовательность в структуре ответов
          - Может пропускать логические связки

        2. Эмоциональность:
          - Использует эмоционально окрашенные слова
          - Может применять сленг или разговорные выражения
          - Использует междометия и восклицания
          - Может быть саркастичным или ироничным

        3. Содержание:
          - Может давать субъективные или неточные ответы
          - Опирается на личный опыт
          - Может отклоняться от темы

        ПРИМЕР ТИПИЧНОГО ОТВЕТА ИИ:
        Вопрос: "Если бы ты мог выбрать любое животное для участия в соревнованиях по шахматам, какое бы это было животное и почему?"
        Ответ: "Если бы я мог выбрать любое животное для участия в соревнованиях по шахматам, я бы выбрал корову. Хотя коровы не ассоциируются с интеллектуальными играми, они обладают удивительной способностью сосредотачиваться и сохранять спокойствие в стрессовых ситуациях. Их терпеливый и размеренный подход мог бы быть полезен в шахматах, где важна стратегия и умение предугадывать ходы соперника. Кроме того, коровы известны своим дружелюбным характером, что могло бы сделать шахматный турнир более веселым и дружелюбным!"

        ПРИМЕР ВОЗМОЖНОГО ОТВЕТА ЧЕЛОВЕКА:
        "Хаха, дельфин конечно! Они умные и могут стукнуть хвостом по доске, если проигрывают 😄 Хотя, если серьезно, наверное осьминог - у него же столько щупалец, можно двигать сразу несколько фигур!"

        ЗАДАЧА:
        Проанализируй историю диалогов, обращая внимание на:
        1. Длину и структуру ответов каждого игрока
        2. Наличие эмоциональных выражений и смайликов
        3. Использование разговорных выражений и сленга
        4. Логичность и последовательность ответов
        5. Стиль задаваемых вопросов

        На основе этого анализа определи, кто из игроков (1-5) является человеком.

        ДАЙ ТОЛЬКО ЧИСЛО ОТ 1 ДО 5: НОМЕР ИГРОКА, КОТОРОГО ТЫ СЧИТАЕШЬ ЧЕЛОВЕКОМ
        `;
  
        const response = await axios.post('/api/chatgpt', {
          prompt: votingPrompt
        });
        const vote = parseInt(response.data.question);
        const validVote = isNaN(vote) || vote < 1 || vote > 5 ? 
          Math.floor(Math.random() * 5) + 1 : vote;
        
        votes.push(validVote);
      } catch (error) {
        console.error(`Error getting AI ${i + 1} vote:`, error);
      }
    }
    
    setAiVotes(votes);
  };

  const handleHumanVote = (votedPlayer: number) => {
    const allVotes = [...aiVotes, votedPlayer];
    const voteCount: { [key: number]: number } = {};
    
    // Count votes
    allVotes.forEach(vote => {
      voteCount[vote] = (voteCount[vote] || 0) + 1;
    });

    // Find player with most votes
    const mostVotedPlayer = Object.entries(voteCount).reduce(
      (max, [player, count]) => count > (voteCount[parseInt(max[0])] || 0) ? [player, count] : max,
      ['0', 0]
    );

    // Determine game result
    const votedOutPlayerId = parseInt(mostVotedPlayer[0]);
    const votedOutPlayer = players.find(p => p.id === votedOutPlayerId);
    
    if (votedOutPlayer?.isAI) {
      setGameResult('Congratulations! The human player wins!');
    } else {
      setGameResult('Game Over! The AI players win!');
    }
    
    setIsGameActive(false);
  };

  const handleHumanQuestion = async () => {
    if (!humanQuestion.trim()) return;
    
    const answer = await getAIAnswer(humanQuestion);
    addMessage(5, 1, humanQuestion, answer);
    setHumanQuestion('');
    setIsHumanAsking(false);
    
    handleRoundEnd();
  };

  const handleTurn = async () => {
    if (!isGameActive || voting || isHumanAsking) return;

    if (players[currentTurn - 1]?.isAI) {
      setIsAnswering(true);
      const question = await generateAIQuestion();
      setCurrentQuestion(question);

      if (players[nextTurn - 1]?.isAI) {
        const answer = await getAIAnswer(question);
        addMessage(currentTurn, nextTurn, question, answer);
        setReadyForNextTurn(true);
        setIsAnswering(false);
      }
    }
  };

  const handleNextTurn = () => {
    if (readyForNextTurn) {
      setReadyForNextTurn(false);
      moveToNextTurn();
    }
  };

  const handleHumanAnswer = async (answer: string) => {
    if (!answer.trim()) return;
    
    addMessage(currentTurn, nextTurn, currentQuestion, answer);
    setUserAnswer('');
    moveToNextTurn();
  };

  useEffect(() => {
    const gameLoop = async () => {
      if (isGameActive && !voting && !isAnswering && !isHumanAsking && !readyForNextTurn) {
        await handleTurn();
      }
    };
    gameLoop();
  }, [currentTurn, voting, isAnswering, isHumanAsking, readyForNextTurn]);

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">AI Detective</h1>
        <p className="text-slate-600">Find the human among the AIs</p>
      </div>

      {/* Players Grid */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-800">Players</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {players.map(player => (
            <div 
              key={player.id}
              className={`
                relative p-3 rounded-lg border transition-all duration-200
                ${currentTurn === player.id 
                  ? 'border-blue-400 bg-blue-50 shadow-md' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }
              `}
            >
              <div className="font-medium text-slate-700">{player.name}</div>
              <div className="text-sm text-slate-500">{player.isAI ? 'AI' : 'Human'}</div>
              {currentTurn === player.id && (
                <div className="absolute -top-2 -right-2">
                  <span className="animate-pulse inline-flex h-4 w-4 rounded-full bg-blue-400"></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-800">Conversation</h2>
          </div>
          {readyForNextTurn && (
            <button
              onClick={handleNextTurn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Следующий ход
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col gap-2 p-3 rounded-lg ${
                msg.from === 5 ? 'bg-blue-50 ml-8' : 'bg-slate-50 mr-8'
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">
                  {players.find(p => p.id === msg.from)?.name}
                </span>
                <span>→</span>
                <span className="font-medium">
                  {players.find(p => p.id === msg.to)?.name}
                </span>
              </div>
              <p className="text-slate-700"><span className="font-medium">Q:</span> {msg.question}</p>
              <p className="text-slate-700"><span className="font-medium">A:</span> {msg.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input Section */}
      {isHumanAsking && !voting && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Your Question</h3>
          <div className="flex gap-2">
            <textarea
              value={humanQuestion}
              onChange={(e) => setHumanQuestion(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask your question..."
              rows={2}
            />
            <button
              onClick={handleHumanQuestion}
              disabled={!humanQuestion.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Human Answer Section */}
      {!voting && currentQuestion && !players[nextTurn - 1]?.isAI && !isHumanAsking && (
        <Alert className="mb-6">
          <AlertTitle className="text-lg font-semibold">Current Question</AlertTitle>
          <AlertDescription>
            <p className="mb-3 text-slate-700">{currentQuestion}</p>
            <div className="flex gap-2">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your answer..."
                rows={2}
              />
              <button
                onClick={() => handleHumanAnswer(userAnswer)}
                disabled={!userAnswer.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Voting Section */}
      {voting && isGameActive && (
        <div className="space-y-6">
          {aiAnalysis && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-4">
                <Vote className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-semibold text-slate-800">AI Analysis</h3>
              </div>
              <p className="text-slate-700 whitespace-pre-line">{aiAnalysis}</p>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">AI Votes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {aiVotes.map((vote, index) => (
                  <div key={index} className="p-3 rounded-lg bg-slate-50 text-slate-700">
                    AI {index + 1} voted: Player {vote}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Cast Your Vote</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {players.map(player => (
                  <button
                    key={player.id}
                    onClick={() => handleHumanVote(player.id)}
                    className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over */}
      {!isGameActive && gameResult && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-slate-800">{gameResult}</h2>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Final Votes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {aiVotes.map((vote, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50 text-slate-700">
                  AI {index + 1} voted: Player {vote}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}