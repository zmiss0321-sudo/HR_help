import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Role } from '../types';

interface HomePageProps {
  selectedRole: Role;
  onSelectRole: (role: Role) => void;
  onEnterWorkspace: () => void;
}

const roles: Array<{ key: Role; title: string; desc: string }> = [
  {
    key: 'intern',
    title: '实习生',
    desc: '看清本周任务，轻量反馈卡点'
  },
  {
    key: 'mentor',
    title: 'Mentor',
    desc: '少重复讲解，只处理关键卡点'
  },
  {
    key: 'hr',
    title: 'HR',
    desc: '少私聊催促，快速看见异常'
  }
];

function clampIndex(index: number) {
  return Math.max(0, Math.min(roles.length - 1, index));
}

export function HomePage({ selectedRole, onSelectRole, onEnterWorkspace }: HomePageProps) {
  const activeIndex = useMemo(() => {
    const found = roles.findIndex((role) => role.key === selectedRole);
    return found === -1 ? 0 : found;
  }, [selectedRole]);
  const wheelLockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  const selectIndex = (nextIndex: number) => {
    const clamped = clampIndex(nextIndex);
    if (clamped === activeIndex) return;
    setDirection(clamped > activeIndex ? 'down' : 'up');
    onSelectRole(roles[clamped].key);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onEnterWorkspace();
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectIndex(activeIndex + 1);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectIndex(activeIndex - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, onEnterWorkspace]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 16 || wheelLockRef.current) return;
    wheelLockRef.current = true;
    selectIndex(activeIndex + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 280);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;
    if (startY == null || endY == null || Math.abs(startY - endY) < 28) return;
    selectIndex(activeIndex + (startY > endY ? 1 : -1));
  };

  const current = roles[activeIndex];
  const previous = roles[activeIndex - 1];
  const next = roles[activeIndex + 1];

  return (
    <section className="home-cover" aria-label="实习能量站入口">
      <div className="home-hero">
        <h1>实习能量站</h1>
        <p>新人少问，Mentor 少讲，HR 少催</p>
      </div>

      <div className="role-picker-wrap">
        <button
          className="role-arrow"
          type="button"
          aria-label="选择上一个身份"
          disabled={!previous}
          onClick={() => selectIndex(activeIndex - 1)}
        >
          <ChevronUp size={22} strokeWidth={1.8} />
        </button>

        <div
          className="role-picker"
          role="listbox"
          aria-label="选择身份"
          aria-activedescendant={`role-${current.key}`}
          tabIndex={0}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="role-ghost role-ghost-top" aria-hidden="true">
            {previous?.title}
          </div>

          <div className="role-lines" />
          <div
            id={`role-${current.key}`}
            className={`role-current ${direction ? `is-${direction}` : ''}`}
            role="option"
            aria-selected="true"
            key={current.key}
          >
            <strong>{current.title}</strong>
            <span>{current.desc}</span>
          </div>
          <div className="role-lines" />

          <div className="role-ghost role-ghost-bottom" aria-hidden="true">
            {next?.title}
          </div>
        </div>

        <button
          className="role-arrow"
          type="button"
          aria-label="选择下一个身份"
          disabled={!next}
          onClick={() => selectIndex(activeIndex + 1)}
        >
          <ChevronDown size={22} strokeWidth={1.8} />
        </button>

        <button className="home-enter" type="button" onClick={onEnterWorkspace}>
          进入 <ArrowRight size={16} strokeWidth={1.9} />
        </button>
      </div>
    </section>
  );
}
