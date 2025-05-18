import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BookOpen, Atom, ChevronUp, LineChart, Zap } from 'lucide-react';

const StudentAIIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Container principal avec dégradé pour le fond futuriste - différent selon le mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-100 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 rounded-3xl overflow-hidden">
        {/* Éléments d'arrière-plan (grilles et cercles) */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f620_1px,transparent_1px),linear-gradient(to_bottom,#3b82f620_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
        
        {/* Cercles lumineux d'arrière-plan */}
        <motion.div
          className="absolute top-10 right-20 w-32 h-32 rounded-full bg-blue-500/10 filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-indigo-500/10 filter blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Bureau avec effets lumineux */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-3/4 h-10 bg-slate-300/70 dark:bg-slate-800/70 rounded-full blur-sm"></div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-5/6 h-2 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 rounded-full"></div>
        
        {/* Étudiant stylisé */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          {/* Corps/silhouette */}
          <div className="relative w-32 h-40 bg-blue-200 dark:bg-slate-800 rounded-t-3xl overflow-hidden">
            {/* Tête */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-blue-100 dark:bg-slate-700 rounded-full">
              {/* Visage simplifié */}
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-1 bg-blue-500 dark:bg-blue-400 rounded-full absolute top-10"></div>
              </div>
            </div>
            
            {/* Bras gauche */}
            <div className="absolute top-24 left-0 w-10 h-5 bg-slate-700 rounded-full transform -rotate-12"></div>
            
            {/* Bras droit - tenant quelque chose */}
            <div className="absolute top-24 right-0 w-14 h-5 bg-slate-700 rounded-full transform rotate-12"></div>
          </div>
        </div>
        
        {/* Ordinateur portable avec effet lumineux */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <motion.div 
            className="w-48 h-28 bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 overflow-hidden"
            animate={{
              boxShadow: ['0 0 15px rgba(59, 130, 246, 0.3)', '0 0 25px rgba(59, 130, 246, 0.5)', '0 0 15px rgba(59, 130, 246, 0.3)']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Écran d'ordinateur avec interface futuriste */}
            <div className="p-2 h-full">
              {/* Interface AI */}
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-[6px] text-blue-400">SmartCoach AI</div>
                </div>
                
                <div className="flex-1 bg-blue-50 dark:bg-slate-800 rounded-sm p-1 relative">
                  {/* Code/UI simulé */}
                  <div className="flex flex-col gap-0.5">
                    <motion.div 
                      className="h-0.5 bg-blue-500/50 rounded w-full"
                      animate={{ width: ['30%', '80%', '45%', '70%', '30%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    ></motion.div>
                    <motion.div 
                      className="h-0.5 bg-indigo-500/50 rounded"
                      animate={{ width: ['70%', '40%', '85%', '35%', '70%'] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    ></motion.div>
                    <motion.div 
                      className="h-0.5 bg-purple-500/50 rounded"
                      animate={{ width: ['50%', '75%', '35%', '65%', '50%'] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    ></motion.div>
                  </div>
                  
                  {/* Graphique de progression */}
                  <div className="absolute bottom-1 left-1 right-1 h-6">
                    <div className="h-full flex items-end gap-0.5">
                      {[...Array(8)].map((_, i) => {
                        const height = 30 + (i * 5) + (Math.sin(i * 0.8) * 15);
                        return (
                          <motion.div
                            key={`bar-${i}`}
                            className="flex-1 bg-blue-500/70 rounded-t-sm"
                            initial={{ height: '10%' }}
                            animate={{ height: `${height}%` }}
                            transition={{
                              duration: 1.2 + (i * 0.1),
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: "easeInOut"
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Clavier simplifié */}
          <motion.div
            className="w-40 h-2 bg-slate-800 rounded-b-md mx-auto border-x border-b border-slate-700"
            animate={{ y: [0, -0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
        </div>
        
        {/* Hologramme d'assistant IA */}
        <motion.div
          className="absolute bottom-24 right-12 w-28 h-36"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Effet de base holographique */}
          <div className="absolute bottom-0 w-full h-2 bg-blue-500/40 rounded-full blur-sm"></div>
          
          {/* Silhouette IA avec effet holographique */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-indigo-500/50 dark:from-blue-500/20 dark:to-indigo-500/40 rounded-xl opacity-80 dark:opacity-70"
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-1 border border-blue-400/30 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Visage/Tête IA */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-blue-400/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-blue-500/70 dark:text-blue-200/70" />
            </div>
            
            {/* Corps IA */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-16 h-10 bg-blue-400/10 rounded-lg">
              {/* Animation de pulsation */}
              <motion.div 
                className="absolute inset-2 rounded-md border border-blue-300/20"
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(96, 165, 250, 0)',
                    '0 0 8px rgba(96, 165, 250, 0.3)',
                    '0 0 0px rgba(96, 165, 250, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            {/* Lignes de scan/données */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`scan-${i}`}
                  className="absolute left-0 right-0 h-0.5 bg-blue-400/30"
                  style={{ top: `${20 + i * 15}%` }}
                  animate={{ 
                    left: i % 2 === 0 ? ['0%', '80%', '0%'] : ['80%', '0%', '80%'],
                    width: ['60%', '30%', '60%']
                  }}
                  transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          </motion.div>
          
          {/* Petits éléments orbitant autour de l'hologramme */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`orbit-${i}`}
              className="absolute rounded-full bg-blue-400/60 w-1.5 h-1.5"
              style={{
                top: `${30 + i * 20}%`,
                left: `${i % 2 === 0 ? -5 : 100}%`,
              }}
              animate={{
                left: i % 2 === 0 ? ['-5%', '105%', '-5%'] : ['105%', '-5%', '105%']
              }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>
        
        {/* Icônes flottantes d'apprentissage */}
        <div className="absolute inset-0">
          {/* Livre */}
          <motion.div
            className="absolute top-16 left-12"
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg shadow-md">
              <BookOpen className="w-8 h-8 text-blue-600/90 dark:text-blue-300/70" />
            </div>
          </motion.div>
          
          {/* Atome/Chimie */}
          <motion.div
            className="absolute top-40 left-20"
            animate={{ y: [0, -6, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg shadow-md">
              <Atom className="w-6 h-6 text-purple-600/90 dark:text-purple-300/70" />
            </div>
          </motion.div>
          
          {/* Graphique/Données */}
          <motion.div
            className="absolute top-28 right-16"
            animate={{ y: [0, -7, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg shadow-md">
              <LineChart className="w-7 h-7 text-green-600/90 dark:text-green-300/70" />
            </div>
          </motion.div>
          
          {/* Cerveau/IA */}
          <motion.div
            className="absolute top-48 right-30"
            animate={{ y: [0, -5, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >
            <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg shadow-md">
              <Brain className="w-6 h-6 text-indigo-600/90 dark:text-indigo-300/70" />
            </div>
          </motion.div>
          
          {/* Éclair/Énergie */}
          <motion.div
            className="absolute top-20 right-40"
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg shadow-md">
              <Zap className="w-7 h-7 text-yellow-500/90 dark:text-yellow-300/70" />
            </div>
          </motion.div>
        </div>
        
        {/* Particules qui montent */}
        <div className="absolute bottom-0 inset-x-0 h-32 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                backgroundColor: ['#60a5fa', '#818cf8', '#a78bfa', '#c084fc'][i % 4],
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2
              }}
              animate={{
                y: [100, -100],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAIIllustration;
