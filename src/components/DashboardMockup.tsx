import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, BookOpen, CheckCircle2, ClipboardList, Clock, Award, Brain, LineChart } from 'lucide-react';

const DashboardMockup: React.FC = () => {
  return (
    <motion.div 
      className="relative max-w-[600px] w-full aspect-[4/3] bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Header de la maquette */}
      <div className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600 p-3 flex items-center justify-between">
        <div className="flex items-center text-white gap-2">
          <Brain className="h-5 w-5" />
          <span className="font-medium text-sm">SmartPrep AI Dashboard</span>
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-white/20"></div>
          <div className="h-3 w-3 rounded-full bg-white/20"></div>
          <div className="h-3 w-3 rounded-full bg-white/20"></div>
        </div>
      </div>
      
      {/* Contenu du dashboard */}
      <div className="p-3 flex h-[calc(100%-3.5rem)]">
        {/* Sidebar */}
        <div className="w-16 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 pt-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <Award className="h-5 w-5" />
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1 overflow-hidden p-4">
          {/* Titre de section */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Progression du programme</h3>
            <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
              Semaine 3/12
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Exercices</span>
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">48/60</span>
                <span className="text-xs text-green-500">+8 aujourd'hui</span>
              </div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">Temps d'étude</span>
                <Clock className="h-3 w-3 text-blue-500" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">6h22</span>
                <span className="text-xs text-blue-500">+2h hier</span>
              </div>
            </div>
          </div>
          
          {/* Prochain examen */}
          <div className="mb-4">
            <h4 className="font-medium text-xs text-slate-500 mb-2">Prochain examen simulé</h4>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">Mathématiques Avancées</div>
                  <div className="text-xs text-slate-500">Demain, 14:00-16:30</div>
                </div>
                <motion.div 
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full cursor-pointer font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Réviser
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Graphique de performance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-xs text-slate-500">Performance</h4>
              <div className="text-xs text-slate-400">30 derniers jours</div>
            </div>
            <div className="h-20 flex items-end gap-1">
              {Array.from({ length: 14 }).map((_, i) => {
                // Générer des hauteurs aléatoires mais avec une tendance à la hausse
                const baseHeight = 20 + i * 1.5;
                const variance = Math.random() * 10 - 5;
                const height = Math.max(5, Math.min(100, baseHeight + variance));
                
                return (
                  <div 
                    key={i} 
                    className="flex-1 bg-blue-500/80 dark:bg-blue-600/80 rounded-t-sm" 
                    style={{ height: `${height}%` }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardMockup;
