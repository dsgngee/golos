import { useEffect, useRef } from 'react';
import { Banner } from '../ui/Banner';
import { TabBar } from '../ui/TabBar';
import styles from './MainShell.module.css';
import { useNav } from './navigation';
import { screens } from './screens';

export function MainShell() {
  const tab = useNav((s) => s.tab);
  const stack = useNav((s) => s.stacks[s.tab]);
  const top = stack[stack.length - 1];
  const Screen = screens[top.name];

  // Richtung der Animation: tiefer = Push von rechts, flacher = Pop von links.
  const prev = useRef({ tab, depth: stack.length });
  const p = prev.current;
  const direction = p.tab !== tab ? 'none' : stack.length > p.depth ? 'push' : stack.length < p.depth ? 'pop' : 'none';
  useEffect(() => {
    prev.current = { tab, depth: stack.length };
  });

  return (
    <div className={styles.shell}>
      <main key={`${tab}:${stack.length}:${top.name}`} className={`${styles.content} ${styles[direction]}`}>
        <Screen params={top.params} />
      </main>
      <TabBar />
      <Banner />
    </div>
  );
}
