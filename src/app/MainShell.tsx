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
import { TABS, useNav } from './navigation';
import { screens } from './screens';

export function MainShell() {
  usePlaybackClock();
  useGenerationClock();
  const tab = useNav((s) => s.tab);
  const stacks = useNav((s) => s.stacks);
  const depth = stacks[tab].length;
  const miniVisible = usePlayer((s) => s.currentId !== null && !s.expanded);
  const fullVisible = usePlayer((s) => s.currentId !== null && s.expanded && !s.nightMode);
  // Spec 6.7: Die Nacht-Ansicht ist nur der Vollbild-Player; eingeklappt bleibt der Mini-Player.
  const nightVisible = usePlayer((s) => s.currentId !== null && s.expanded && s.nightMode);

  // Richtung der Animation: tiefer = Push von rechts, flacher = Pop von links.
  const prev = useRef({ tab, depth });
  const p = prev.current;
  const direction = p.tab !== tab ? 'none' : depth > p.depth ? 'push' : depth < p.depth ? 'pop' : 'none';
  useEffect(() => {
    prev.current = { tab, depth };
  });

  return (
    <div className={`${styles.shell} ${miniVisible ? styles.withMini : ''}`}>
      {/* Alle Screens aller Tab-Stacks bleiben montiert (iOS: Zustand bleibt beim Zurückgehen und Tab-Wechsel). */}
      {TABS.flatMap((tabId) =>
        stacks[tabId].map((screen, i) => {
          const isTop = tabId === tab && i === stacks[tabId].length - 1;
          const Screen = screens[screen.name];
          return (
            <main
              key={`${tabId}:${i}:${screen.name}:${JSON.stringify(screen.params ?? {})}`}
              hidden={!isTop}
              className={`${styles.content} ${isTop ? styles[direction] : ''}`}
            >
              <Screen params={screen.params} />
            </main>
          );
        }),
      )}
      <MiniPlayer />
      <TabBar />
      {fullVisible && <FullPlayer />}
      {nightVisible && <NightPlayer />}
      <Banner />
    </div>
  );
}
