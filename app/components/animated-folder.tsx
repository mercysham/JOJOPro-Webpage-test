'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  image: string;
}

interface AnimatedFolderProps {
  title: string;
  projects: Project[];
  className?: string;
}

export function AnimatedFolder({ title, projects, className }: AnimatedFolderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleProjectClick = (project: Project, index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      setSourceRect(card.getBoundingClientRect());
      setActiveIndex(index);
      setActiveId(project.id);
    }
  };

  const handleCloseLightbox = () => {
    setActiveIndex(null);
    setSourceRect(null);
  };

  const handleCloseComplete = () => {
    setActiveId(null);
  };

  const handleNavigate = (index: number) => {
    setActiveIndex(index);
    setActiveId(projects[index]?.id || null);
  };

  return (
    <React.Fragment>
      <div
        className={`relative flex flex-col items-center justify-center
          p-8 rounded-2xl cursor-pointer
          bg-card border border-border
          transition-all duration-500 ease-out
          hover:shadow-2xl hover:shadow-accent/10
          hover:border-accent/30
          group ${className}`}
        style={{
          minWidth: '280px',
          minHeight: '320px',
          perspective: '1000px'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at 50% 70%, var(--accent) 0%, transparent 70%)',
            opacity: isHovered ? 0.08 : 0
          }}
        />
        
        <div className="relative flex items-center justify-center mb-4" style={{ height: '160px', width: '200px' }}>
          <div
            className="absolute w-32 h-24 bg-folder-back rounded-lg shadow-md"
            style={{
              transformOrigin: 'bottom center',
              transform: isHovered ? 'rotateX(-15deg)' : 'rotateX(0deg)',
              transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 10
            }}
          />
          
          <div
            className="absolute w-12 h-4 bg-folder-tab rounded-t-md"
            style={{
              top: 'calc(50% - 48px - 12px)',
              left: 'calc(50% - 64px + 16px)',
              transformOrigin: 'bottom center',
              transform: isHovered ? 'rotateX(-25deg) translateY(-2px)' : 'rotateX(0deg)',
              transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 10
            }}
          />
          
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                image={project.image}
                title={project.title}
                delay={index * 80}
                isVisible={isHovered}
                index={index}
                onClick={() => handleProjectClick(project, index)}
                isSelected={activeId === project.id}
              />
            ))}
          </div>
          
          <div
            className="absolute w-32 h-24 bg-folder-front rounded-lg shadow-lg"
            style={{
              top: 'calc(50% - 48px + 4px)',
              transformOrigin: 'bottom center',
              transform: isHovered ? 'rotateX(25deg) translateY(8px)' : 'rotateX(0deg)',
              transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 30
            }}
          />
          
          <div
            className="absolute w-32 h-24 rounded-lg overflow-hidden pointer-events-none"
            style={{
              top: 'calc(50% - 48px + 4px)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
              transformOrigin: 'bottom center',
              transform: isHovered ? 'rotateX(25deg) translateY(8px)' : 'rotateX(0deg)',
              transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 31
            }}
          />
        </div>
        
        <h3
          className="text-lg font-semibold text-foreground mt-4 transition-all duration-300"
          style={{ transform: isHovered ? 'translateY(4px)' : 'translateY(0)' }}
        >
          {title}
        </h3>
        
        <p
          className="text-sm text-muted-foreground transition-all duration-300"
          style={{ opacity: isHovered ? 0.7 : 1 }}
        >
          {projects.length} projects
        </p>
        
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-muted-foreground transition-all duration-300"
          style={{
            opacity: isHovered ? 0 : 0.6,
            transform: isHovered ? 'translateY(10px)' : 'translateY(0)'
          }}
        >
          <span>Hover to explore</span>
        </div>
      </div>
    </React.Fragment>
  );
}

const ProjectCard = React.forwardRef<HTMLDivElement, {
  image: string;
  title: string;
  delay: number;
  isVisible: boolean;
  index: number;
  onClick: () => void;
  isSelected: boolean;
}>(
  ({ image, title, delay, isVisible, index, onClick, isSelected }, ref) => {
    const rotations = [-12, 0, 12];
    const translations = [-55, 0, 55];

    return (
      <div
        ref={ref}
        className={`absolute w-20 h-28 rounded-lg overflow-hidden shadow-xl
          bg-card border border-border
          cursor-pointer hover:ring-2 hover:ring-accent/50
          ${isSelected ? 'opacity-0' : ''}`}
        style={{
          transform: isVisible
            ? `translateY(-90px) translateX(${translations[index]}px) rotate(${rotations[index]}deg) scale(1)`
            : 'translateY(0px) translateX(0px) rotate(0deg) scale(0.5)',
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
          zIndex: 10 - index,
          left: '-40px',
          top: '-56px'
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <img src={image || '/placeholder.svg'} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-medium text-primary-foreground truncate">
          {title}
        </p>
      </div>
    );
  }
);

ProjectCard.displayName = 'ProjectCard';