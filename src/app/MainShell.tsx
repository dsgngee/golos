import { useEffect, useRef } from 'react';
import { useGenerationClock } from '../features/create/useGenerationClock';
import { FullPlayer } from '../features/player/FullPlayer';
import { MiniPlayer } from '../features/player/MiniPlayer';
import { NightPlayer } from '../features/player/NightPlayer';
import { usePlaybackClock } from '../features/player/usePlaybackClock';
import { usePlayer } from '../store/player';
import { Banner } from '../ui/Banner';
import { TabBar } from '../ui/TabBar';
import styles from './MainShell.module.css';
import { useNav } from './navigation';
import { screens } from './screens';

export function MainShell() {
  usePlaybackClock();
  useGenerationClock();
  const tab = useNav((s) => s.tab);
  const stack = useNav((s) => s.stacks[s.tab]);
  const top = stack[stack.length - 1];
  const Screen = screens[top.name];
  const miniVisible = usePlayer((s) => s.currentId !== null && !s.expanded);
  const fullVisible = usePlayer((s) => s.currentId !== null && s.expanded && !s.nightMode);
  // Spec 6.7: Die Nacht-Ansicht ist nur der Vollbild-Player; eingeklappt bleibt der Mini-Player.
  const nightVisible = usePlayer((s) => s.currentId !== null && s.expanded && s.nightMode);

  // Richtung der Animation: tiefer = Push von rechts, flacher = Pop von links.
  const prev = useRef({ tab, depth: stack.length });
  const p = prev.current;
  const direction = p.tab !== tab ? 'none' : stack.length > p.depth ? 'push' : stack.length < p.depth ? 'pop' : 'none';
  useEffect(() => {
    prev.current = { tab, depth: stack.length };
  });

  return (
    <div className={`${styles.shell} ${miniVisible ? styles.withMini : ''}`}>
      <main key={`${tab}:${stack.length}:${top.name}`} className={`${styles.content} ${styles[direction]}`}>
        <Screen params={top.params} />
      </main>
      <MiniPlayer />
      <TabBar />
      {fullVisible && <FullPlayer />}
      {nightVisible && <NightPlayer />}
      <Banner />
    </div>
  );
}
